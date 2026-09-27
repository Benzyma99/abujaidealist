import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/projects/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load projects");
        }

        return response.json();
      })
      .then((data) => {
        setProjects(data);
      })
      .catch(() => {
        setError("Unable to load projects at the moment.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="projects-page">

      <section className="page-hero">
        <div className="page-hero-content">
          <p className="section-label">Projects & Impact</p>

          <h1>Turning ideas into meaningful community action</h1>

          <p>
            Explore AbujaIdealist projects and the impact created through
            volunteer action, community engagement and collaboration.
          </p>
        </div>
      </section>

      <section className="projects-section">
        <div className="projects-container">

          {loading && (
            <p className="projects-message">
              Loading projects...
            </p>
          )}

          {error && (
            <p className="projects-message">
              {error}
            </p>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="projects-empty">
              <h2>Projects coming soon</h2>

              <p>
                We are currently documenting AbujaIdealist projects and
                community impact. Check back soon to explore our work.
              </p>
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="projects-grid">

              {projects.map((project) => (
                <article className="project-card" key={project.id}>

                  <div className="project-image">
                    <img
                      src={`${API_BASE_URL}${project.image_url}`}
                      alt={project.name}
                    />
                  </div>

                  <div className="project-content">

                    <p className="project-date">
                      {new Date(project.date).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>

                    <h2>{project.name}</h2>

                    <p className="project-description">
                      {project.description}
                    </p>

                    <p className="project-location">
                      <strong>Location:</strong> {project.location}
                    </p>

                    <div className="project-impact">
                      <h3>Impact</h3>
                      <p>{project.impact}</p>
                    </div>

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

export default Projects;