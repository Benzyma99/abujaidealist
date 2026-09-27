import { useState } from "react";
import API_BASE_URL from "../services/api";

function Contact() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/contact-messages/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to send your message."
        );
      }

      setSuccess(
        "Thank you for contacting AbujaIdealist. Your message has been sent successfully."
      );

      setFormData({
        full_name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="contact-page">

      <section className="page-hero">
        <div className="page-hero-content">
          <p className="section-label">Contact Us</p>

          <h1>Let's connect and create positive change</h1>

          <p>
            Have a question, idea or message for AbujaIdealist?
            We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-container">

          <div className="contact-intro">
            <h2>Send Us a Message</h2>

            <p>
              Complete the form below and our team will get back to you.
            </p>
          </div>

          {success && (
            <div className="form-message form-success">
              {success}
            </div>
          )}

          {error && (
            <div className="form-message form-error">
              {error}
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>

            <div className="contact-form-grid">

              <div className="form-group">
                <label htmlFor="contact-full-name">
                  Full Name *
                </label>

                <input
                  id="contact-full-name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">
                  Email Address *
                </label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="form-group">
              <label htmlFor="contact-subject">
                Subject *
              </label>

              <input
                id="contact-subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">
                Message *
              </label>

              <textarea
                id="contact-message"
                name="message"
                rows="7"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="contact-submit"
              disabled={submitting}
            >
              {submitting ? "Sending Message..." : "Send Message"}
            </button>

          </form>

        </div>
      </section>

    </main>
  );
}

export default Contact;