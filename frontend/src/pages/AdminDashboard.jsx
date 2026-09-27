import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../services/api";

function AdminDashboard() {
  const [volunteerCount, setVolunteerCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [programCount, setProgramCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const token = localStorage.getItem("admin_token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          volunteerResponse,
          contactResponse,
          teamResponse,
          programResponse,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/volunteer-applications/`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/contact-messages/`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/team-members/`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/programs/`, {
            headers,
          }),
        ]);

        if (
          !volunteerResponse.ok ||
          !contactResponse.ok ||
          !teamResponse.ok ||
          !programResponse.ok
        ) {
          throw new Error("Unable to load dashboard data.");
        }

        const volunteers = await volunteerResponse.json();
        const contacts = await contactResponse.json();
        const team = await teamResponse.json();
        const programs = await programResponse.json();

        setVolunteerCount(volunteers.length);
        setContactCount(contacts.length);
        setTeamCount(team.length);
        setProgramCount(programs.length);
      } catch (dashboardError) {
        setError(dashboardError.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <main className="admin-dashboard-page">

      <section className="admin-dashboard-header">
        <div>
          <p className="section-label">Administration</p>

          <h1>AbujaIdealist Dashboard</h1>

          <p>
            Manage website content, volunteer applications,
            messages and organizational information.
          </p>
        </div>
      </section>

      <section className="admin-dashboard-section">
        <div className="admin-dashboard-container">

          {loading && (
            <p className="dashboard-loading">
              Loading dashboard...
            </p>
          )}

          {error && (
            <div className="form-message form-error">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="admin-stat-grid">

                <article className="admin-stat-card">
                  <span>Volunteer Applications</span>
                  <strong>{volunteerCount}</strong>
                </article>

                <article className="admin-stat-card">
                  <span>Contact Messages</span>
                  <strong>{contactCount}</strong>
                </article>

                <article className="admin-stat-card">
                  <span>Team Members</span>
                  <strong>{teamCount}</strong>
                </article>

                <article className="admin-stat-card">
                  <span>Programs</span>
                  <strong>{programCount}</strong>
                </article>

              </div>

              <div className="admin-dashboard-actions">

                <div className="admin-action-card">
                  <h2>Volunteer Applications</h2>

                  <p>
                    Review and manage people who have applied
                    to volunteer with AbujaIdealist.
                  </p>

                  <Link
                    to="/admin/volunteer-applications"
                    className="admin-dashboard-button"
                  >
                    View Applications
                  </Link>
                </div>

                <div className="admin-action-card">
                  <h2>Contact Messages</h2>

                  <p>
                    Review messages submitted through the
                    public Contact page.
                  </p>

                  <Link
                    to="/admin/contact-messages"
                    className="admin-dashboard-button"
                  >
                    View Messages
                  </Link>
                </div>

              </div>
            </>
          )}

        </div>
      </section>

    </main>
  );
}

export default AdminDashboard;