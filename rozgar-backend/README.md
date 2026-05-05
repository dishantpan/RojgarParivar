# ⚡ RozgarConnect — Backend API

## 🚀 Quick Setup (Do this once)

### Step 1 — Install dependencies
```bash
cd rozgar-backend
npm install
```

### Step 2 — Setup MongoDB Atlas (Free)
1. Go to **mongodb.com** → Create free account
2. Create a free **M0 cluster**
3. Click **Connect** → **Connect your application**
4. Copy the connection string
5. Open `.env` file and paste it as `MONGO_URI`
6. Replace `<password>` with your MongoDB password
7. Replace `<dbname>` with `rozgarconnect`

### Step 3 — Setup Cloudinary (Free — for file uploads)
1. Go to **cloudinary.com** → Create free account
2. Go to Dashboard → Copy Cloud Name, API Key, API Secret
3. Paste into `.env` file

### Step 4 — Setup Gmail for emails
1. Go to Gmail → Settings → Security → Enable 2-Factor Auth
2. Then: Security → App Passwords → Select "Mail" → Generate
3. Copy the 16-character password
4. Paste into `.env` as `EMAIL_PASS`

### Step 5 — Start the server
```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

Server runs at: **http://localhost:5000**

---

## 📡 All API Endpoints

### AUTH
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/worker/register | Worker signup |
| POST | /api/auth/worker/login | Worker login |
| POST | /api/auth/hirer/register | Regular hirer signup |
| POST | /api/auth/business/register | Business signup |
| POST | /api/auth/hirer/login | Hirer/Business login |
| POST | /api/auth/admin/login | Admin login |
| POST | /api/auth/send-otp | Send OTP (mock: always 123456) |
| POST | /api/auth/verify-otp | Verify OTP |

### WORKERS
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/workers | Browse available workers |
| GET | /api/workers/:id | Get worker profile |
| GET | /api/workers/me | My profile (auth required) |
| PUT | /api/workers/profile | Update profile (auth required) |
| PUT | /api/workers/availability | Toggle availability (auth required) |

### JOBS
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/jobs | Browse jobs |
| GET | /api/jobs/:id | Get single job |
| POST | /api/jobs | Post new job (hirer auth) |
| POST | /api/jobs/:id/apply | Apply to job (worker auth) |
| DELETE | /api/jobs/:id/apply | Withdraw application (worker auth) |
| PUT | /api/jobs/:id/hirer-confirm | Hirer confirms completion |
| PUT | /api/jobs/:id/worker-confirm | Worker confirms completion |
| POST | /api/jobs/:id/rate | Rate after completion |

### HIRERS
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/hirers/me | My profile (auth required) |
| PUT | /api/hirers/profile | Update profile (auth required) |
| GET | /api/hirers/jobs | My job posts (auth required) |
| GET | /api/hirers/jobs/:jobId/applicants | View applicants |
| PUT | /api/hirers/jobs/:jobId/contact/:workerId | Contact worker |

### ADMIN (admin login required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/stats | Dashboard stats |
| GET | /api/admin/workers | All workers |
| GET | /api/admin/verifications | Business verifications |
| PUT | /api/admin/verifications/:id/approve | Approve business |
| PUT | /api/admin/verifications/:id/reject | Reject business |
| GET | /api/admin/jobs | All jobs |
| PUT | /api/admin/workers/:id/suspend | Suspend worker |
| DELETE | /api/admin/jobs/:id | Delete job |

---

## 📁 Folder Structure
```
rozgar-backend/
├── server.js              ← Entry point
├── package.json
├── .env                   ← Your secrets (never commit this!)
└── src/
    ├── config/
    │   ├── db.js          ← MongoDB connection
    │   └── cloudinary.js  ← File upload config
    ├── models/
    │   ├── Worker.js      ← Worker schema
    │   ├── Hirer.js       ← Hirer/Business schema
    │   ├── Job.js         ← Job schema
    │   └── Rating.js      ← Rating schema
    ├── routes/
    │   ├── auth.js        ← Login/Register
    │   ├── workers.js     ← Worker APIs
    │   ├── hirers.js      ← Hirer APIs
    │   ├── jobs.js        ← Job APIs
    │   └── admin.js       ← Admin APIs
    └── middleware/
        └── auth.js        ← JWT protection
```

---

## 🔑 Mock OTP
During development, OTP is always **123456**. No MSG91 account needed yet.

## 👤 Admin Credentials
- Email: admin@rozgarconnect.in  
- Password: admin123
