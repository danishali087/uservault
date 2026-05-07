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
<img width="804" height="1784" alt="127 0 0 1_5500_frontend_index html" src="https://github.com/user-attachments/assets/62f5be91-03d5-427c-ab0d-decee6fe5b95" />
<img width="1386" height="2242" alt="127 0 0 1_5500_frontend_dashboard html (1)" src="https://github.com/user-attachments/assets/039daf3f-1e67-4662-83e7-cd4868dad100" />
<img width="1768" height="2858" alt="127 0 0 1_5500_frontend_dashboard html" src="https://github.com/user-attachments/assets/edb4a330-6a98-4481-801e-9dee1e5d9df6" />
<img width="804" height="1784" alt="127 0 0 1_5500_frontend_index html" src="https://github.com/user-attachments/assets/06968f30-435d-4a1e-b98a-b3e897c807ba" />





## Developer
**Danish Ali** — Full Stack Developer
