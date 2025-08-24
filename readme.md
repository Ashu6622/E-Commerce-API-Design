🛒 E-Commerce API Design
A fully-featured E-Commerce REST API built with Node.js and Express, providing authentication, role-based access, product management, cart, wishlist, reviews, and order functionalities.

🚀 Features

1) Authentication & Authorization

    JWT-based authentication (token sent via cookies).

    Role-based access control (Admin vs. User).

2) User Management

    Sign up, login, profile management.

3) Product & Category

    Manage products, categories, subcategories, and brands.

    Admins can add/update/delete products.

4) Cart & Wishlist

    Add/remove items to cart support for logged-in users.

    Wishlist support for logged-in users.

5) Orders

    Users can place orders only when logged in.

    Order history tracking.

6) Reviews

    Add comments/reviews on products.

7) Security & Performance

    Rate limiting with Redis.

    Secure HTTP headers with Helmet.

8) Request logging & error logging with Morgan.

🛠️ Tech Stack

Node.js + Express.js

MongoDB (via Mongoose)

Redis (for rate limiting & caching)

JWT Authentication (with cookies)

Helmet (security headers)

Morgan (logging)

Project Structure

E-Commerce-API-Design/
│── routes/            # Route handlers (users, products, orders, etc.)
│── models/            # Mongoose schemas
│── utils/             # Database connection, helpers
│── logger.js          # Morgan logger configuration
│── redis.js           # Redis rate limiter setup
│── server.js          # Entry point
│── package.json       
│── ecosystem.config.js # PM2 configuration (if used for deployment)


Installation & Setup
git clone https://github.com/Ashu6622/E-Commerce-API-Design.git
cd E-Commerce-API-Design

npm install

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379

npm start

npm run dev

📌 API Endpoints
🔑 Authentication

POST /users/register → Register new user

POST /users/login → Login user (sets JWT cookie)

👤 User

GET /users/profile → Get user profile (requires login)

🛍️ Products & Categories

GET /products → Fetch all products

POST /products → Add product (Admin only)

GET /category → Fetch all categories

❤️ Wishlist

POST /wishlist → Add item to wishlist (requires login)

🛒 Cart

POST /cart → Add item to cart (requires login)

GET /cart → Get user’s cart

📦 Orders

POST /order → Place an order (requires login)

GET /order → Get user’s order history

⭐ Reviews

POST /review → Add a review to a product (requires login)

🔐 Security

Rate Limiting via Redis to prevent abuse.

JWT Authentication with HttpOnly cookies.

Helmet for securing HTTP headers.

📝 Logging

Morgan is used to log requests and errors.

Logs are saved in the /logs directory.

📌 Future Improvements

Payment gateway integration (Stripe/PayPal).

Product search & filtering.

Email notifications for orders.

Unit & integration testing with Jest.
