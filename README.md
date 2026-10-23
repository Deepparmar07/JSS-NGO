# JSS NGO Website

A community-focused website for JSS NGO, with information about the organisation, its projects and events, and ways to volunteer, donate, and get in touch.

**Live website:** [jssngo.netlify.app](https://jssngo.netlify.app/)

## About the project

The project combines a static, multi-page website with a small Express API intended to support donation checkout. The site includes organisation information, project and event pages, volunteer information, photo and video galleries, and contact and privacy pages.

## Features

- Organisation overview, projects, events, and COVID-19 information
- Volunteer information and registration page
- Donation page with Razorpay checkout integration
- Photo and video galleries
- Contact and privacy pages
- Express API routes for creating payment orders, verifying payments, and retrieving donation records
- MongoDB persistence for completed donation records
- Nodemailer email receipt flow after payment verification

> **Integration setup required:** Payment and email credentials in `server.js` are placeholders. The donation API and related checkout flows will not work until valid provider credentials are configured. The contact and volunteer forms also contain local-development service URLs; see [Known integration requirements](#known-integration-requirements).

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
├── images/                   # Website images and media
├── documentation/
│   └── website_workflow.md   # Website structure and user-flow notes
├── demo/                     # Demo pages
├── server.js                 # Express API and service integrations
├── testConnection.js         # MongoDB connection test utility
├── test-email.js             # Email test utility
├── *.html                    # Static website pages
├── *.css                     # Page and shared stylesheets
├── custom.js                 # Browser-side interactions
├── package.json              # Backend dependencies and scripts
└── .env.example              # MongoDB configuration template
```

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

Open `.env` and replace `<URL_ENCODED_DB_PASSWORD>` with the password for your MongoDB Atlas database user. URL-encode special characters in the password. Keep `.env` private; it is ignored by Git and must never be committed.

The example URI selects the `epicapi` database. Change the database name in the URI if you intend to use a different database. In MongoDB Atlas, also ensure the cluster is active and the application host is allowed under **Network Access**.

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

1. Connect the GitHub repository to a Render Web Service.
2. Set the start command to `npm start`.
3. Add `MONGODB_URI` under the service's **Environment** settings using your complete Atlas connection URI. Do not include the URI in source code or commit a local `.env`.
4. Deploy the latest commit and confirm the logs show the expected commit and a successful MongoDB connection.

Render does not read your computer's local `.env` file. Configure environment variables in the Render dashboard.

### Required integration configuration

Currently, only `MONGODB_URI` is read from the environment by the API. Razorpay credentials and Gmail SMTP settings are still placeholders in `server.js`; configure them securely before enabling payment processing or email receipts. Do not use real credentials in committed source files.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/create-order` | Creates a Razorpay order |
| `POST` | `/api/verify-payment` | Verifies a Razorpay signature, stores a donation, and sends a receipt |
| `GET` | `/api/donations` | Returns stored donation records |

The API does not currently define authentication for `GET /api/donations`. Restrict or protect this route before exposing it publicly.

## Known integration requirements

- `donation.html` currently calls the API at `http://localhost:5000`. Update the frontend API base URL for the deployed backend and use HTTPS in production.
- `contactus.html` references a local service at `http://localhost:3000`; that service is not included in this repository.
- The volunteer form uses a client-side email flow. Review its provider configuration before collecting real submissions.
- Razorpay keys and Gmail SMTP credentials in `server.js` are placeholders and are not currently environment-based.
- No automated test suite is configured in `package.json`.

## Security and data handling

- Keep `.env` and all production credentials out of Git and public messages.
- Rotate any credentials that have previously been committed or shared.
- Restrict API access, configure CORS for trusted origins, and protect administrative data routes before production use.
- Test payment flows with provider test credentials before accepting live donations.
- Handle donor personal information and receipts in accordance with applicable privacy requirements.

## Credits

Created by Deep Solanki, Jenil Sarvani, and Deep Parmar.

The package metadata declares the ISC license. Review the repository's licensing terms before reuse or redistribution.
