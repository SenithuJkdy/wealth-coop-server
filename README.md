
# 🚀 Wealth Coop Server Setup Guide

This guide helps you set up and run the **Wealth Coop Server** on your local machine.

---

## ✅ Dependencies

Before starting, ensure you have the following installed:

- **[Node.js](https://nodejs.org/)** 
- **npm** (comes with Node.js)
- **[MongoDB](https://www.mongodb.com/)**  
  - Either installed locally  
---

## 📦 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/sdsag/wealth-coop-server.git
cd wealth-coop-server
```

### 2. Install Dependencies

```bash
npm install
```
### 3. Install `nodemon` for Development

```bash
npm install --save-dev nodemon
```
---

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/bankdb
```

> 💡 Replace `MONGO_URI` with your actual MongoDB connection string if using MongoDB Atlas.

---

## ▶️ Run the Server

### To start the server:

```bash
nodemon server.js
```
If everything is set up correctly, you should see:

```
[nodemon] starting `node server.js`
Server is running on http://localhost:5000
Connected to MongoDB
```
