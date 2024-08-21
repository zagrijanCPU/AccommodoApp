import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home';
import Navbar from './components/Navbar/Navbar';
import Login from './components/AccessControl/Login';
import Register from './components/AccessControl/Register';
import Logout from './components/AccessControl/Logout';
import ShowRequests from './components/Requests/ShowRequests';
import SendRequest from './components/Requests/SendRequest';
import ShowRequest from './components/Requests/ShowRequest';
import ShowAccommodations from './components/Accommodations/ShowAccommodations';
import ShowAccommodation from './components/Accommodations/ShowAccommodation';
import SearchResult from './components/SearchResult';
import Reservations from './components/Reservations/Reservations';
import ShowUsers from './components/Users/ShowUsers';
import RecommendedAccommodations from './components/Accommodations/RecommendedAccommodations';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/allRequests" element={<ShowRequests />} />
          <Route path="/myRequests" element={<ShowRequests />} />
          <Route path="/sendRequest" element={<SendRequest />} />
          <Route path="/request/:id" element={<ShowRequest />} />
          <Route path="/myAccommodations" element={<ShowAccommodations />} />
          <Route path="/allAccommodations" element={<ShowAccommodations />} />
          <Route path="/accommodation/:id" element={<ShowAccommodation />} />
          <Route path="/searchResult" element={<SearchResult />} />
          <Route path="/myReservations" element={<Reservations />} />
          <Route path="/allUsers" element={<ShowUsers />} />
          <Route path="/recommendation" element={<RecommendedAccommodations />} />
        </Routes>
      </Router>
    </div>
  );
}

export const baseUrl = "http://localhost:8080";
export const storedToken = sessionStorage.getItem('token');
export const role = sessionStorage.getItem('role');

export const getImageSource = (imageData) => {
  if (imageData) {
    const blob = new Blob([new Uint8Array(imageData.data)], { type: 'image/jpeg' });
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl
  }
  return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMzAgMy40MTRMMjguNTg2IDJMMiAyOC41ODZMMy40MTQgMzBsMi0ySDI2YTIuMDAzIDIuMDAzIDAgMCAwIDItMlY1LjQxNHpNMjYgMjZINy40MTRsNy43OTMtNy43OTNsMi4zNzkgMi4zNzlhMiAyIDAgMCAwIDIuODI4IDBMMjIgMTlsNCAzLjk5N3ptMC01LjgzMmwtMi41ODYtMi41ODZhMiAyIDAgMCAwLTIuODI4IDBMMTkgMTkuMTY4bC0yLjM3Ny0yLjM3N0wyNiA3LjQxNHpNNiAyMnYtM2w1LTQuOTk3bDEuMzczIDEuMzc0bDEuNDE2LTEuNDE2bC0xLjM3NS0xLjM3NWEyIDIgMCAwIDAtMi44MjggMEw2IDE2LjE3MlY2aDE2VjRINmEyLjAwMiAyLjAwMiAwIDAgMC0yIDJ2MTZ6Ii8+PC9zdmc+";
};

export const getPdfSource = (pdfData) => {
  const blob = new Blob([new Uint8Array(pdfData.data)], { type: 'application/pdf' });
  const pdfUrl = URL.createObjectURL(blob);
  return pdfUrl;
};

export const itemsType = ["requests", "accommodations", "reservations", "users"];

export default App;

