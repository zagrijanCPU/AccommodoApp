// Navbar.js

import React, { useEffect, useState } from 'react';
import { baseUrl, storedToken, role } from '../../App';
import Navitem from './Navitem';

function Navbar() {

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">AccommodoApp</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mynavbar">
          <ul className="navbar-nav">
            {(storedToken && role === "gost") && <Navitem path="/myReservations" text="My Reservations" />}
            {(storedToken && role === "vlasnik") && <Navitem path="/myAccommodations" text="My Accommodations" />}
            {(storedToken && role === "vlasnik") && <Navitem path="/sendRequest" text="Send Request" />}
            {(storedToken && role === "admin") && <Navitem path="/allAccommodations" text="All Accommodations" />}
            {(storedToken && role === "admin") && <Navitem path="/allRequests" text="All Requests" />}
            {(storedToken && role === "vlasnik") && <Navitem path="/myRequests" text="My Requests" />}
            {/* {storedToken && (role === "admin" ||role === "vlasnik") && <Navitem path="/allRequests" text={role === "admin" ? "All Requests" : "My Requests"} />} */}
            {!storedToken && <Navitem path="/login" text="Login" />}
            {!storedToken && <Navitem path="/register" text="Register" />}
            {storedToken && <Navitem path="/logout" text="Logout" />}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
