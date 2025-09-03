## BusGo - React Bus Booking Application
Welcome to BusGo, a modern, single-page bus booking application built with React.js and styled with Tailwind CSS. This project provides a complete user flow for searching, selecting, and booking bus tickets, all within a sleek and responsive interface.

## Features
👤 User Session: A simple login page to simulate a user session.

🔍 Bus Search: An intuitive form to search for buses between major cities on a specific date.

🚌 Bus Listings: A clean, responsive list of available buses with details like timing, price, and ratings.

💺 Visual Seat Selector: An interactive seat map to select desired seats, showing available, booked, and selected states.

📄 Booking Summary: A real-time summary of selected seats and the total price.

✅ Confirmation Page: A final confirmation screen that acts as an e-ticket for the user.

🎟️ My Bookings: A dedicated page for users to view their past booking history.

✨ Modern Styling: A stylish UI with a custom font (Inter), subtle gradients, and custom scrollbars for a premium feel.

## Tech Stack
Frontend: React.js (v16.8+ for Hooks)

Styling: Tailwind CSS (v3)

Development Environment: Create React App

Package Manager: npm

Local Setup and Installation
To run this project on your local machine, follow these steps:

Prerequisites: Ensure you have Node.js and npm installed.

Create a React App:

npx create-react-app busgo-app
cd busgo-app

## Install Tailwind CSS:

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Configure Tailwind CSS:
Update your tailwind.config.js to scan your source files for class names:

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

## Include Tailwind in your CSS:
Replace the contents of ./src/index.css with the global styles and Tailwind directives. (You can copy the code from the src/index.css file we created).

Add the Main Application Code:
Replace the entire content of ./src/App.js with the provided bus_booking_app.jsx code.

Fix the Entry Point:
Ensure the main entry file (./src/index.js or main.jsx) imports React. Add this line to the top if it's missing:

import React from 'react';

Start the Development Server:

npm start

The application should now be running at http://localhost:3000.

File Overview
src/App.js: The main and only React component file. It contains all the logic, UI components, and state management for the entire application.

src/index.css: The global stylesheet. It includes the necessary Tailwind CSS directives and custom styles for the font, background gradient, animations, and scrollbar.

tailwind.config.js: The configuration file for Tailwind CSS.