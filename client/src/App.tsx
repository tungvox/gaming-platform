import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import GameList from './components/GameList';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.scss';

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { token } = useAuth();
  return token ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/games" element={<ProtectedRoute element={<GameList />} />} />
            <Route path="/" element={<Navigate to="/games" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
