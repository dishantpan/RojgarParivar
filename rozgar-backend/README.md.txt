# RojgarParivar — Backend

Node.js + Express REST API server for RojgarParivar.

## Setup

1. Install dependencies: `npm install`
2. Create a `.env` file:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
3. Run: `npm start`

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/jobs | Get all jobs |
| POST | /api/jobs | Post a job |

## Tech
- Node.js, Express.js
- MongoDB + Mongoose
- JWT Authentication