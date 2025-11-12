import React, { useEffect, useState } from "react";
import { Card, Spinner, Button, Form, Alert } from "react-bootstrap";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // 🧠 Fetch profile info
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();

        // Pre-fill form
        const [firstName, lastName = ""] = (data.name || "").split(" ");
        setUser(data);
        setFormData({ firstName, lastName, email: data.email });
      } catch (err) {
        console.error("Error loading profile:", err);
        setAlert({ type: "danger", message: "Failed to load profile." });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 📝 Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Profile update failed");

      const updatedUser = await res.json();
      setUser(updatedUser.user || updatedUser);
      setShowEdit(false);
      setAlert({ type: "success", message: "✅ Profile updated successfully!" });
    } catch (err) {
      console.error("Error updating profile:", err);
      setAlert({ type: "danger", message: "❌ Failed to update profile." });
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" /> Loading profile...
      </div>
    );

  if (!user)
    return (
      <p className="text-center text-danger mt-5">
        Failed to load user profile.
      </p>
    );

  return (
    <div className="container mt-5">
      <Card className="shadow-lg p-4">
        <Card.Body>
          <Card.Title className="fs-4 mb-3">👤 Profile Information</Card.Title>

          {alert.message && (
            <Alert
              variant={alert.type}
              dismissible
              onClose={() => setAlert({ type: "", message: "" })}
            >
              {alert.message}
            </Alert>
          )}

          {!showEdit ? (
            <>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role || "Hiring Manager"}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>

              <div className="d-flex gap-2 mt-4">
                <Button variant="primary" onClick={() => setShowEdit(true)}>
                  ✏️ Edit Profile
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => window.history.back()}
                >
                  ← Back
                </Button>
              </div>
            </>
          ) : (
            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <div className="d-flex gap-2">
                <Button type="submit" variant="success">
                  💾 Save Changes
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowEdit(false)}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
