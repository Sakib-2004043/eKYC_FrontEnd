import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/landing';
import SignUp from './pages/signUp/signUp';
import Login from './pages/logIn/logIn';
import Admin from './pages/admin/admin';
import Navbar from './component/navBar/navBar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;
