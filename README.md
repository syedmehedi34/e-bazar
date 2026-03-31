# 🛍️ E-Catalog

**E-Catalog** is a modern, responsive, and high-performance **e-commerce web application** built with **Next.js** and **TypeScript**.  
It provides a beautiful user experience with advanced features like product filtering, cart management, secure checkout, and role-based admin control.

---

## 🌐 Live Demo

Check out the live version of **E-Catalog** here:  
[Visit E-Catalog](https://e-catalog-shop.vercel.app/)

![E-Catalog Screenshot](https://i.ibb.co.com/nNz63D8g/banner.png)

## 🚀 Features

### 🧑‍💻 User Features

- 🔎 **Search & Filter Products** by:
  - Category
  - Price Range
  - Keyword
- 🛒 **Add to Cart System**
  - View all products added to the cart
  - Increase or decrease product quantity dynamically
  - Real-time price updates based on quantity changes
  - Remove items from cart
  - Cart state managed globally via **Redux Toolkit**

- 🧾 **Order Management**
  - View all past orders
  - Track order status: **Pending**, **Paid**, **Cancelled**
  - View total number of orders and total amount paid
  - **Delete** any order
  - **Print Invoice** (React to Print)

- 💰 **Checkout System** with:
  - **Product Image Gallery:** View multiple product images in a zoomable gallery
  - **Image Zoom Feature:** Users can zoom product images for a better look (using `react-inner-image-zoom`)
  - **Full Product Details:** Users can view all information (description, price, brand, category, stock, etc.)
  - **Customer Reviews:** See what other users have commented or rated on the product
  - **Color & Size Selection:** Choose preferred product color and size before checkout
  - **Stripe Payment Integration:** Secure online card payment
  - **Cash on Delivery:** Simple offline payment option
- 🌓 **Dark & Light Mode** (Tailwindcss Theme Integration)

- ⚡ **Optimized Performance** — Image loading speed boosted by **Next.js Image Optimization (80% faster)**

---

### 🛠️ Admin Features (Role-Based Access)

- 📦 Manage Products:
  - Add, Update, Delete Products
  - View Product List
- 📑 Manage Orders:
  - Update Order Status
  - Track Customer Orders
- 👥 Manage Users:
  - Create New Users
  - View User List
- 📊 View Reports (Data Visualized with **Recharts**)
- ✍️ Add and Manage Blogs
- ⚙️ Settings Page for Admin Preferences
- 🌓 **Dark & Light Mode** (Tailwindcss Theme Integration)

---

---

## 🧾 Order System Overview

| Feature            | Description                                           |
| ------------------ | ----------------------------------------------------- |
| 🛍️ View Orders     | See all past orders with order ID, amount & date      |
| 📦 Order Status    | Track **Pending**, **Paid**, and **Cancelled** orders |
| 💵 Payment Summary | See total amount paid and total orders count          |
| 🧾 Print Invoice   | Print any order invoice using React to Print          |
| ❌ Delete Order    | User can remove unwanted or cancelled orders          |

---

## 🧩 Tech Stack

### Frontend:

- **Next.js (v15.4.5)** — Framework
- **TypeScript** — Type Safety
- **React (v19)** — Component Library
- **Tailwind CSS + DaisyUI** — UI Styling
- **Framer Motion** — Animation
- **Lucide React** — Icons
- **Swiper** — Sliders

### State Management:

- **Redux Toolkit**
- **Redux Persist**

### Authentication:

- **NextAuth.js** — Secure Authentication & Role Management

### Payment:

- **Stripe Integration** — Card Payments
- **Cash on Delivery** — Manual Checkout Option

### Data Visualization:

- **Chart.js**
- **Recharts**
- **React Chart.js 2**

### Utilities:

- **Axios** — API Calls
- **React Hook Form** — Form Handling
- **React Toastify** — Notifications
- **SweetAlert2** — Alert Dialogs
- **React to Print** — Invoice Printing
- **React Inner Image Zoom** — Product Image Zoom
- **React Range Slider Input** — Price Range Filter

---

## ⚙️ Installation & Setup

🧑‍💻 Developer Info

Syed Mehedi Hasan
Frontend Developer | React | Next.js | TypeScript | Tailwind CSS

📧 Email: syedmehedi34@gmail.com

🔗 LinkedIn: https://www.linkedin.com/in/syedmehedi34/

🌐 Portfolio: https://syedmehedi.netlify.app/

<!-- https://i.ibb.co.com/nNz63D8g/banner.png
https://i.ibb.co.com/vCCdY2m1/all-products-page.png
https://i.ibb.co.com/FkqJkmPC/register-page.png
https://i.ibb.co.com/t5QzzzW/admin-dashboard.png -->
