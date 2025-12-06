# Luxe Salon - Stripe Connect Payment Integration

A professional, production-ready Next.js application demonstrating advanced Stripe Connect integration for salon booking systems. This project serves as a comprehensive reference implementation for developers building multi-party payment flows.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Why This Project?

Integrating Stripe Connect can be complex. This project simplifies it by providing a working, real-world example of:
1.  **Direct Charges**: How to process payments directly to a connected account (e.g., a specific salon branch).
2.  **Stripe Elements**: Using the modern Payment Element for a unified payment experience.
3.  **Digital Wallets**: Seamless integration of Google Pay and Apple Pay.
4.  **Security & UX**: Examples of handling CORS, HTTPS mixed content, and loading states properly.

It is designed to be a "clone-and-start" foundation for any marketplace or platform business model.

## 🚀 Features

- **Modern Booking UI**: A sleek, dark-themed interface mimicking a high-end salon experience.
- **Dynamic Payment Modes**:
    - **Pay Now**: Immediate charge processing (£5.00).
    - **Reserve Slot**: Pre-authorization logic (£0.00 upfront).
    - **Save Card**: Storing payment methods for future off-session usage.
- **Stripe Connect Support**: Dynamic initialization of Stripe.js using connected account IDs fetched from the backend.
- **Robust Error Handling**: User-friendly alerts and console logging for debugging.
- **Environment Configuration**: Secure setup using `.env` files.

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Payments**: 
    - `@stripe/stripe-js`
    - `@stripe/react-stripe-js`
- **Development Tools**: 
    - Ngrok (for local HTTPS testing)
    - ESLint

## 📋 Prerequisites

Before you begin, ensure you have:
1.  **Node.js**: v18 or higher installed.
2.  **Stripe Account**: A Stripe Connect platform account.
3.  **Backend Server**: An API running separately that handles the Stripe Secret Key operations.
    - *Note: This repo is frontend-only. Your backend must expose endpoints for payment intent creation.*

## ⚙️ Setup Instructions

### 1. Clone & Install
```bash
git clone https://github.com/your-username/stripe-connect-nextjs.git
cd stripe-connect-nextjs
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
# Your Stripe Platform Publishable Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Your Backend API URL (Must be HTTPS for Google Pay)
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
```

### 3. Running Locally
```bash
npm run dev
```
Visit `http://localhost:3005` to see the app.

### 4. Testing with Ngrok (Recommended)
To test **Google Pay** and **Apple Pay**, you must serve your site over HTTPS.
```bash
# Start Ngrok tunneling to your local port
npm run ngrok
```
This enables a public HTTPS URL (e.g., `https://xyz.ngrok-free.app`) that tunnels to your localhost.

## 🔌 Backend Integration Guide

Your backend is the bridge between this frontend and Stripe's API. Here is what it needs to send:

**Endpoint:** `POST /create-payment-intent`

**Response Format:**
```json
{
  "clientSecret": "pi_...",
  "connectedAccountId": "acct_..." 
}
```
*Crucially, returning `connectedAccountId` allows the frontend to dynamically switch contexts, ensuring the payment is attributed to the correct connected merchant.*

### Solving CORS Issues
If you face CORS errors while using Ngrok:
1.  Your backend **MUST** whitelist your Ngrok URL.
2.  Your backend **MUST** be accessible via HTTPS if your frontend is on HTTPS.

```javascript
// Example Express CORS setup
app.use(cors({
  origin: [
    'http://localhost:3005',
    'https://your-dynamic-ngrok-url.ngrok-free.dev'
  ],
  credentials: true
}));
```

## 🧪 Testing

Use Stripe's provided test cards to simulate various scenarios:

| Card Number | Expiry | CVC | Result |
| :--- | :--- | :--- | :--- |
| `4242 4242 4242 4242` | Any Future | Any | **Success** |
| `4000 0000 0000 0002` | Any Future | Any | **Decline** |

*[View full list of test cards](https://stripe.com/docs/testing)*

## 🤝 Contributing

Contributions are welcome! If you find a bug or want to improve the UI:
1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
