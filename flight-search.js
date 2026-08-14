// Serverless function — runs on Netlify's servers, never in the browser.
// This keeps your Duffel API key hidden from visitors. Set it as an
// environment variable in Netlify (Site settings -> Environment variables):
//   DUFFEL_API_KEY
//
// NOTE: Amadeus shut down its self-service developer portal in July 2026,
// so this function calls Duffel (duffel.com) instead — modern flight API,
// free instant test-mode signup, no card required to search.
//
// SWAPPING PROVIDERS LATER: when you get access to a different flight API
// (TBO, Amadeus production, etc.), only THIS file needs to change — swap
// the fetch calls below for the new provider's request/response format,
// and update the environment variable name if needed. The website itself
// (index.html) doesn't need to change; it just expects this function to
// return { offers: [...] } in the same shape as it does now.

exports.handler = async function (event) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const { origin, destination, date, returnDate, adults } = event.queryStringParameters || {};

    if (!origin || !destination || !date) {
      return {
        statusCode: 400,
        headers: cors,
        body: JSON.stringify({ error: "Please provide origin, destination and date." }),
      };
    }

    if (!process.env.DUFFEL_API_KEY) {
      return {
        statusCode: 500,
        headers: cors,
        body: JSON.stringify({
          error: "Server is missing the DUFFEL_API_KEY environment variable. Add it in Netlify > Site settings > Environment variables, then redeploy.",
        }),
      };
    }

    const numAdults = parseInt(adults || "1", 10);
    const passengers = Array.from({ length: numAdults }, () => ({ type: "adult" }));

    // One slice for one-way; two slices (outbound + return) when returnDate is given.
    const slices = [
      {
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departure_date: date,
      },
    ];
    if (returnDate) {
      slices.push({
        origin: destination.toUpperCase(),
        destination: origin.toUpperCase(),
        departure_date: returnDate,
      });
    }

    // Create an offer request, asking Duffel to return matching offers directly.
    const res = await fetch("https://api.duffel.com/air/offer_requests?return_offers=true", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,
        "Content-Type": "application/json",
        "Duffel-Version": "v2",
        Accept: "application/json",
      },
      body: JSON.stringify({
        data: {
          slices,
          passengers,
          cabin_class: "economy",
        },
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        statusCode: 200,
        headers: cors,
        body: JSON.stringify({
          error: "We couldn't complete that search right now. Try a different route/date, or call/WhatsApp us and we'll check availability directly.",
          detail: result.errors || result,
        }),
      };
    }

    const offers = (result.data && result.data.offers) || [];

    return {
      statusCode: 200,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ offers }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
