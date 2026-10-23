# JSS NGO Website

A responsive website for JSS NGO that presents the organisation, its programmes and events, and ways to get involved through volunteering, donations, and contact forms.

**Live website:** [jssngo.netlify.app](https://jssngo.netlify.app/)

## Highlights

- Organisation, projects, events, and COVID-19 information pages
- Photo and video galleries
- Volunteer information and registration form
- Donation page with Razorpay checkout integration
- Contact and privacy pages
- Responsive layouts built with HTML, CSS, and browser-side JavaScript
- Express API for creating and verifying donation orders, storing donation records in MongoDB, and sending payment email notifications

## Technology

- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap, jQuery
- **Backend:** Node.js, Express
- **Data:** MongoDB and Mongoose
- **Integrations:** Razorpay and Nodemailer

## Repository layout

```text
.
├── index.html                 # Home page
├── aboutus.html               # About the organisation
├── projects.html              # Projects and initiatives
├── events.html                # Events
├── volunteers.html            # Volunteer information
├── volunteersForm.html        # Volunteer registration
├── donation.html              # Donations
├── contactus.html             # Contact page
├── photos.html                # Photo gallery
├── videos.html                # Video gallery
├── privacy.html               # Privacy information
├── *.css                      # Page and shared stylesheets
├── custom.js                  # Browser interactions
├── server.js                  # Express API and integrations
├── package.json               # Backend dependencies and scripts
├── images/                    # Website images and media
└── documentation/
    └── website_workflow.md    # Website structure and user-flow notes
```

## Run locally

### Requirements

- Node.js 14 or newer (use a currently supported Node.js LTS release where possible)
- npm
- MongoDB, Razorpay, and SMTP credentials for the corresponding backend integrations

### Install and start the API

```bash
git clone https://github.com/DEEPPARMAR7/JSS-NGO.git
cd JSS-NGO
npm install
npm run dev
```

The development server uses port `5000` by default. `npm start` starts the same Express server without Nodemon.

The website files are static HTML and can be served from the repository root with a static file server. Backend-dependent features require the API to be running and configured.

### Backend configuration and secrets

The current backend configuration is in `server.js`. Configure your own development database, Razorpay, and SMTP credentials before using those integrations. Do not commit real credentials. Before production use, move secrets into environment-based configuration or the hosting provider's secret manager; rotate any credentials that have previously been exposed in source control.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/create-order` | Create a Razorpay donation order |
| `POST` | `/api/verify-payment` | Verify a payment and process the donation |
| `GET` | `/api/donations` | Retrieve donation records |

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Express server |
| `npm run dev` | Start the Express server with Nodemon |

There is no configured automated test suite in `package.json` yet.

## Deployment notes

The public website is hosted on Netlify. The backend must be deployed separately with its required database, payment, and email configuration. Set production secrets through the hosting provider, restrict API access and CORS to trusted origins, and test donation flows with payment-provider test credentials before enabling live payments.

## Contributing

1. Create a branch for your change.
2. Keep frontend, API, and integration changes focused.
3. Test affected pages and backend routes with non-production credentials.
4. Update documentation when behavior or setup steps change.
5. Open a pull request with a concise summary and test notes.

## Credits and license

The project credits Deep Solanki, Jenil Sarvani, and Deep Parmar. `package.json` declares the ISC license; review the repository's licensing files and project policies before redistribution.