# Primewave - Video Editing Agency Web Platform

## Overview
Primewave is a professional website for a video editing agency built with the MERN stack (MongoDB, Express, React, Node.js). This platform offers separate login interfaces for managers and clients, with client registration functionality.

## Features
- Modern and professional UI design
- Authentication system with JWT
- Two types of user roles: Managers and Clients
- Secure login for managers (pre-registered accounts only)
- Client registration and login system
- MongoDB Atlas integration for data storage


## Tech Stack
- **Frontend**: React.js, Bootstrap, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)

## Installation

### Prerequisites
- Node.js and npm installed
- MongoDB Atlas account (for the database)

### Setting Up the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/primewavedb
   JWT_SECRET=primewave_jwt_secret_key
   ```
4. Seed the manager accounts:
   ```bash
   npm run seed
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### Setting Up the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Deployment
1. Build the frontend:
   ```bash
   cd frontend && npm run build
   ```
2. Deploy backend and frontend to your preferred hosting service (Heroku, Vercel, Netlify, etc.)
3. Configure MongoDB Atlas for production use

## License
ISC
