import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";

function AdminTeam() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department_id: "",
    image_url: "",
    is_leadership: false,
    display_order: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("admin_token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [teamResponse, departmentResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/team-members/`, {
              headers,
            }),
            fetch(`${API_BASE_URL}/departments/`, {
              headers,
            }),
          ]);

        const teamData = await teamResponse.json();
        const departmentData = await departmentResponse.json();

        if (!teamResponse.ok) {
          throw new Error(
            typeof teamData.detail === "string"
              ? teamData.detail
              : "Unable to load team members."
          );
        }

        if (!departmentResponse.ok) {
          throw new Error(
            typeof departmentData.detail === "string"
              ? departmentData.detail
              : "Unable to load departments."
          );
        }

        setTeamMembers(teamData);
        setDepartments(departmentData);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function handleEdit(member) {
    setSelectedMember(member);

    setFormData({
      name: member.name || "",
      role: member.role || "",
      department_id: member.department_id || "",
      image_url: member.image_url || "",
      is_leadership: member.is_leadership || false,
      display_order: member.display_order ?? 0,
    });

    setError("");
    setSuccess("");
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : name === "department_id" ||
              name === "display_order"
            ? Number(value)
            : value,
    }));
  }

  function closeModal() {
    if (saving || changingStatus) {
      return;
    }

    setSelectedMember(null);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedMember) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("admin_token");

      const response = await fetch(
        `${API_BASE_URL}/team-members/${selectedMember.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            role: formData.role,
            department_id: formData.department_id,
            image_url: formData.image_url,
            is_leadership: formData.is_leadership,
            display_order: formData.display_order,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Unable to update team member."
        );
      }

      setTeamMembers((previous) =>
        previous.map((member) =>
          member.id === selectedMember.id
            ? data
            : member
        )
      );

      setSelectedMember(data);

      setSuccess(
        "Team member updated successfully."
      );
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange() {
    if (!selectedMember) {
      return;
    }

    setChangingStatus(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("admin_token");

      const action = selectedMember.is_active
        ? "deactivate"
        : "activate";

      const response = await fetch(
        `${API_BASE_URL}/team-members/${selectedMember.id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let data = {};

        try {
          data = await response.json();
        } catch {
          // No JSON response.
        }

        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : `Unable to ${action} team member.`
        );
      }

      const updatedStatus = !selectedMember.is_active;

      const updatedMember = {
        ...selectedMember,
        is_active: updatedStatus,
      };

      setTeamMembers((previous) =>
        previous.map((member) =>
          member.id === selectedMember.id
            ? {
                ...member,
                is_active: updatedStatus,
              }
            : member
        )
      );

      setSelectedMember(updatedMember);

      setSuccess(
        updatedStatus
          ? "Team member activated successfully."
          : "Team member deactivated successfully."
      );
    } catch (statusError) {
      setError(statusError.message);
    } finally {
      setChangingStatus(false);
    }
  }

  return (
    <main className="admin-management-page">
      <section className="admin-management-header">
        <div>
          <p className="section-label">
            Administration
          </p>

          <h1>Team Management</h1>

          <p>
            View and manage AbujaIdealist team members.
          </p>
        </div>
      </section>

      <section className="admin-management-section">
        <div className="admin-management-container">

          {loading && (
            <p className="dashboard-loading">
              Loading team members...
            </p>
          )}

          {error && !selectedMember && (
            <div className="form-message form-error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            teamMembers.length === 0 && (
              <div className="admin-empty-state">
                <h2>No team members found</h2>

                <p>
                  Team members added to AbujaIdealist
                  will appear here.
                </p>
              </div>
            )}

          {!loading &&
            teamMembers.length > 0 && (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Leadership</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {teamMembers.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <strong>
                            {member.name}
                          </strong>
                        </td>

                        <td>
                          {member.role}
                        </td>

                        <td>
                          {member.department_name}
                        </td>

                        <td>
                          {member.is_leadership
                            ? "Yes"
                            : "No"}
                        </td>

                        <td>
                          <span
                            className={
                              member.is_active
                                ? "admin-status"
                                : "admin-status admin-status-inactive"
                            }
                          >
                            {member.is_active
                              ? "ACTIVE"
                              : "INACTIVE"}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="admin-dashboard-button"
                            onClick={() =>
                              handleEdit(member)
                            }
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </section>

      {selectedMember && (
        <div
          className="admin-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="admin-team-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="admin-team-modal-header">
              <div>
                <p className="section-label">
                  Team Management
                </p>

                <h2>Edit Team Member</h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeModal}
                disabled={
                  saving || changingStatus
                }
                aria-label="Close"
              >
                ×
              </button>
            </div>

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

            <div className="admin-team-edit-layout">

              {/* LEFT PROFILE */}
              <aside className="admin-team-profile">

                <div className="admin-team-photo-wrapper">
                  {selectedMember.image_url ? (
                    <img
                      src={
                        selectedMember.image_url.startsWith(
                          "http"
                        )
                          ? selectedMember.image_url
                          : `${API_BASE_URL}${selectedMember.image_url}`
                      }
                      alt={selectedMember.name}
                      className="admin-team-photo"
                    />
                  ) : (
                    <div className="admin-team-photo-placeholder">
                      {selectedMember.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                <h3>
                  {selectedMember.name}
                </h3>

                <p className="admin-team-profile-role">
                  {selectedMember.role}
                </p>

                <p className="admin-team-profile-department">
                  {selectedMember.department_name}
                </p>

                <div className="admin-team-profile-status">

                  <span
                    className={
                      selectedMember.is_active
                        ? "admin-status"
                        : "admin-status admin-status-inactive"
                    }
                  >
                    {selectedMember.is_active
                      ? "ACTIVE"
                      : "INACTIVE"}
                  </span>

                  {selectedMember.is_leadership && (
                    <span className="admin-team-leadership-badge">
                      LEADERSHIP
                    </span>
                  )}

                </div>

                <div className="admin-team-profile-divider" />

                <div className="admin-team-profile-info">
                  <span>
                    Display Order
                  </span>

                  <strong>
                    {selectedMember.display_order}
                  </strong>
                </div>

              </aside>

              {/* RIGHT EDIT PANEL */}
              <div className="admin-team-edit-panel">

                <div className="admin-team-edit-heading">
                  <h3>
                    Edit Information
                  </h3>

                  <p>
                    Update this team member's
                    organizational information.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="admin-team-edit-form"
                >

                  <div className="admin-form-grid">

                    <div className="form-group">
                      <label htmlFor="team-name">
                        Full Name
                      </label>

                      <input
                        id="team-name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="team-role">
                        Role
                      </label>

                      <input
                        id="team-role"
                        name="role"
                        type="text"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="team-department">
                        Department
                      </label>

                      <select
                        id="team-department"
                        name="department_id"
                        value={
                          formData.department_id
                        }
                        onChange={handleChange}
                        required
                      >
                        <option value="">
                          Select department
                        </option>

                        {departments.map(
                          (department) => (
                            <option
                              key={department.id}
                              value={department.id}
                            >
                              {department.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="team-order">
                        Display Order
                      </label>

                      <input
                        id="team-order"
                        name="display_order"
                        type="number"
                        min="0"
                        value={
                          formData.display_order
                        }
                        onChange={handleChange}
                        required
                      />
                    </div>

                  </div>

                  <div className="admin-team-options">

                    <label className="admin-checkbox-label">
                      <input
                        type="checkbox"
                        name="is_leadership"
                        checked={
                          formData.is_leadership
                        }
                        onChange={handleChange}
                      />

                      <span>
                        Leadership Team Member
                      </span>
                    </label>

                  </div>

                  {/* STATUS CONTROL */}
                  <div className="admin-team-status-control">

                    <div>
                      <span className="admin-team-status-label">
                        Team Member Status
                      </span>

                      <p>
                        {selectedMember.is_active
                          ? "This team member is currently visible as active."
                          : "This team member is currently inactive."}
                      </p>
                    </div>

                    <button
                      type="button"
                      className={
                        selectedMember.is_active
                          ? "admin-status-action admin-status-action-danger"
                          : "admin-status-action admin-status-action-success"
                      }
                      onClick={
                        handleStatusChange
                      }
                      disabled={
                        saving ||
                        changingStatus
                      }
                    >
                      {changingStatus
                        ? "Updating..."
                        : selectedMember.is_active
                          ? "Deactivate Member"
                          : "Activate Member"}
                    </button>

                  </div>

                  <div className="admin-team-form-footer">

                    <button
                      type="button"
                      className="admin-modal-button"
                      onClick={closeModal}
                      disabled={
                        saving ||
                        changingStatus
                      }
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="admin-dashboard-button"
                      disabled={
                        saving ||
                        changingStatus
                      }
                    >
                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </button>

                  </div>

                </form>

              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminTeam;