import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";

function Volunteer() {
  const [programs, setPrograms] = useState([]);
  const [skills, setSkills] = useState([]);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    education_background: "",
    occupation: "",
    previous_volunteering_experience: "",
    other_skills_details: "",
    availability: "",
    motivation: "",
    consent: false,
    skill_ids: [],
    program_ids: [],
  });

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/programs/`).then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load programs");
        }
        return response.json();
      }),

      fetch(`${API_BASE_URL}/skills/`).then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load skills");
        }
        return response.json();
      }),
    ])
      .then(([programData, skillData]) => {
        setPrograms(programData);
        setSkills(skillData);
      })
      .catch(() => {
        setError("Unable to load volunteer options at the moment.");
      })
      .finally(() => {
        setLoadingOptions(false);
      });
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleProgramChange(programId) {
    setFormData((previous) => ({
      ...previous,
      program_ids: previous.program_ids.includes(programId)
        ? previous.program_ids.filter((id) => id !== programId)
        : [...previous.program_ids, programId],
    }));
  }

  function handleSkillChange(skillId) {
    setFormData((previous) => ({
      ...previous,
      skill_ids: previous.skill_ids.includes(skillId)
        ? previous.skill_ids.filter((id) => id !== skillId)
        : [...previous.skill_ids, skillId],
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setSuccess("");
    setError("");

    if (formData.program_ids.length === 0) {
      setError("Please select at least one program you would like to support.");
      setSubmitting(false);
      return;
    }

    if (formData.skill_ids.length === 0) {
      setError("Please select at least one skill.");
      setSubmitting(false);
      return;
    }

    if (!formData.consent) {
      setError("Please confirm your consent before submitting the application.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/volunteer-applications/`,
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
          data.detail || "Unable to submit your volunteer application."
        );
      }

      setSuccess(
        "Thank you for applying to volunteer with AbujaIdealist. Your application has been submitted successfully."
      );

      setFormData({
        full_name: "",
        email: "",
        phone: "",
        location: "",
        education_background: "",
        occupation: "",
        previous_volunteering_experience: "",
        other_skills_details: "",
        availability: "",
        motivation: "",
        consent: false,
        skill_ids: [],
        program_ids: [],
      });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="volunteer-page">

      <section className="page-hero">
        <div className="page-hero-content">
          <p className="section-label">Volunteer With Us</p>

          <h1>Use your time and skills to create positive change</h1>

          <p>
            Join the AbujaIdealist volunteer community and contribute to
            meaningful work that supports communities across Abuja.
          </p>
        </div>
      </section>

      <section className="volunteer-section">
        <div className="volunteer-container">

          <div className="volunteer-intro">
            <h2>Volunteer Application</h2>

            <p>
              Tell us a little about yourself, your experience and the areas
              where you would like to contribute.
            </p>
          </div>

          {loadingOptions && (
            <p className="form-message">
              Loading volunteer options...
            </p>
          )}

          {error && (
            <div className="form-message form-error">
              {error}
            </div>
          )}

          {success && (
            <div className="form-message form-success">
              {success}
            </div>
          )}

          {!loadingOptions && (
            <form className="volunteer-form" onSubmit={handleSubmit}>

              <div className="form-grid">

                <div className="form-group">
                  <label htmlFor="full_name">
                    Full Name *
                  </label>

                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number *
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">
                    Location *
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g. Abuja, FCT"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="education_background">
                    Education Background *
                  </label>

                  <textarea
                    id="education_background"
                    name="education_background"
                    rows="4"
                    value={formData.education_background}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="occupation">
                    Occupation *
                  </label>

                  <input
                    id="occupation"
                    name="occupation"
                    type="text"
                    value={formData.occupation}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="form-group">
                <label htmlFor="previous_volunteering_experience">
                  Previous Volunteering Experience *
                </label>

                <textarea
                  id="previous_volunteering_experience"
                  name="previous_volunteering_experience"
                  rows="5"
                  value={formData.previous_volunteering_experience}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Programs You Would Like to Support *
                </label>

                <div className="checkbox-grid">
                  {programs.map((program) => (
                    <label
                      className="checkbox-item"
                      key={program.id}
                    >
                      <input
                        type="checkbox"
                        checked={formData.program_ids.includes(program.id)}
                        onChange={() =>
                          handleProgramChange(program.id)
                        }
                      />

                      <span>{program.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>
                  Skills *
                </label>

                <div className="checkbox-grid">
                  {skills.map((skill) => (
                    <label
                      className="checkbox-item"
                      key={skill.id}
                    >
                      <input
                        type="checkbox"
                        checked={formData.skill_ids.includes(skill.id)}
                        onChange={() =>
                          handleSkillChange(skill.id)
                        }
                      />

                      <span>{skill.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="other_skills_details">
                  Other Skills or Details
                </label>

                <textarea
                  id="other_skills_details"
                  name="other_skills_details"
                  rows="4"
                  placeholder="Tell us about any additional skills or experience."
                  value={formData.other_skills_details}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="availability">
                  Availability *
                </label>

                <textarea
                  id="availability"
                  name="availability"
                  rows="4"
                  placeholder="Tell us when you are generally available."
                  value={formData.availability}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="motivation">
                  Why would you like to volunteer with AbujaIdealist? *
                </label>

                <textarea
                  id="motivation"
                  name="motivation"
                  rows="6"
                  value={formData.motivation}
                  onChange={handleChange}
                  required
                />
              </div>

              <label className="consent-item">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                />

                <span>
                  I confirm that the information provided is accurate and
                  consent to AbujaIdealist using it for volunteer application
                  and communication purposes. *
                </span>
              </label>

              <button
                type="submit"
                className="volunteer-submit"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting Application..."
                  : "Submit Volunteer Application"}
              </button>

            </form>
          )}

        </div>
      </section>

    </main>
  );
}

export default Volunteer;