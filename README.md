# BID FOR FOREST

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Project Planning](#project-planning)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview
This is an auction website where users can list items for bidding and place bids on other users' listings. 

When a user registers, they receive 1000 credits to use on the site. They can earn more credits by selling items and spend credits by bidding on items. Unregistered users can browse listings but cannot place bids.

This project is a frontend application that interacts with the Noroff Auction API.

---

## Features
- User registration (Only `stud.noroff.no` email addresses allowed)
- User authentication (login/logout)
- User profile updates (including avatar)
- Credit balance display
- Listing creation (title, deadline, media, description)
- Bidding on listings
- Viewing bid history on listings
- Searching for listings

---

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **CSS Framework:** TailwindCSS (version >3.0.0)
- **Hosting:** Netlify
- **Design Application:** Figma
- **Project Management:** GitHub Projects

---

## Setup and Installation

### Prerequisites
- Node.js (Latest LTS version recommended)
- Git
- A code editor (VS Code recommended)

### Installation Steps
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/yourusername/auction-website.git
   cd auction-website
   ```

2. **Install Dependencies:**
   ```sh
   npm install
   ```

3. **Start the Development Server:**
   ```sh
   npm run dev
   ```

4. **Build for Production:**
   ```sh
   npm run build
   ```

5. **Deploy to Netlify:**
   - Link your repository to Netlify
   - Set up build command: `npm run build`
   - Choose the `dist` folder as the deploy directory

---

## Usage
1. Register a new account using a `stud.noroff.no` email
2. Login to the application
3. Update your profile (add an avatar if desired)
4. Browse existing auction listings
5. Create a new listing and set a deadline
6. Place bids on other users' listings
7. View bids on your own listings

---

## Project Planning
- **Gantt Chart:** [View Here](#)
- **Design Prototype:** [View Here](#)
- **Style Guide:** [View Here](#)
- **Kanban Board:** [View Here](#)
- **Repository Link:** [GitHub Repository](https://github.com/yourusername/auction-website)
- **Hosted Application:** [Live Demo](#)

---

## API Documentation
This project uses the Noroff Auction API. Full API documentation can be found [here](#).

### Authentication
- `POST /auth/register` – Register a new user
- `POST /auth/login` – Login user
- `POST /auth/logout` – Logout user

### Listings
- `GET /listings` – Get all listings
- `POST /listings` – Create a new listing
- `GET /listings/{id}` – Get a single listing
- `POST /listings/{id}/bids` – Place a bid
- `GET /listings/{id}/bids` – View all bids on a listing

---

## Deployment
The project is hosted on **Netlify**. Ensure all final changes are merged into the `main` branch before deployment.

---

## Contributing
1. Fork the repository
2. Create a new feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m "Added new feature"`)
4. Push to your branch (`git push origin feature-name`)
5. Open a pull request

---

