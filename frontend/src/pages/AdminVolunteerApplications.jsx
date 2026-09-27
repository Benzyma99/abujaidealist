import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";

function AdminVolunteerApplications() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        const token = localStorage.getItem("admin_token");

        const response = await fetch(
          `${API_BASE_URL}/volunteer-applications/`,
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
              : "Unable to load volunteer applications."
          );
        }

        setApplications(data);
      } catch (applicationsError) {
        setError(applicationsError.message);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  function closeApplication() {
    setSelectedApplication(null);
  }

  function getProgramNames(programs) {
    if (!programs || programs.length === 0) {
      return "Not provided";
    }

    return programs
      .map((program) =>
        typeof program === "object"
          ? program.name
          : program
      )
      .filter(Boolean)
      .join(", ");
  }

  function getSkillNames(skills) {
    if (!skills || skills.length === 0) {
      return "Not provided";
    }

    return skills
      .map((skill) =>
        typeof skill === "object"
          ? skill.name
          : skill
      )
      .filter(Boolean)
      .join(", ");
  }

  return (
    <main className="admin-management-page">

      <section className="admin-management-header">
        <div>
          <p className="section-label">Administration</p>

          <h1>Volunteer Applications</h1>

          <p>
            Review volunteer applications submitted through
            the AbujaIdealist website.
          </p>
        </div>
      </section>

      <section className="admin-management-section">
        <div className="admin-management-container">

          {loading && (
            <p className="dashboard-loading">
              Loading applications...
            </p>
          )}

          {error && (
            <div className="form-message form-error">
              {error}
            </div>
          )}

          {!loading && !error && applications.length === 0 && (
            <div className="admin-empty-state">
              <h2>No volunteer applications yet</h2>

              <p>
                New volunteer applications will appear here.
              </p>
            </div>
          )}

          {!loading && !error && applications.length > 0 && (
            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Submitted</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((application) => (
                    <tr
                      key={application.id}
                      className="admin-table-row-clickable"
                      onClick={() =>
                        setSelectedApplication(application)
                      }
                    >
                      <td>
                        <strong>
                          {application.full_name}
                        </strong>
                      </td>

                      <td>{application.email}</td>

                      <td>{application.phone}</td>

                      <td>{application.location}</td>

                      <td>
                        <span className="admin-status">
                          {application.status}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          application.submitted_at
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

      {selectedApplication && (
        <div
          className="admin-modal-overlay"
          onClick={closeApplication}
        >
          <div
            className="admin-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="admin-modal-header">

              <div>
                <p className="section-label">
                  Volunteer Application
                </p>

                <h2>
                  {selectedApplication.full_name}
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeApplication}
                aria-label="Close application"
              >
                ×
              </button>

            </div>

            <div className="admin-application-details">

              <div className="admin-detail-item">
                <span>Email Address</span>

                <strong>
                  {selectedApplication.email}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Phone Number</span>

                <strong>
                  {selectedApplication.phone}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Location</span>

                <strong>
                  {selectedApplication.location}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Occupation</span>

                <strong>
                  {selectedApplication.occupation}
                </strong>
              </div>

              <div className="admin-detail-item admin-detail-full">
                <span>Education Background</span>

                <p>
                  {selectedApplication.education_background}
                </p>
              </div>

              <div className="admin-detail-item admin-detail-full">
                <span>Previous Volunteering Experience</span>

                <p>
                  {selectedApplication.previous_volunteering_experience}
                </p>
              </div>

              <div className="admin-detail-item admin-detail-full">
                <span>Programs Selected</span>

                <p>
                  {getProgramNames(
                    selectedApplication.programs
                  )}
                </p>
              </div>

              <div className="admin-detail-item admin-detail-full">
                <span>Skills Selected</span>

                <p>
                  {getSkillNames(
                    selectedApplication.skills
                  )}
                </p>
              </div>

              <div className="admin-detail-item admin-detail-full">
                <span>Other Skills or Details</span>

                <p>
                  {selectedApplication.other_skills_details ||
                    "Not provided"}
                </p>
              </div>

              <div className="admin-detail-item admin-detail-full">
                <span>Availability</span>

                <p>
                  {selectedApplication.availability}
                </p>
              </div>

              <div className="admin-detail-item admin-detail-full">
                <span>Why They Want to Volunteer</span>

                <p>
                  {selectedApplication.motivation}
                </p>
              </div>

              <div className="admin-detail-item">
                <span>Status</span>

                <strong className="admin-status">
                  {selectedApplication.status}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Submitted</span>

                <strong>
                  {new Date(
                    selectedApplication.submitted_at
                  ).toLocaleString()}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Consent</span>

                <strong>
                  {selectedApplication.consent
                    ? "Confirmed"
                    : "Not confirmed"}
                </strong>
              </div>

            </div>

            <div className="admin-modal-footer">

              <button
                type="button"
                className="admin-modal-button"
                onClick={closeApplication}
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

export default AdminVolunteerApplications;