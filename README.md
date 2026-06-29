# 📚 LexiCart Server

## 🚀 Live API

Backend API powering the **LexiCart – Online Book Delivery Management System**.

**Client Live Site:** https://lexi-cart.vercel.app/

**Client Repository:** https://github.com/tanjiyaJuthi/LexiCartClient

**Server Repository:** https://github.com/tanjiyaJuthi/LexiCartServer

---

# 📖 Project Overview

LexiCart Server is a RESTful backend built with **Node.js**, **Express.js**, and **MongoDB**. It provides secure APIs for authentication, role-based authorization, book management, delivery requests, payment processing, reviews, and dashboard analytics.

The server uses **JWT authentication**, **Better Auth**, **MongoDB Atlas**, **Stripe**, and **ImgBB** integration to support the complete functionality of the LexiCart platform.

---

# 🎯 Purpose

The backend is responsible for:

* User authentication and authorization
* Managing books and inventory
* Handling delivery requests
* Processing Stripe payments
* Managing user roles
* Book approval workflow
* Review verification
* Dashboard statistics
* Secure database communication

---

# ✨ Key Features

## 🔐 Authentication & Security

* Better Auth Authentication
* JWT Authentication
* Cookie-based Authorization
* Protected Routes
* Role-based Access Control
* Environment Variable Protection
* Secure MongoDB Atlas Connection

---

## 👥 User Management

* User Registration
* Login
* Google Authentication
* Role Selection
* Admin Role Management
* User CRUD Operations

---

## 📚 Book Management

* Add Books
* Edit Books
* Delete Books
* Publish / Unpublish Books
* Pending Approval System
* Book Search
* Category Filtering
* Pagination
* Availability Management

---

## 🚚 Delivery Management

* Request Delivery
* Delivery Status Updates
* Pending → Dispatched → Delivered Workflow
* Delivery History

---

## 💳 Stripe Payment Integration

* Secure Checkout Session
* Delivery Fee Processing
* Payment Verification
* Transaction Storage

---

## ⭐ Review System

* Verified Reviews
* Rating System
* Edit Reviews
* Delete Reviews
* Delivery Verification Before Review

---

## 📊 Dashboard APIs

### User Dashboard

* Reading Statistics
* Delivery History
* Reading List
* Review Management

### Librarian Dashboard

* Inventory Management
* Earnings
* Pending Requests
* Delivery Tracking

### Admin Dashboard

* User Management
* Book Approval Queue
* Transaction History
* Revenue Statistics
* Analytics APIs

---

# 🛠️ Technologies Used

* Node.js
* Express.js
* MongoDB Atlas
* Better Auth
* JWT (jsonwebtoken)
* Stripe
* Cookie Parser
* CORS
* dotenv
* Axios
* ImgBB API

---

# 📦 NPM Packages Used

```bash
express
mongodb
better-auth
jsonwebtoken
cookie-parser
cors
dotenv
stripe
axios
multer (if used)
nodemon
```

---

# 🔒 Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

BETTER_AUTH_SECRET=your_better_auth_secret

STRIPE_SECRET_KEY=your_stripe_secret

IMGBB_API_KEY=your_imgbb_key

CLIENT_URL=http://localhost:5173
```

---

# ⚙️ Installation

## Clone the repository

```bash
git clone https://github.com/tanjiyaJuthi/LexiCartServer.git
```

## Navigate to the project

```bash
cd LexiCartServer
```

## Install dependencies

```bash
npm install
```

## Start development server

```bash
npm run dev
```

---

# 📂 API Features

* Authentication APIs
* User APIs
* Book APIs
* Review APIs
* Delivery APIs
* Stripe Payment APIs
* Dashboard APIs
* Admin APIs
* Librarian APIs

---

# 🔐 Security

* JWT Protected Routes
* Cookie Authentication
* Environment Variables
* MongoDB Credentials Hidden
* CORS Configuration
* Request Validation
* Role-Based Middleware

---

# 👨‍💻 Admin Credentials

**Email**

```text
admin@gmail.com
```

**Password**

```text
Admin@123
```

---


## 📞 Contact

If you have any questions or suggestions, feel free to reach out through GitHub or tanjiya098@gmail.com

## ⭐ Thank you for visiting the LexiCart Server repository!
