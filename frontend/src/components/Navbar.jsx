import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/idealist-logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <nav className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={logo} alt="AbujaIdealist logo" />
        </Link>

        <button
          className="mobile-menu-button"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${menuOpen ? "mobile-open" : ""}`}>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/about" onClick={closeMenu}>
            About
          </Link>

          <Link to="/team" onClick={closeMenu}>
            Our Team
          </Link>

          <Link to="/programs" onClick={closeMenu}>
            Programs
          </Link>

          <Link to="/projects" onClick={closeMenu}>
            Projects & Impact
          </Link>

          <Link to="/events" onClick={closeMenu}>
            Events
          </Link>

          <Link to="/volunteer" onClick={closeMenu}>
            Volunteer
          </Link>

          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;