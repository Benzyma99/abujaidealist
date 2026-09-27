import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/events/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load events");
        }

        return response.json();
      })
      .then((data) => {
        setEvents(data);
      })
      .catch(() => {
        setError("Unable to load events at the moment.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="events-page">

      <section className="page-hero">
        <div className="page-hero-content">
          <p className="section-label">Our Events</p>

          <h1>Connect, learn and take action</h1>

          <p>
            Discover upcoming AbujaIdealist events, conversations and
            community activities designed to connect people and inspire action.
          </p>
        </div>
      </section>

      <section className="events-section">
        <div className="events-container">

          {loading && <p>Loading events...</p>}

          {error && <p>{error}</p>}

          {!loading && !error && events.length === 0 && (
            <p className="no-events">
              No upcoming events at the moment. Please check back soon.
            </p>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="events-grid">

              {events.map((event) => (
                <article className="event-card" key={event.id}>

                  <div className="event-image">
                    <img
                      src={`${API_BASE_URL}${event.image_url}`}
                      alt={event.name}
                    />
                  </div>

                  <div className="event-content">

                    <p className="event-date">
                      {new Date(event.date).toLocaleDateString("en-NG", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>

                    <h2>{event.name}</h2>

                    <p className="event-description">
                      {event.description}
                    </p>

                    <div className="event-details">

                      <p>
                        <strong>Time:</strong>{" "}
                        {event.start_time.slice(0, 5)} –{" "}
                        {event.end_time.slice(0, 5)} WAT
                      </p>

                      <p>
                        <strong>Location:</strong>{" "}
                        {event.location}
                      </p>

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

export default Events;