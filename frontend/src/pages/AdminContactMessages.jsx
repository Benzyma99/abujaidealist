import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";

function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMessages() {
      try {
        const token = localStorage.getItem("admin_token");

        const response = await fetch(
          `${API_BASE_URL}/contact-messages/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            typeof data.detail === "string"
              ? data.detail
              : "Unable to load contact messages."
          );
        }

        setMessages(data);
      } catch (messagesError) {
        setError(messagesError.message);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, []);

  function closeMessage() {
    setSelectedMessage(null);
  }

  return (
    <main className="admin-management-page">

      <section className="admin-management-header">
        <div>
          <p className="section-label">Administration</p>

          <h1>Contact Messages</h1>

          <p>
            Review messages submitted through the
            AbujaIdealist Contact page.
          </p>
        </div>
      </section>

      <section className="admin-management-section">
        <div className="admin-management-container">

          {loading && (
            <p className="dashboard-loading">
              Loading messages...
            </p>
          )}

          {error && (
            <div className="form-message form-error">
              {error}
            </div>
          )}

          {!loading && !error && messages.length === 0 && (
            <div className="admin-empty-state">
              <h2>No contact messages yet</h2>

              <p>
                New messages submitted through the Contact
                page will appear here.
              </p>
            </div>
          )}

          {!loading && !error && messages.length > 0 && (
            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Submitted</th>
                  </tr>
                </thead>

                <tbody>
                  {messages.map((message) => (
                    <tr
                      key={message.id}
                      className="admin-table-row-clickable"
                      onClick={() =>
                        setSelectedMessage(message)
                      }
                    >
                      <td>
                        <strong>
                          {message.full_name}
                        </strong>
                      </td>

                      <td>{message.email}</td>

                      <td>{message.subject}</td>

                      <td>
                        <span className="admin-status">
                          {message.status}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          message.submitted_at
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </div>
      </section>

      {selectedMessage && (
        <div
          className="admin-modal-overlay"
          onClick={closeMessage}
        >
          <div
            className="admin-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="admin-modal-header">

              <div>
                <p className="section-label">
                  Contact Message
                </p>

                <h2>
                  {selectedMessage.subject}
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeMessage}
                aria-label="Close message"
              >
                ×
              </button>

            </div>

            <div className="admin-application-details">

              <div className="admin-detail-item">
                <span>Full Name</span>

                <strong>
                  {selectedMessage.full_name}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Email Address</span>

                <strong>
                  {selectedMessage.email}
                </strong>
              </div>

              <div className="admin-detail-item admin-detail-full">
                <span>Subject</span>

                <strong>
                  {selectedMessage.subject}
                </strong>
              </div>

              <div className="admin-detail-item admin-detail-full">
                <span>Message</span>

                <p>
                  {selectedMessage.message}
                </p>
              </div>

              <div className="admin-detail-item">
                <span>Status</span>

                <strong className="admin-status">
                  {selectedMessage.status}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Submitted</span>

                <strong>
                  {new Date(
                    selectedMessage.submitted_at
                  ).toLocaleString()}
                </strong>
              </div>

            </div>

            <div className="admin-modal-footer">

              <button
                type="button"
                className="admin-modal-button"
                onClick={closeMessage}
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </main>
  );
}

export default AdminContactMessages;