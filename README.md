#  UserVault

A secure full-stack User Management System built with Node.js and PostgreSQL.

##  Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Auth**: JWT + bcrypt

##  Features
- ✅ User Register & Login with JWT Authentication
- ✅ Beautiful Dashboard with Statistics
- ✅ Full CRUD Operations
- ✅ Soft Delete & Restore (data never lost!)
- ✅ Live Search Functionality
- ✅ Password Encryption with bcrypt
- ✅ Protected API Routes

##  Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/danishali087/uservault.git
cd uservault
```

### 2. Setup Backend
```bash
cd backend
npm install
```

### 3. Create `.env` file inside `backend/`
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=uservault
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### 4. Setup PostgreSQL Database
```sql
CREATE DATABASE uservault;

CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(20) DEFAULT 'user',
  is_deleted  BOOLEAN DEFAULT false,
  deleted_at  TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW(),
  last_login  TIMESTAMP
);
```

### 5. Run Backend
```bash
npm run dev
```

### 6. Run Frontend
Open `frontend/index.html` with Live Server

##  Screenshots
Coming soon!

## Developer
**Danish Ali** — Full Stack Developer
