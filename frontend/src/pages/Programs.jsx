import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";

function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/programs/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load programs");
        }

        return response.json();
      })
      .then((data) => {
        setPrograms(data);
      })
      .catch(() => {
        setError("Unable to load programs at the moment.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="programs-page">

      <section className="page-hero">
        <div className="page-hero-content">
          <p className="section-label">Our Programs</p>

          <h1>Creating opportunities for positive change</h1>

          <p>
            AbujaIdealist connects volunteers with meaningful opportunities
            to support communities and contribute to positive change across Abuja.
          </p>
        </div>
      </section>

      <section className="programs-section">
        <div className="programs-container">

          {loading && <p>Loading programs...</p>}

          {error && <p>{error}</p>}

          {!loading && !error && (
            <div className="programs-grid">
              {programs.map((program) => (
                <article className="program-card" key={program.id}>

                  <div className="program-image">
                    <img
                      src={`${API_BASE_URL}${program.image_url}`}
                      alt={program.name}
                    />
                  </div>

                  <div className="program-content">
                    <h2>{program.name}</h2>

                    <p>{program.description}</p>

                    <a href="/volunteer" className="program-button">
                      Get Involved
                    </a>
                  </div>

                </article>
              ))}
            </div>
          )}

        </div>
      </section>

    </main>
  );
}

export default Programs;