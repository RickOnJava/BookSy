# 📘 BookSy – Smart E-Book Management Platform

BookSy is a full-stack **E-Book Marketplace & Management System** built using the **MERN stack** with **Stripe payments**, **AI-based recommendations**, **secure ebook streaming**, and **admin analytics dashboard**.

---

## 🚀 Features

### 👤 User
- JWT Authentication (Login / Register)
- Browse, search & filter e-books
- Secure Stripe payments
- Personal inventory of purchased books
- Protected PDF reading (token-based streaming)
- Review & rate purchased books only
- AI-powered book recommendations
- Gamified category-wise reading progress

### 🤖 AI Recommendations
- Category-based personalization
- Cold-start logic for new users
- Rating + popularity scoring
- Purchased books automatically excluded

### 🛠️ Admin
- Upload / manage ebooks
- User management
- Order tracking
- Dashboard analytics:
  - Total users
  - Total books
  - Revenue
  - Top rated books

---

## 🧩 Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication

**Payments**
- Stripe Checkout
- Order Management System

---

## 🗂️ Database Models
- User
- EBook
- Review
- Order

---

## 💳 Payment & Order Flow
1. User clicks **Buy**
2. Stripe Checkout session created
3. Order stored with `pending` status
4. On payment success:
   - Order marked `paid`
   - Book added to user inventory
5. User redirected to reading page

---

## 📖 Secure Reading Flow
- Purchase verified on backend
- Temporary stream token generated
- PDF streamed securely (no direct access)

---

## 🎮 Gamification
Category-wise progress bars on Inventory page:
Programming ▓▓▓▓░░ (4)
Computer Science ▓░░░░░░ (1)
Design ▓▓▓░░░ (3)


---

## 🧠 Recommendation Logic
- Category match → +5 score
- Higher ratings → boosted weight
- Popular books prioritized
- New users → only books with rating ≥ 4

---

## 🔐 Security
- JWT protected routes
- Role-based access (Admin / User)
- Purchase validation before reading & reviewing
- One review per user per book

---

## ⚙️ Environment Variables
i have pasted in demo env file

🛠️ Installation
git clone https://github.com/RickOnJava/BookSy.git

# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev

🧪 Test Credentials
Admin
email: admin@example.com
password: admin@1234

User
email: rick@example.com
password: rick@1234
