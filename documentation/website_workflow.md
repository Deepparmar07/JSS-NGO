# JSS NGO Website Workflow

## 1. Website Structure
```
JSS_NGO_Website/
├── css/                    # Website stylesheets
├── demo/                   # Demo pages and styles
├── documentation/          # Project documentation
├── images/                 # Image assets
├── js/                     # Browser scripts and API URL config
├── index.html              # Home page
├── aboutus.html            # About Us page
├── volunteers.html         # Volunteers page
├── volunteersForm.html     # Volunteer registration form
├── events.html             # Events page
├── projects.html           # Projects page
├── corona.html             # COVID-19 information
├── contactus.html          # Contact page
├── donation.html           # Donation page
├── photos.html             # Photo gallery
├── videos.html             # Video gallery
├── privacy.html            # Privacy policy
├── server.js               # Render backend entry point
├── email.js                # Backend email integration
├── package.json            # Node.js dependencies and scripts
└── .env.example            # Safe environment-variable template
```

Website pages remain at the root for Netlify publishing. Backend entry files
remain at the root for the Render start command. The private local `.env` file
is ignored and must never be committed.

## 2. User Flow
1. Home Page (index.html)
   - Navigation menu
   - Hero section
   - About section
   - Projects overview
   - Call-to-action buttons

2. About Us (aboutus.html)
   - Organization history
   - Mission and vision
   - Team members
   - Achievements

3. Volunteers (volunteers.html)
   - Volunteer opportunities
   - Success stories
   - Registration form link

4. Volunteer Registration (volunteersForm.html)
   - Personal information
   - Skills and interests
   - Availability
   - Submit form

5. Events (events.html)
   - Upcoming events
   - Past events
   - Event registration

6. Projects (projects.html)
   - Current projects
   - Completed projects
   - Project impact

7. COVID-19 (corona.html)
   - COVID-19 initiatives
   - Safety measures
   - Relief work

8. Contact (contactus.html)
   - Contact form
   - Location map
   - Contact information
   - Social media links

9. Donation (donation.html)
   - Donation options
   - Payment gateway
   - Tax benefits
   - Bank details

10. Gallery
    - Photos (photos.html)
    - Videos (videos.html)

## 3. Technical Flow
1. Frontend
   - HTML5 structure
   - CSS3 styling
   - JavaScript functionality
   - Responsive design
   - Cross-browser compatibility

2. Backend
   - Node.js server
   - Express framework
   - MongoDB database
   - Razorpay integration
   - Email functionality

3. Payment Flow
   - User selects amount
   - Enters details
   - Razorpay payment
   - Payment verification
   - Receipt generation

4. Contact Form Flow
   - User fills form
   - Form validation
   - Email sending
   - Confirmation message

## 4. Database Structure
1. Donations Collection
   - Name
   - Email
   - Phone
   - PAN
   - Amount
   - Payment ID
   - Status
   - Timestamp

2. Volunteers Collection
   - Name
   - Email
   - Phone
   - Skills
   - Availability
   - Status
   - Timestamp
