// Navbar.js

import React from 'react';
import { storedToken } from '../../App';
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
            {!storedToken && <Navitem path="/login" text="Login"/> }
            {!storedToken && <Navitem path="/register" text="Register" />}
            {storedToken && <Navitem path="/logout" text="Logout"/>}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
