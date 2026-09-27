import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Team from "./pages/Team";
import Programs from "./pages/Programs";
import Projects from "./pages/Projects";
import Events from "./pages/Events";
import Volunteer from "./pages/Volunteer";
import Contact from "./pages/Contact";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminVolunteerApplications from "./pages/AdminVolunteerApplications";
import AdminContactMessages from "./pages/AdminContactMessages";
import AdminTeam from "./pages/AdminTeam";

function App() {
  return (
    <Routes>
      {/* Public website */}
      <Route
        path="/*"
        element={
          <>
            <Navbar />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/events" element={<Events />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>

            <Footer />
          </>
        }
      />

      {/* Admin area */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route
          path="/admin/volunteer-applications"
          element={<AdminVolunteerApplications />}
        />
        <Route
          path="/admin/contact-messages"
          element={<AdminContactMessages />}
        />
        <Route path="/admin/team" element={<AdminTeam />} />
      </Route>
    </Routes>
  );
}

export default App;