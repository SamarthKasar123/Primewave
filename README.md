# 🎬 Primewave - Professional Video Editing Agency Platform

<div align="center">

![Primewave Logo](https://img.shields.io/badge/Primewave-Video%20Editing%20Agency-blue?style=for-the-badge&logo=video&logoColor=white)

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-primewave.me-success?style=for-the-badge)](https://primewave.me)
[![Frontend](https://img.shields.io/badge/🚀%20Frontend-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://primewave.netlify.app)
[![Backend API](https://img.shields.io/badge/⚡%20Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://primewave-backend.onrender.com)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

</div>

## 📋 Overview

Primewave is a modern, full-stack web platform designed for professional video editing agencies. Built with the MERN stack, it provides a seamless experience for both agency managers and clients with role-based authentication, project management, and secure user registration.

### 🌟 Key Features

- 🎨 **Modern UI/UX**: Clean, professional design with Bootstrap styling
- 🔐 **Secure Authentication**: JWT-based authentication system
- 👥 **Role-Based Access**: Separate interfaces for managers and clients
- 📱 **Responsive Design**: Mobile-first, cross-device compatibility
- 🗄️ **Cloud Database**: MongoDB Atlas integration
- 🚀 **Production Ready**: Deployed on Netlify & Render with custom domain

## 🔗 Live Links

- **🌐 Main Website**: [primewave.me](https://primewave.me)
- **🚀 Frontend Application**: [primewave.netlify.app](https://primewave.netlify.app)
- **⚡ Backend API**: [primewave-backend.onrender.com](https://primewave-backend.onrender.com)

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js 18.2.0
- **Styling**: Bootstrap 5.3.7, Custom CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **State Management**: Context API
- **Icons**: Bootstrap Icons
- **Notifications**: React Toastify

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Environment**: dotenv
- **CORS**: Enabled for cross-origin requests

### Deployment & DevOps
- **Frontend Hosting**: Netlify
- **Backend Hosting**: Render
- **Database**: MongoDB Atlas (Cloud)
- **Domain**: Custom domain (primewave.me)
- **Version Control**: Git & GitHub

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Git

### 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/SamarthKasar123/Primewave.git
   cd Primewave
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Add your MongoDB URI and JWT secret
   
   # Seed manager accounts
   npm run seed
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Create .env file
   echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
   
   # Start development server
   npm start
   ```

4. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 📁 Project Structure

```
Primewave/
├── backend/
│   ├── config/
│   │   └── in-memory-db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Client.js
│   │   ├── Manager.js
│   │   └── Project.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── projects.js
│   ├── .env.example
│   ├── package.json
│   ├── seedManagers.js
│   ├── server.js
│   └── testConnection.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── assets/
│   ├── package.json
│   └── netlify.toml
├── README.md
├── LICENSE
└── .gitignore
```

## 🔑 Environment Variables

### Backend (.env)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_jwt_secret
FRONTEND_URL=https://primewave.netlify.app
NODE_ENV=production
PORT=5000
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://primewave-backend.onrender.com/api
NODE_ENV=production
```

## 👥 Default Manager Accounts

For testing purposes, the following manager accounts are pre-seeded:

| Username | Password | Email |
|----------|----------|-------|
| siddharth | Siddharth@123 | siddharth@primewave.com |
| abhinav | Abhinav@123 | abhinav@primewave.com |

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/client/register` - Client registration
- `POST /api/auth/client/login` - Client login
- `POST /api/auth/manager/login` - Manager login

### Health & Debug
- `GET /api/health` - Health check
- `GET /api/debug/routes` - List all routes

## 🚀 Deployment

### Frontend (Netlify)
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Configure custom domain and SSL

### Backend (Render)
1. Connect GitHub repository to Render
2. Set environment variables
3. Deploy with auto-deploy enabled

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Samarth Kasar**
- GitHub: [@SamarthKasar123](https://github.com/SamarthKasar123)
- Website: [primewave.me](https://primewave.me)

## 🙏 Acknowledgments

- React.js team for the amazing framework
- MongoDB for the reliable database service
- Netlify & Render for seamless deployment
- Bootstrap for the responsive UI components

## 📊 Project Status

![GitHub last commit](https://img.shields.io/github/last-commit/SamarthKasar123/Primewave?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/SamarthKasar123/Primewave?style=for-the-badge)
![GitHub stars](https://img.shields.io/github/stars/SamarthKasar123/Primewave?style=for-the-badge)

---

<div align="center">
Made with ❤️ by <a href="https://github.com/SamarthKasar123">Samarth Kasar</a>
</div>
