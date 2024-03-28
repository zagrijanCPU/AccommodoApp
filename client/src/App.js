import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home';
import Navbar from './components/navbar/Navbar';
import Login from './components/AccessControl/Login';
import Register from './components/AccessControl/Register';
import Logout from './components/AccessControl/Logout';


function App() {

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={ <Logout/>} />
        </Routes>
      </Router>
    </div>
  );
}

export const baseUrl = "http://localhost:8080";
export const storedToken = sessionStorage.getItem('token');
export default App;