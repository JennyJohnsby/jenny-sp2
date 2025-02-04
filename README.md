# jenny-sp2
My second semester project
------------------------------------------------------------------------------------------------------------------------
File Structure
/auction-website
│
├── /assets
│   ├── /images             # Store images (e.g., avatars, item photos)
│   ├── /icons              # Custom icons or assets
│   └── /fonts              # Custom fonts 
│
├── /components
│   ├── /Header.js          # Main navigation component
│   ├── /Footer.js          # Footer component
│   ├── /ListingCard.js     # Component for individual auction listings
│   ├── /BidForm.js         # Component to place a bid
│   ├── /AvatarUpload.js    # Component to upload an avatar
│   └── /LoginForm.js       # Component for the login form
│
├── /pages
│   ├── /Home.js            # Home page (displays listings)
│   ├── /LoginPage.js       # Login page
│   ├── /RegisterPage.js    # Registration page
│   ├── /ProfilePage.js     # User profile page (credits, avatar)
│   ├── /ListingPage.js     # Page showing details of a specific listing
│   └── /CreateListingPage.js # Page for creating a new listing
│
├── /services
│   ├── /api.js             # Handles all API requests (e.g., GET/POST requests to the Auction API)
│   ├── /authService.js     # Functions related to user authentication (login, registration)
│   ├── /listingService.js  # Functions to manage auction listings (fetch, create, etc.)
│   └── /bidService.js      # Functions related to placing and viewing bids
│
├── /styles
│   ├── /globals.css        # Global CSS for the entire app 
│   └── /tailwind.config.js # Tailwind CSS configuration file 
│
├── /utils
│   ├── /helpers.js         # Helper functions (e.g., date formatting, validation)
│   └── /storage.js         # Local storage utility (e.g., handling user session)
│
├── /assets
│   ├── /icons
│   └── /images
│
├── /tests
│   ├── /api.test.js        # Unit tests for API interactions
│   ├── /auth.test.js       # Unit tests for authentication (login, register)
│   └── /ui.test.js         # UI component tests (e.g., rendering, user interactions)
│
├── index.html              # Main HTML file, entry point for the app
├── app.js                  # Main JavaScript file (app logic, routing, etc.)
├── README.md               # Project documentation (setup, instructions, etc.)
├── .gitignore              # List of files/folders to be ignored by Git (node_modules, build files, etc.)
├── package.json            # Dependencies and project metadata (npm/yarn)
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── webpack.config.js       # Webpack config 
------------------------------------------------------------------------------------------------------------------------
