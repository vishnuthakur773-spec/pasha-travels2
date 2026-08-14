# Pasha Travels — Step-by-Step Launch Guide

Everything below is free — no credit card needed at any step. Do them in order.

## What's in this folder

- `index.html` — the whole website (flights/hotels search, destinations,
  packages, offers, the Apply Visas section, footer)
- `logo.jpeg` — your logo
- `netlify/functions/flight-search.js` — a serverless function that securely
  fetches real flight data (keeps your API secret hidden from visitors)
- `netlify.toml` — tells Netlify where that function lives

Contact details are already filled in throughout the site:
- Flights & Packages: +91 98141 45209 · +91 99880 81517 · +91 96465 45209 · pasha.travels@gmail.com
- Visa & Immigration: +91 96465 45209 · advocatevishnu28@gmail.com
- Address: Pasha Travels, DC Road, Opposite Bhagat Singh Statue & Central Jail, Hoshiarpur - 146001, Punjab

---

## STEP 1 — Get a free flight-data API key (~1 min)

**Note:** Amadeus shut down its self-service developer portal for good in
July 2026 — that's not something you did wrong, registration is simply gone
for individual developers now. This site uses **Duffel** instead, which is
free to start and gives you a key instantly.

1. Go to **https://app.duffel.com/join** and sign up (free, no card needed).
2. You're dropped straight into your dashboard in **test mode**.
3. Click **More → Developers** in the navigation, then **Access tokens**.
4. Make sure you're in **test mode** (there's a toggle), then click
   **Create test token**.
5. Copy that token — it starts with `duffel_test_...`. You'll need it in Step 3.

Test mode uses a sandbox airline ("Duffel Airways") with simulated schedules
and prices, not real live fares — this is normal for a free tier and is
enough for a genuinely working search box. If you ever want real live fares
and actual bookings, Duffel's live mode needs identity verification and a
payment method on file (bookings are pay-per-order, not pay-per-search) —
that's a separate step for later, not needed to get the site working now.

## STEP 2 — Put the site online with Netlify (~2 min)

1. Go to **https://app.netlify.com** and sign up free (no card).
2. On the dashboard: **Add new site -> Deploy manually**.
3. Drag this **entire folder** in — `index.html`, `logo.jpeg`, `netlify.toml`,
   and the `netlify` folder together, all at once.
4. You'll get a live link immediately, like `random-name-123.netlify.app`.
   To rename it: **Site settings -> Change site name** -> e.g. `pashatravels`.
   Your link becomes `pashatravels.netlify.app` — free, and it works right now.

## STEP 3 — Connect your Duffel key to the live site (~1 min)

1. In your Netlify site: **Site settings -> Environment variables**.
2. Add one variable exactly as named:
   - `DUFFEL_API_KEY` = (the `duffel_test_...` token from Step 1)
3. Go to **Deploys -> Trigger deploy -> Deploy site**, so the function picks up
   the new variable.

## STEP 4 — Turn on email notifications for the visa form (~1 min)

1. Same Netlify site: **Site settings -> Forms -> Form notifications**.
2. **Add notification -> Email notification**.
3. Type in the email you want visa enquiries sent to (e.g. advocatevishnu28@gmail.com),
   and save.

Now every time someone submits the "Describe Your Case" form, it lands in
that inbox automatically — and you can also see every submission any time
under **Forms** in the Netlify dashboard.

## STEP 5 — Test it

- Open your live site -> Flights tab -> search `DEL -> BOM` a few weeks out.
  You should see flight rows with airline, times, and price (sandbox data
  in test mode, not real live fares — see the note in Step 1).
- Go to **Apply Visas -> Describe Your Case**, fill it in, hit **Send to
  Pasha Travels** — check the inbox from Step 4.
- Try **Send via WhatsApp Instead** too — it should open WhatsApp pre-filled,
  addressed to +91 96465 45209, ready for you to tap send.

Your site is now genuinely live and working — free.

---

## If something doesn't work

- **"Server is missing the DUFFEL_API_KEY..."** — Step 3 wasn't done, or you
  forgot to redeploy after adding the variable.
- **"Duffel could not complete that search"** — double-check the token was
  copied fully, with no extra spaces, and that it's a `duffel_test_...` token.
- **"No flights found"** — test mode mainly returns the sandbox airline;
  try a major route (DEL-BOM, DEL-BLR) a few weeks in advance.
- **Visa form doesn't email you** — Step 4 wasn't completed, or check your
  spam folder the first time.
- Opening `index.html` straight from your computer (not deployed) won't run
  the flight search or the form — both need to be live on Netlify to work.

---

## Making changes later

Everything editable lives in plain sight in `index.html`:
- Contact numbers/emails/address — in the footer section and the Apply Visas
  section, as plain text/links (search for the number or email to find it).
- The WhatsApp number the visa button sends to — one line near the top of
  the `<script>` tag, clearly marked `EASY-EDIT CONFIG`.
- Colors, section order, wording — all plain HTML/CSS in one file, no build
  step required.

Simplest way to make future changes: just bring `index.html` back to me
(Claude) and describe what you want added, removed, or changed — I can edit
the file directly. After any edit, re-drag the folder into Netlify (or connect
Netlify to a GitHub repo instead, so pushes auto-deploy — worth doing once
you're past the early tinkering stage).

## Adding new holiday packages every week

The Holiday Packages section is generated from one list, called `PACKAGES`,
near the top of the `<script>` tag in `index.html`. This is the only thing
that needs to change to add, update, or remove a weekly deal — the cards on
the page rebuild themselves from whatever is in that list.

Each package looks like this:

```js
{ city: 'Dubai, UAE', duration: '5N/6D', price: 42999, img: 'https://...', isNew: true },
```

- `city` — the name shown on the card
- `duration` — e.g. `'5N/6D'` for 5 nights / 6 days
- `price` — just the number, no commas or ₹ sign
- `img` — a photo link (from Unsplash: find a photo, right-click it, "Copy
  Image Address")
- `isNew` — `true` shows a red "New This Week" ribbon on the card; set it
  back to `false` once it's no longer the week's new deal

**To add a package:** copy one whole line, paste a new one below it, edit
the values.
**To remove one:** delete its whole line.
**To reorder:** move lines up or down — left-to-right order on the page
matches top-to-bottom order in the list.

Two ways to actually do this each week:
1. **Send it to me** — message me the new deal (destination, duration, price,
   a photo if you have one) and I'll edit `PACKAGES` and hand you the updated
   file, ready to re-drag into Netlify.
2. **Edit it yourself** — open `index.html` in any text editor, find
   `PACKAGES`, and edit the list directly following the format above. No
   other part of the code needs to change.

After any change, redeploy the same way as before (re-drag the folder into
Netlify) for it to go live.


---

## Setting up your own login to add flyers & packages (no more redeploying)

This gives you a real login page at **pashatravels.in/admin** where you can
add, edit, or remove Special Fares and Holiday Packages yourself — no code,
no Netlify dashboard, no dragging folders, no messaging me for routine
updates. Saving there publishes to your live site automatically within
about a minute.

This is a one-time setup with a few account-level steps only you can do
(they involve your own logins), then it's done forever.

### Prerequisite — your site needs to be connected to GitHub first

If you haven't already connected your Netlify site to a GitHub repository
(see the earlier section on making updates easier), do that first — this
admin login depends on it. In short: create a free GitHub account, create a
repository, upload this whole folder to it, then in Netlify go to
**Project configuration → Build & deploy → Link repository** and connect it.

### Step 1 — Turn on Identity (Netlify's free login system)

1. Go to your site in Netlify
2. Find **"Identity"** in the left sidebar (if you don't see it, look under
   Project configuration, or search for it in the top search bar)
3. Click **"Enable Identity"**

### Step 2 — Restrict signups to just you

1. Still on the Identity page, find **"Registration"** settings
2. Set it to **"Invite only"** — this stops random people from signing up
   to your admin panel

### Step 3 — Turn on Git Gateway

1. On the same Identity page, find **"Services"**
2. Click **"Enable Git Gateway"**

This is what lets your login save changes directly to GitHub without you
needing your own separate GitHub login every time.

### Step 4 — Invite yourself

1. On the Identity page, click **"Invite users"**
2. Enter your own email address
3. You'll get an email — click the link, set a password

### Step 5 — Log in and start editing

1. Go to **pashatravels.in/admin**
2. Log in with the email/password from Step 4
3. You'll see two sections: **"Special Air Ticket Fares"** and
   **"Holiday Packages"**
4. Click either one, then **"Fares List"** or **"Packages List"**
5. Add a new entry with the **"+"** button, fill in the form (route/city,
   price, a photo — either paste a link or upload one from your computer),
   and click **"Publish"**

That's it — no redeploying, no folders, no code. The live site updates
itself within about a minute of you clicking Publish.

### A couple of honest notes

- Each package/fare now supports **one photo** (not the rotating multi-photo
  effect some cards had before) — this keeps the editor simple and reliable
  for daily use. If you want a specific card to rotate between two photos
  again later, message me and I can set that up manually for that one card.
- If you ever want a category added beyond Fares/Packages (e.g. editable
  Offers), tell me — it's a small addition to `admin/config.yml`.
