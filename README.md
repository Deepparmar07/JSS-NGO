# JSS NGO Website

A community-focused website for JSS NGO, with information about the organisation, its projects and events, and ways to volunteer, donate, and get in touch.

**Live website:** [jsngo.netlify.app](https://jsngo.netlify.app/)

## About the project

The project combines a static, multi-page website with an Express API for donations, contact messages, and volunteer applications. The site also includes organisation information, project and event pages, photo and video galleries, and privacy information.

## Features

- Organisation overview, projects, events, and COVID-19 information
- Volunteer information and registration page
- Donation page with Razorpay checkout integration
- Photo and video galleries
- Contact and privacy pages
- Express API routes for payments, contact messages, volunteer applications, and protected donation records
- MongoDB persistence for completed donation records
- Nodemailer email notifications and donation receipts
- Environment-based configuration for database, payment, and email credentials

> **Before going live:** The deployed `api-config.js` points to the Render service. Confirm Render's CORS configuration allows `https://jsngo.netlify.app`, then verify the contact and volunteer forms and configure any required provider credentials. The current Razorpay payment button is kept as the page's payment option, but is **not connected to this backend's order-verification API**. Payments through that button are therefore not automatically saved as donation records in this app's MongoDB or followed by its email receipt flow.

## Go-live checklist

The application code is prepared for separate Netlify (website) and Render (API)
deployments, but production readiness depends on configuring and testing both
services. Do not assume that a successful Render deployment means that payments,
email, and database access have all been verified.

- [x] Set `window.JSS_API_BASE_URL` in `api-config.js` to
  `https://jss-ngo.onrender.com`; the deployed Netlify config was verified.
- [ ] In Render, set `MONGODB_URI`, the Razorpay keys, SMTP settings, `ADMIN_API_KEY`,
  and `FRONTEND_ORIGIN=https://jsngo.netlify.app` as applicable.
- [x] `https://jss-ngo.onrender.com/api/health` reports
  `"database":"connected"`.
- [ ] Confirm the Render CORS preflight response allows origin
  `https://jsngo.netlify.app`. In the latest check, the API returned no
  `Access-Control-Allow-Origin` header for that origin.
- [ ] Add **JSS NGO's own website URL** (`https://jsngo.netlify.app`) to Razorpay
  Website/App details and wait for that website's approval. Approval of another
  site, such as Epixbox, is separate. The Razorpay dashboard screenshot indicated
  an estimated review time of 24–48 hours; check the dashboard for the current
  status and any further requests.
- [ ] While JSS NGO review is pending, test the current Razorpay button in Test
  Mode. Verify payment in the Razorpay dashboard. The button does not currently
  create a donation record in this app's MongoDB or trigger its backend receipt
  email; connect it to the backend payment API before relying on those features.
- [ ] Use live Razorpay payments only after JSS NGO is approved and the test
  payment flow succeeds.
- [ ] Check that public donation, contact, and volunteer forms reach the Render
  API and that the intended recipient receives email.

The Razorpay review estimate is not a guarantee, and this repository cannot show
whether an application has been submitted or approved. Verify approval in the
Razorpay dashboard. Never commit production secrets or put them in frontend code.

## Technology

| Area | Technologies |
| --- | --- |
| Website | HTML, CSS, browser JavaScript, Bootstrap, jQuery |
| API | Node.js, Express, CORS |
| Database | MongoDB Atlas, Mongoose |
| Payments | Razorpay |
| Email | Nodemailer |

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| About the organisation | `aboutus.html` |
| Projects | `projects.html` |
| Events | `events.html` |
| Volunteer information | `volunteers.html` |
| Volunteer form | `volunteersForm.html` |
| Donations | `donation.html` |
| Contact | `contactus.html` |
| Photo gallery | `photos.html` |
| Video gallery | `videos.html` |
| COVID-19 information | `corona.html` |
| Privacy policy | `privacy.html` |

## Repository structure

```text
.
├── .vscode/
│   └── settings.json             # VS Code Explorer/search settings
├── demo/                         # Demo pages and demo styles
├── documentation/
│   └── website_workflow.md       # Website structure and user-flow notes
├── images/                       # Website images and media
├── index.html                    # Home page
├── aboutus.html                  # Organisation information
├── projects.html                 # Projects
├── events.html                   # Events
├── volunteers.html               # Volunteer information
├── volunteersForm.html           # Volunteer application form
├── donation.html                 # Donation page
├── contactus.html                # Contact form
├── photos.html                   # Photo gallery
├── videos.html                   # Video gallery
├── corona.html                   # COVID-19 information
├── privacy.html                  # Privacy policy
├── *.css                         # Page and shared stylesheets
├── custom.js                     # Browser interactions
├── api-config.js                 # Public website-to-API URL
├── server.js                     # Express API and service integrations
├── email.js                      # Server-side email notifications
├── testConnection.js             # MongoDB connection test utility
├── test-email.js                 # Email test utility
├── package.json                  # Backend dependencies and scripts
├── package-lock.json             # Locked npm dependency versions
├── .env.example                  # Safe backend configuration template
├── .gitignore                    # Excludes local secrets and generated files
└── README.md                     # Setup, deployment, and project guide
```

The website pages and backend entry point remain at the repository root to
match the current Netlify publish and Render start-command setup. Moving them
into separate application folders would require updating those hosting settings
and the pages' relative asset paths. The local `.env` file is intentionally not
listed; it is private, ignored by Git, and must not be committed.

## Getting started

### Requirements

- Node.js 14 or newer (a currently supported Node.js LTS release is recommended)
- npm
- A MongoDB database for API-backed donation storage

Razorpay and Gmail SMTP credentials are additionally needed to enable the corresponding payment and email flows.

### Install dependencies

```bash
git clone https://github.com/Deepparmar07/JSS-NGO.git
cd JSS-NGO
npm install
```

### Configure MongoDB

For local development, copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

Open `.env` and fill in the Atlas username, cluster host, database name, and URL-encoded password. Set Razorpay test keys, SMTP credentials, and an admin API key as needed. Keep `.env` private; it is ignored by Git and must never be committed.

In MongoDB Atlas, ensure the cluster is active and the application host is allowed under **Network Access**.

Set the backend URL in `api-config.js`:

```js
window.JSS_API_BASE_URL = 'https://YOUR-RENDER-SERVICE.onrender.com';
```

Replace the example host with the actual public URL shown for your Render service. For local development with a separately hosted static site, use `http://localhost:5000`.

### Start the API

```bash
npm run dev
```

For a normal start without Nodemon:

```bash
npm start
```

The API listens on `process.env.PORT` when set, or port `5000` locally. The HTML pages are static files and can be served with any static web server. Backend-dependent features require the API and integrations to be configured.

## Configuration and deployment

### Render

1. Connect the GitHub repository to a Render Web Service and set the start command to `npm start`.
2. Add the backend variables from `.env.example` in the service's **Environment** settings. At minimum, set `MONGODB_URI`; add Razorpay, email, and `ADMIN_API_KEY` values to enable those features.
3. Set `FRONTEND_ORIGIN` to the deployed website origin, for example `https://jsngo.netlify.app`.
4. Set `api-config.js` to the public Render service URL and deploy the static website.
5. Deploy the latest backend commit and check `/api/health` and Render logs for database connection status.

Render does not read your computer's local `.env` file. Configure environment variables in the Render dashboard.

### Required integration configuration

Available backend environment variables:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection URI |
| `RAZORPAY_KEY_ID` | Razorpay public key ID, returned by `/api/config` |
| `RAZORPAY_KEY_SECRET` | Private Razorpay API/signature secret |
| `EMAIL_USER`, `EMAIL_PASS` | SMTP account credentials |
| `CONTACT_EMAIL` | Destination for contact/volunteer messages; defaults to `EMAIL_USER` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` | SMTP server settings |
| `ADMIN_API_KEY` | Secret required by the donations administration endpoint |
| `FRONTEND_ORIGIN` | Comma-separated allowlist of website origins for CORS |

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Reports API and MongoDB connection status |
| `GET` | `/api/config` | Returns the public Razorpay key ID |
| `POST` | `/api/create-order` | Creates a Razorpay order |
| `POST` | `/api/verify-payment` | Verifies the signed payment and order amount, stores a donation, and attempts to send a receipt |
| `POST` | `/api/contact` | Sends a contact-form message to the configured email |
| `POST` | `/api/volunteers` | Sends a volunteer application to the configured email |
| `GET` | `/api/donations` | Lists donation records; requires the `x-admin-api-key` header |

## Operational notes

- The static site and Express API are deployed separately. The deployed `api-config.js` points to `https://jss-ngo.onrender.com`; the Render CORS response must also allow the website's origin for browser form submissions.
- The current Razorpay payment button is not wired to `/api/create-order` or `/api/verify-payment`; its payments will not be stored by the backend donation model or trigger backend email receipts.
- Contact and volunteer form delivery, as well as donation receipts, require working SMTP settings.
- `/api/donations` requires a private admin key. Do not expose that key in browser code or commit it.
- Rotate credentials that have previously been committed or shared. Previously exposed SMTP/payment credentials must be revoked or rotated at their providers.
- No automated test suite is configured in `package.json`.

## Security and data handling

- Keep `.env` and all production credentials out of Git and public messages.
- Rotate any credentials that have previously been committed or shared.
- Keep `FRONTEND_ORIGIN` restricted to trusted origins and protect administrative data routes.
- Test payment flows with provider test credentials before accepting live donations.
- Handle donor personal information and receipts in accordance with applicable privacy requirements.

## Credits

Created by Deep Solanki, Jenil Sarvani, and Deep Parmar.

The package metadata declares the ISC license. Review the repository's licensing terms before reuse or redistribution.
