# AxisWear - Urban Outerwear E-commerce Storefront

## Overview

AxisWear is an e-commerce platform that lets you browse and buy high-performance urban outerwear. It simplifies the shopping experience by offering a streamlined catalog, secure user authentication, and a smooth checkout process for tactical apparel, so you can easily find and purchase the gear you need.

## Description

This project delivers a high-end, editorial-style e-commerce storefront for an urban modular outerwear brand. It focuses on a clean, technical aesthetic and provides a full shopping experience from product discovery to secure payment. You'll find features like user authentication, a dynamic product catalog with filtering, a persistent shopping cart, and integration with a payment gateway.

## Installation

Getting AxisWear up and running on your local machine is straightforward.

1.  **Clone the Repository**

    Start by cloning the project to your local development environment:

    ```bash
    git clone https://github.com/U22099/axis-wear.git
    cd axis-wear
    ```

2.  **Install Dependencies**

    Once you're in the project directory, install all the necessary packages using your preferred package manager:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set Up Environment Variables**

    Create a `.env.local` file in the root of your project and add the following environment variables. You'll need to get your Supabase and Paystack API keys and URLs.

    ```dotenv
    # Supabase credentials (from your Supabase project settings)
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="YOUR_SUPABASE_PUBLISHABLE_KEY"

    # Paystack secret key (for webhook verification, keep this secure!)
    PAYSTACK_SECRET_KEY="YOUR_PAYSTACK_SECRET_KEY"

    # Your public site URL (used for Open Graph images)
    NEXT_PUBLIC_SITE_URL="http://localhost:3000" # or your deployed URL
    ```

4.  **Run Supabase Local Development**

    This project is designed to work with Supabase locally. Navigate to the `supabase` directory and initialize Supabase. Make sure you have the Supabase CLI installed.

    ```bash
    supabase init
    supabase start
    ```

    After starting Supabase, apply the database schema and seed data.
    ```bash
    supabase db push
    supabase db reset
    ```

5.  **Start the Development Server**

    Now you can fire up the Next.js development server:

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application running.

## Usage

Once the development server is running, you can interact with the AxisWear storefront:

1.  **Browse the Catalog**: The homepage displays a catalog of high-performance urban outerwear. You can use the filters to narrow down products by category, size, or availability (in stock only).
2.  **View Product Details**: Click on any product card to see a detailed page with more images, a description, price, available sizes, and stock information.
3.  **Add to Cart**: On the product detail page, select your preferred size and quantity, then add the item to your shopping bag. The cart drawer will automatically open.
4.  **Manage Your Cart**: The cart drawer, accessible from the header, allows you to review your selected items, adjust quantities, or remove items.
5.  **User Authentication**: You can sign in using Google OAuth or a one-time password (OTP) sent to your email. Signing in allows you to save your shipping details and view past orders. Look for the "Sign In" button in the header.
6.  **Checkout**: When you're ready to purchase, proceed to the checkout page. If you're signed in, your addresses will pre-fill. You can update shipping and billing details, and view your order history.
7.  **Secure Payment**: The checkout process integrates with Paystack. If `PAYSTACK_SECRET_KEY` is not configured, the system offers a mock payment simulation to demonstrate the order fulfillment pipeline without actual transactions.

## Features

*   **Dynamic Product Catalog**: Browse a curated collection of urban outerwear with filtering options by category, size, and stock availability.
*   **Product Detail Pages**: Comprehensive views for each product, including descriptions, prices, image galleries, and real-time stock levels for different variants.
*   **User Authentication**: Secure sign-in and sign-up with Google OAuth or email OTP, powered by Supabase Auth.
*   **Persistent Shopping Cart**: Add, update, and remove items from your cart. Your cart contents persist across sessions using local storage.
*   **Streamlined Checkout Flow**: A clear, multi-step checkout experience for guests and authenticated users, with an order summary and address management.
*   **Paystack Payment Integration**: Securely process payments via Paystack. Includes webhook handling for transaction verification and stock updates.
*   **Order History**: Authenticated users can view their past orders and track their status.
*   **Responsive Design**: A smooth user experience across various devices and screen sizes.
*   **Smooth Scrolling**: Enhanced navigation experience with Lenis for fluid scrolling animations.
*   **Modern UI Components**: Reusable and styled UI components like buttons, inputs, modals, and loaders for a consistent look and feel.

## Technologies Used

| Technology                                               | Description                                                               |
| :------------------------------------------------------- | :------------------------------------------------------------------------ |
| [Next.js](https://nextjs.org/)                           | React framework for building full-stack web applications.                 |
| [React](https://react.dev/)                              | JavaScript library for building user interfaces.                          |
| [TypeScript](https://www.typescriptlang.org/)            | Typed superset of JavaScript that compiles to plain JavaScript.           |
| [Tailwind CSS](https://tailwindcss.com/)                 | Utility-first CSS framework for rapidly styling components.               |
| [Supabase](https://supabase.com/)                        | Open source Firebase alternative for database, auth, and storage.         |
| [PostgreSQL](https://www.postgresql.org/)                | Powerful, open source object-relational database system.                  |
| [Paystack](https://paystack.com/)                        | Payment gateway for online transactions.                                  |
| [Framer Motion](https://www.framer.com/motion/)          | Production-ready motion library for React.                                |
| [Lenis](https://github.com/studio-freight/lenis)          | Lightweight JavaScript library for smooth scrolling.                      |
| [Lucide React](https://lucide.dev/)                      | Beautifully simple and consistent icons.                                  |
| [Canvas Confetti](https://github.com/catdad/canvas-confetti) | JavaScript library for creating confetti animations.                      |

## Contributing

We welcome contributions to AxisWear! If you have suggestions for improvements, new features, or find a bug, please feel free to open an issue or submit a pull request. We appreciate your help in making this project better.

## Author Info

*   **Dan**
    *   [LinkedIn](https://linkedin.com/in/dan22099)
    *   [X](https://x.com/dan_22099)

## Badges

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Paystack](https://img.shields.io/badge/Paystack-00C3F7?style=for-the-badge&logo=paystack&logoColor=white)](https://paystack.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Lenis](https://img.shields.io/badge/Lenis-FF0000?style=for-the-badge&logoColor=white)](https://github.com/studio-freight/lenis)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://dokugen.samueltuoyo.com)