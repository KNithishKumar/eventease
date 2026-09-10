# EventEase – Smart College Event Registration & Management Platform

EventEase is a production-ready, full-stack college event registration and management system built with **React (Vite + Tailwind CSS)**, **Node.js/Express.js**, and **MongoDB (Mongoose)**. It provides role-based workspaces for **Students**, **Event Organizers**, and **Platform Administrators**.

---

## Key Features

### 🎓 1. Student Features
- **Discovery & Search**: Browse technical hackathons, workshops, cultural fests, and sports competitions with search, category, department, and date filters.
- **Rule-Based Recommendation Engine**: Personalize student event discovery by scoring student interests against event categories.
- **Automatic Waitlist Management**: When capacity is reached, students join a queue with position tracking (`Position #1`). When a registration is cancelled, the first waitlisted student is automatically promoted and notified.
- **Digital QR Tickets**: Instant SVG QR code digital pass generation containing hashed security tokens.
- **Attendance History & Feedback**: Track attended events and submit star ratings and comments post-event.

### 🎪 2. Organizer Features
- **Event Creation & Editing**: Submit events with posters, capacity limits, rules, and venue details. (Events require Admin approval before public listing; edits disabled once event date passes).
- **Live QR Gate Scanner**: Integrated camera scanner and manual token entry for live attendance check-in. Prevents duplicate check-ins or scanning tickets from other events.
- **Attendee Roster Management**: Search attendees, filter by department or year, and export roster data as CSV.
- **Broadcast Announcements**: Send instant push notifications to all registered students of an event.
- **Event Analytics**: Recharts dashboard displaying attendance percentage, registration trends, and rating distribution.

### 🛡️ 3. Administrator Features
- **Event Approval Workflow**: Review pending organizer submissions with Approve or Reject (requires rejection reason) actions.
- **User Roster Control**: Search platform users, filter by role, activate/deactivate accounts, or remove inappropriate content.
- **Platform Analytics**: Comprehensive charts for user department breakdown, category distribution, and attendance rates.

---

## Tech Stack

| Layer | Tech |
|---|---|
| **Frontend Framework** | React 18 with Vite |
| **Styling & Icons** | Tailwind CSS v3, React Icons, Lucide Icons |
| **State & Context** | React Context API (`AuthContext`, `ThemeContext`) |
| **HTTP Client** | Axios with Request/Response JWT Interceptors |
| **Charts & QR** | Recharts, `qrcode.react`, `html5-qrcode` |
| **Backend Runtime** | Node.js & Express.js |
| **Database** | MongoDB with Mongoose ORM |
| **Auth & Security** | JWT (JSON Web Tokens), `bcryptjs` password hashing |
| **File Uploads** | Multer for static image posters (`/uploads`) |
| **Cron Scheduling** | `node-cron` for 24-hour and 1-hour event reminder alerts |

---

## Folder Structure

```
eventease/
├── README.md
├── .env.example
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── attendanceController.js
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── feedbackController.js
│   │   ├── notificationController.js
│   │   └── registrationController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Event.js
│   │   ├── Feedback.js
│   │   ├── Notification.js
│   │   ├── Registration.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── feedbackRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── registrationRoutes.js
│   ├── seed/
│   │   └── seeder.js
│   ├── services/
│   │   ├── reminderCron.js
│   │   └── waitlistService.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   └── events/
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── pages/
    │   │   ├── admin/
    │   │   ├── organizer/
    │   │   ├── public/
    │   │   └── student/
    │   ├── services/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## Installation & Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally on `mongodb://localhost:27017/eventease` (or MongoDB Atlas URI)

### 1. Backend Setup
```bash
cd server
npm install
npm run seed     # Populate database with sample users and events
npm run dev      # Start server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev      # Start Vite dev server on http://localhost:5173
```

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| **System Admin** | `admin@eventease.com` | `password123` |
| **Organizer** | `organizer@eventease.com` | `password123` |
| **Student 1** | `student1@eventease.com` | `password123` |
| **Student 2** | `student2@eventease.com` | `password123` |

---

## API Reference Overview

- `POST /api/auth/register` - Student/Organizer signup
- `POST /api/auth/login` - User authentication
- `GET /api/events` - Public event discovery with search, category & date filters
- `POST /api/events` - Organizer event submission (`status: pending`)
- `POST /api/events/:id/register` - Register for event or join waitlist
- `POST /api/attendance/check-in` - QR token gate attendance scan
- `PUT /api/admin/events/:id/approve` - Admin event approval
- `GET /api/admin/analytics` - Platform metrics and charts

---

## License
MIT License. Built for CSE College Event Management Project Demonstration.
