import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        The Workshop
      </Link>
      <div className="navbar-menu">
        <Link to="/" className="nav-link">หน้าแรก</Link>
        <Link to="/workshop/1" className="nav-link">Workshop</Link>
      </div>
    </nav>
  );
}

export default Navbar;