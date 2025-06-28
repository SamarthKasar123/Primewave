import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ManagerRoute, ClientRoute } from './components/ProtectedRoute';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import ManagerLogin from './pages/ManagerLogin';
import ClientLogin from './pages/ClientLogin';
import ClientRegister from './pages/ClientRegister';
import ManagerDashboard from './pages/ManagerDashboard';
import ClientDashboard from './pages/ClientDashboard';

// CSS
import './App.enhanced.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login/manager" element={<ManagerLogin />} />
            <Route path="/login/client" element={<ClientLogin />} />
            <Route path="/register" element={<ClientRegister />} />
            
            {/* Protected Manager Routes */}
            <Route element={<ManagerRoute />}>
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            </Route>
            
            {/* Protected Client Routes */}
            <Route element={<ClientRoute />}>
              <Route path="/client/dashboard" element={<ClientDashboard />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
