# Crypto-app Project
  just a basic crypto app
## ☎️ Feature
- Auth
- Transaction
- Wallet
- Trade (⚠️ set trade price only )
## 🛠️ Tech Stack

- 🧠 Node.js + NestJS
- 🗄️ PostgreSQL + TypeORM
- 🔐 JWT Authentication
- 💎 prisma
- 📦 Docker 

## 🚀 Getting Started

### 1. Clone repo
```bash
git clone https://github.com/areeyaswnth/crypto-app.git

cd your-project
```
### 2. Create a .env file
```bash
# has example in folder
DB_HOST= 
DB_PORT= 
DB_NAME= 
DB_USERNAME= 
DB_USER= 
DB_PASSWORD=
DB_DATABASE=  
DATABASE_URL=
API_BASE_URL=
```

### 3. Build & Run using Docker Compose
```
docker-compose up --build
```
🐳 This will:
- Spin up the NestJS backend on port 3000
- Spin up a PostgreSQL database on port 5432

## 🧪 Running in Development (Optional)
```
npm install
npm run start:dev
```
### Run seed for API testing
```
npm run seed 
```