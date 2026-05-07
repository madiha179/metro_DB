#  Metro Mate API

A RESTful backend API for managing a metro system — built with **Node.js**, **Express**, and **MongoDB**, deployed on Railway.

##  Links

| Resource | URL |
|---|---|
|  Base API | `https://metrodb-production.up.railway.app` |
|  Swagger UI | [api-docs](https://metrodb-production.up.railway.app/api-docs/#/) |
|  GitHub Repo | [madiha179/metro_DB](https://github.com/madiha179/metro_DB) |

---

##  Features

###  User Management
- Register, login, and logout
- OTP verification and resend
- Forgot/reset password via email OTP
- Change password
- Update profile photo and username
- Multi-language preference support

###  Ticket System
- Get ticket price and calculate trip cost
- Full ticket CRUD for admins (add, update, delete, view)
- Ticket usage analytics dashboard

###  Ticket Payment
- Generate payment key for ticket purchase
- Visa card payment integration (Paymob)
- Aman / Masary cash payment
- Payment confirmation retrieval

###  Subscriptions
- Browse subscription plans by category
- Submit subscription applications with documents
- Track personal subscription status
- Pay via cash or Visa (Paymob iframe)
- Admin controls: approve/reject, download documents, search, filter by status, view email history
- **Auto-renewal System** — fully automated subscription lifecycle via scheduled cron jobs:
  -  **7-day reminder** — sends email + push notification before expiry with the renewal price
  -  **Auto charge** — automatically charges the saved Visa card 2 days before expiry via Paymob
  -  **Manual renewal fallback** — if no saved card is found, user is notified to renew manually
  -  **Renewal confirmation** — sends email + push notification with the new expiry date on success
  -  **Failure handling** — notifies the user if the charge fails and prompts manual renewal
  -  **Expiry check** — daily job marks overdue subscriptions as expired and notifies users
  -  **Bilingual notifications** — all emails and push notifications sent in the user preferred language (Arabic / English)

###  Trip Planning
- Get all metro stations
- Calculate route: station list, number of stops, distance, time, and ticket price (Dijkstra algorithm)
- Find nearest station by GPS coordinates (lat/lng)
- View personal trip history

###  BRT (Bus Rapid Transit)
- View all BRT stations
- Get route between two BRT stations

###  AI ChatBot
- Send questions to an AI-powered metro mate assistant
- View full chat history per user

###  Notifications
- Firebase push notifications
- View user notification history

###  Admin Dashboard
- Manage stations: add, update, delete, search, sort by line
- Manage Tickets : add, update, delete
- View station count per line and all station locations on map
- Manage admin accounts (Super Admin only)
- Subscription analysis and ticket analysis charts
- View and manage pending subscriptions

---

##  Project Structure

```
metro_DB/
├── controllers/       # Route handlers & business logic
├── models/            # Mongoose & MySQL data models
├── routes/            # Express route definitions
├── swagger/           # Swagger/OpenAPI config & definitions
├── utils/             # Helper functions & utilities
├── views/
│   └── emails/        # Email templates 
├── server.js          # App entry point
└── package.json
```

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 |
| Framework | Express.js |
| Primary DB | MongoDB (Mongoose) |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| API Docs | Swagger UI + swagger-jsdoc |
| Email | Nodemailer / SendGrid / Brevo / Resend |
| AI | Google Generative AI |
| Notifications | Firebase Admin SDK |
| Route Algorithm | Dijkstra (node-dijkstra) |
| Templates  |
| Deployment | Railway |

---

##  Getting Started

### Prerequisites

- Node.js v22+
- MongoDB instance

### Installation

```bash
# Clone the repository
git clone https://github.com/madiha179/metro_DB.git
cd metro_DB

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
# Email (choose one or more)
SENDGRID_API_KEY=your_sendgrid_key
BREVO_API_KEY=your_brevo_key
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_password

# Firebase
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# Google AI
GOOGLE_GENAI_API_KEY=your_google_ai_key
```

### Running the App

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:3000`.

---

##  API Documentation

Full interactive API documentation is available via Swagger UI:

 **[https://metrodb-production.up.railway.app/api-docs/#/](https://metrodb-production.up.railway.app/api-docs/#/)**

### API Groups Overview

| Group | Description |
|---|---|
| `Users` | Registration, login, OTP, password management |
| `Profile` | View and update user profile |
| `Tickets` | Ticket pricing and trip cost calculation |
| `Ticket Payment` | Visa & cash payment processing |
| `Subscriptions (User)` | Browse plans and apply |
| `Subscription Payment` | Pay for subscriptions |
| `Subscriptions (Admin)` | Review and manage applications |
| `Stations` | Trip planning and nearest station lookup |
| `BRT` | Bus Rapid Transit route planning and cost calculation|
| `ChatBot` | AI-powered metro mate assistant |
| `Notifications` | Push notification history |
| `Stations Dashboard` | Admin station management |
| `Tickets Dashboard` | Admin ticket management |
| `Home Dashboard` | Analytics and map overview |
| `Admins (Super Admin)` | Admin account management |

---

##  Security Features

- **Helmet** — Sets secure HTTP headers
- **CORS** — Configurable cross-origin resource sharing
- **Rate Limiting** — Prevents brute-force and DoS attacks
- **XSS Sanitizer** — Cleans user input against cross-site scripting
- **Mongo Sanitize** — Prevents NoSQL injection attacks
- **bcryptjs** — Secure password hashing
- **JWT** — Stateless authentication tokens
- **OTP Verification** — Email-based one-time password for account security


##  Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
```