import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";
import founderImage from "../assets/Amir Dar.png";

function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/team-members/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load team members");
        }

        return response.json();
      })
      .then((data) => {
        setTeamMembers(data);
      })
      .catch(() => {
        setError("Unable to load the team at the moment.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const leadershipTeam = teamMembers.filter(
    (member) => member.is_leadership
  );

  const otherTeamMembers = teamMembers.filter(
    (member) => !member.is_leadership
  );

  return (
    <main className="team-page">

      {/* Page Introduction */}
      <section className="page-hero">
        <div className="page-hero-content">
          <p className="section-label">Our Leadership & Team</p>

          <h1>Meet the people behind AbujaIdealist</h1>

          <p>
            Our team brings together volunteers who contribute their time,
            skills, and experience to support AbujaIdealist's activities
            across Abuja.
          </p>
        </div>
      </section>

      {/* Team Content */}
      <section className="team-preview">
        <div className="team-preview-content">

          {/* Founder */}
          <div className="founder-section">
            <p className="section-label">
              Founder & Executive Director
            </p>

            <div className="founder-card">
              <div className="founder-image">
                <img
                  src={founderImage}
                  alt="Amir Dar, Founder & Executive Director"
                />
              </div>

              <div className="founder-info">
                <h2>Amir Dar</h2>

                <p className="founder-role">
                  Founder & Executive Director
                </p>

                <p>
                  Amir Dar is the founder and Executive Director of Idealist,
                  the organization of which AbujaIdealist is an Abuja branch.
                </p>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && <p>Loading team...</p>}

          {/* Error */}
          {error && <p>{error}</p>}

          {/* AbujaIdealist Team */}
          {!loading && !error && (
            <>
              {/* Leadership Team */}
              <div className="team-section">
                <h2>Leadership Team</h2>

                <div className="team-cards">
                  {leadershipTeam.map((member) => (
                    <article className="team-card" key={member.id}>

                      <div className="team-card-photo">
                        {member.image_url ? (
                          <img
                            src={`${API_BASE_URL}${member.image_url}`}
                            alt={member.name}
                          />
                        ) : (
                          <span>Photo</span>
                        )}
                      </div>

                      <h3>{member.role}</h3>

                      <p>{member.name}</p>

                      <span>{member.department_name}</span>
                    </article>
                  ))}
                </div>
              </div>

              {/* Other Team Members */}
              <div className="team-section">
                <h2>Our Team</h2>

                <div className="team-cards team-full-grid">
                  {otherTeamMembers.map((member) => (
                    <article className="team-card" key={member.id}>

                      <div className="team-card-photo">
                        {member.image_url ? (
                          <img
                            src={`${API_BASE_URL}${member.image_url}`}
                            alt={member.name}
                          />
                        ) : (
                          <span>Photo</span>
                        )}
                      </div>

                      <h3>{member.role}</h3>

                      <p>{member.name}</p>

                      <span>{member.department_name}</span>
                    </article>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </section>

    </main>
  );
}

export default Team;