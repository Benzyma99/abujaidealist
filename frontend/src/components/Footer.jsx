import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <h3>AbujaIdealist</h3>
          <p>An Abuja branch of Idealist.</p>
          <p>Connect. Inspire. Act.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>

          <Link to="/about">About</Link>
          <Link to="/team">Our Team</Link>
          <Link to="/programs">Programs</Link>
          <Link to="/projects">Projects & Impact</Link>
          <Link to="/events">Events</Link>
          <Link to="/volunteer">Volunteer</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-action">
          <h4>Get Involved</h4>
          <p>
            Join our volunteer community and contribute to positive change
            in Abuja.
          </p>

          <Link to="/volunteer" className="footer-button">
            Become a Volunteer
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 AbujaIdealist. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;