# JSS-NGO

> A responsive nonprofit website that connects supporters with the organisation, its projects, events, and volunteer programmes.

![Node.js](https://img.shields.io/badge/Node.js-14%2B-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7%2B-47A248?style=flat-square&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-lightgrey?style=flat-square)

## Overview

JSS-NGO is a full-stack website for a non-governmental organisation. The public-facing site communicates the organisation’s mission, projects, events, and media while providing practical ways for visitors to donate, volunteer, and contact the team.

The repository contains the website pages, shared styles and browser scripts, plus a Node.js and Express backend for forms, email delivery, database access, and payment workflows.

**Live website:** [jssngo.netlify.app](https://jssngo.netlify.app/)

## Features

### Public website

- About and organisation information
- Projects and community initiatives
- Events, photos, and video pages
- Privacy and contact pages
- Responsive layouts for desktop and mobile visitors

### Supporter workflows

- Online donation experience with Razorpay integration
- Volunteer registration form
- Contact and enquiry forms
- Email notifications for submitted requests
- Server-side processing for backend-connected actions

### Backend services

- Express server for application endpoints
- MongoDB persistence through Mongoose
- CORS configuration for frontend integration
- Environment-based configuration with dotenv
- Nodemailer-based email delivery
- Razorpay payment service integration
- Nodemon development workflow

## Architecture

JSS-NGO uses a lightweight full-stack architecture:

- Presentation layer — HTML pages, CSS stylesheets, images, and browser JavaScript
- Service layer — Node.js and Express server endpoints
- Data layer — MongoDB accessed through Mongoose
- Integration layer — Razorpay for payments and Nodemailer for email delivery
- Configuration layer — environment variables loaded through dotenv

## Project structure

- aboutus.html — organisation information
- index.html — website landing page
- projects.html — project and initiative information
- events.html — event information
- photos.html — photo gallery
- videos.html — video content
- donation.html — donation experience
- volunteers.html — volunteer information
- volunteersForm.html — volunteer registration form
- contactus.html — contact form and contact information
- privacy.html — privacy information
- home.css, donation.css, volunteer.css — page-specific styles
- style.css, style2.css, style3.css — shared and responsive styles
- custom.js — browser-side interactions
- email.js — email-related client helpers
- server.js — Express backend entry point
- testConnection.js — database connectivity check
- test-email.js — email delivery check
- package.json — backend scripts and dependencies
- documentation/ — supporting project documentation

## Technology stack

### Frontend

- Semantic HTML
- CSS3 with responsive layouts
- Vanilla JavaScript for browser interactions
- Static assets and media resources

### Backend

- Node.js
- Express 4
- MongoDB and Mongoose 7
- Razorpay SDK
- Nodemailer
- CORS
- dotenv

## Requirements

- Node.js 14 or newer
- npm
- MongoDB database for connected features
- Razorpay account and credentials for live payment processing
- SMTP credentials for transactional email

Use current supported Node.js and dependency versions when preparing a new production deployment.

## Getting started

### 1. Install dependencies

    git clone https://github.com/Deepparmar07/JSS-NGO.git
    cd JSS-NGO
    npm install

### 2. Configure the environment

Create a local .env file for the backend configuration. Use the variable names expected by server.js and keep all credentials out of source control.

Typical configuration areas include:

- MongoDB connection string
- Express server port
- Razorpay key and secret
- SMTP host, port, username, and password
- Allowed frontend origin

Do not commit payment secrets, database passwords, SMTP passwords, or production credentials.

### 3. Start the application

Production-style start:

    npm start

Development mode with automatic restart:

    npm run dev

The server will print its listening address in the terminal. Open the configured frontend deployment or serve the static pages through the project’s hosting setup.

### 4. Run connectivity checks

Database check:

    node testConnection.js

Email configuration check:

    node test-email.js

Use test credentials and non-production recipients while validating integrations.

## Available scripts

| Command | Description |
| --- | --- |
| npm start | Start the Express server with Node.js |
| npm run dev | Start the server with Nodemon |
| npm test | Placeholder test command from the current package configuration |
| node testConnection.js | Check MongoDB connectivity |
| node test-email.js | Check email configuration and delivery |

## Security and operations

- Store all secrets in environment variables or the hosting provider’s secret manager.
- Use Razorpay webhook signature verification before trusting payment events.
- Validate and sanitise all form input on the server.
- Restrict CORS to trusted frontend origins in production.
- Use HTTPS for payment, authentication, and form traffic.
- Apply rate limiting and abuse protection before exposing public endpoints at scale.
- Avoid logging credentials, payment data, or personal information.
- Use separate development and production databases.
- Back up MongoDB and document a recovery procedure.

## Production deployment checklist

Before release:

- Configure environment variables in the hosting platform.
- Confirm the production MongoDB connection and indexes.
- Configure Razorpay keys and verified webhook endpoints.
- Configure SMTP sender identity and delivery credentials.
- Set a strict CORS allowlist for the deployed frontend.
- Verify donation, volunteer, contact, email, and error flows.
- Test the site on mobile and desktop breakpoints.
- Confirm all public links, media, and privacy information are current.
- Enable HTTPS, monitoring, logs, backups, and a rollback plan.
- Remove test credentials and sample payment data from production.

## Documentation

Supporting documentation is available in the documentation directory and repository files. Update the relevant guide whenever a workflow, environment variable, integration, or deployment process changes.

## Contributing

1. Create a focused feature branch.
2. Keep public pages, backend services, and integrations separated by responsibility.
3. Test form and payment-related changes with safe test credentials.
4. Update documentation for configuration or behavior changes.
5. Do not commit secrets or real supporter data.
6. Open a pull request with a clear summary and validation notes.

## Authors

Deep Solanki, Jenil Sarvani, and Deep Parmar.

## License

This project is distributed under the ISC license as declared in package.json. Review the license and repository policies before redistributing or deploying modified versions.
