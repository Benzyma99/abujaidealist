import { useEffect, useState } from "react";
import heroImage1 from "../assets/homepage-slide-1.png";
import heroImage2 from "../assets/homepage-slide-2.jpg";
import heroImage3 from "../assets/homepage-slide-3.jpg";
import heroImage4 from "../assets/homepage-slide-4.png";
import API_BASE_URL from "../services/api";

function Home() {
const heroSlides = [
  heroImage1,
  heroImage2,
  heroImage3,
  heroImage4,
];

const [currentSlide, setCurrentSlide] = useState(0);
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, 5000);

  return () => clearInterval(interval);
}, []);

  const [programs, setPrograms] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);

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
      .catch((error) => {
        console.error("Error loading programs:", error);
      })
      .finally(() => {
        setProgramsLoading(false);
      });
  }, []);

  return (
    <main className="home">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">AN ABUJA BRANCH OF IDEALIST</p>

          <h1>Connect. Inspire. Act.</h1>

          <p className="hero-description">
            AbujaIdealist brings people together to create positive change
            through volunteering, community service, youth development,
            healthcare, and education.
          </p>

          <div className="hero-actions">
            <a href="/volunteer" className="hero-button primary">
              Become a Volunteer →
            </a>

            <a href="/about" className="hero-button secondary">
              Learn More
            </a>
          </div>

          <div className="hero-values">
            <div className="hero-value">
              <span className="hero-value-icon">👥</span>

              <div>
                <strong>Connect</strong>
                <span>with opportunities</span>
              </div>
            </div>

            <div className="hero-value">
              <span className="hero-value-icon">💡</span>

              <div>
                <strong>Inspire</strong>
                <span>positive change</span>
              </div>
            </div>

            <div className="hero-value">
              <span className="hero-value-icon">🌱</span>

              <div>
                <strong>Act</strong>
                <span>for a better Abuja</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-image-wrapper">
  <img
    src={heroSlides[currentSlide]}
    alt={`AbujaIdealist community activity ${currentSlide + 1}`}
  />

  <div className="hero-slide-dots">
    {heroSlides.map((_, index) => (
      <button
        key={index}
        type="button"
        className={index === currentSlide ? "active" : ""}
        onClick={() => setCurrentSlide(index)}
        aria-label={`Show slide ${index + 1}`}
      />
    ))}
  </div>
</div>
      </section>

      {/* PROGRAMS */}
      <section className="programs-preview">
        <div className="programs-preview-content">
          <p className="section-label">What We Do</p>

          <h2>Creating opportunities to serve and make a difference</h2>

          {programsLoading ? (
            <p className="programs-status">Loading programs...</p>
          ) : programs.length === 0 ? (
            <p className="programs-status">
              Our programs will be available here soon.
            </p>
          ) : (
            <div className="program-cards">
              {programs.map((program) => (
                <article className="program-card" key={program.id}>
                  {program.image_url && (
                    <div className="program-card-image-wrapper">
                      <img
                        src={`${API_BASE_URL}${program.image_url}`}
                        alt={program.name}
                        className="program-card-image"
                      />
                    </div>
                  )}

                  <div className="program-card-content">
                    <h3>{program.name}</h3>

                    <p>{program.description}</p>

                    <a href="/programs" className="program-card-link">
                      Learn More →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}

          <a href="/programs" className="text-link">
            Explore our programs →
          </a>
        </div>
      </section>

      {/* IMPACT */}
      <section className="impact-preview">
        <div className="impact-preview-content">
          <p className="section-label">Our Impact</p>

          <h2>Turning volunteer action into community impact</h2>

          <div className="impact-cards">
            <article className="impact-card">
              <h3>Community Engagement</h3>

              <p>
                Connecting volunteers with activities that respond to community
                needs and create meaningful participation.
              </p>
            </article>

            <article className="impact-card">
              <h3>Youth Participation</h3>

              <p>
                Encouraging young people to develop skills, serve others, and
                take part in positive community initiatives.
              </p>
            </article>

            <article className="impact-card">
              <h3>Positive Change</h3>

              <p>
                Supporting practical volunteer efforts that contribute to
                stronger and more connected communities.
              </p>
            </article>
          </div>

          <a href="/projects" className="text-link">
            Explore our projects & impact →
          </a>
        </div>
      </section>

      {/* VOLUNTEER CTA */}
      <section className="volunteer-cta">
        <div className="volunteer-cta-content">
          <p className="section-label">Get Involved</p>

          <h2>Be part of positive change in Abuja</h2>

          <p>
            Your time, skills, and willingness to serve can make a difference.
            Join AbujaIdealist and contribute to meaningful volunteer
            opportunities in your community.
          </p>

          <a href="/volunteer" className="hero-button primary">
            Become a Volunteer
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-preview">
        <div className="about-preview-content">
          <p className="section-label">Who We Are</p>

          <h2>Building a better Abuja through people and action</h2>

          <p>
            AbujaIdealist connects people who want to make a difference with
            opportunities to serve their communities. As an Abuja branch of
            Idealist, we support volunteer-led efforts that contribute to youth
            development, healthcare, education, and community service.
          </p>

          <a href="/about" className="text-link">
            Learn more about AbujaIdealist →
          </a>
        </div>
      </section>
    </main>
  );
}

export default Home;