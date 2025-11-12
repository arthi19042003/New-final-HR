import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Form,
  Spinner,
  Modal,
  Table,
  Badge,
} from "react-bootstrap";

export default function ApplicationsDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/applications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id, action, payload = {}) => {
    try {
      const res = await fetch(`/api/applications/${id}/${action}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) fetchApplications();
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
    }
  };

  const fetchHistory = async (email) => {
    try {
      const res = await fetch(`/api/applications/history/${email}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleSchedule = (id) => {
    if (!interviewDate) return alert("Select a date first!");
    updateStatus(id, "schedule", { interviewDate });
    setInterviewDate("");
  };

  const sendMessage = async (id) => {
    if (!message.trim()) return;
    try {
      await fetch(`/api/applications/${id}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message, from: "hiringManager" }),
      });
      setMessage("");
      fetchApplications();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" /> Loading Applications...
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📋 Candidate Applications</h2>

      {applications.length === 0 ? (
        <p className="text-muted">No applications found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-light">
            <tr>
              <th>Candidate</th>
              <th>Position</th>
              <th>Status</th>
              <th>Interview</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>
                  <strong>{app.candidateName}</strong>
                  <div className="text-muted small">{app.email}</div>
                </td>
                <td>{app.position}</td>
                <td>
                  <Badge
                    bg={
                      app.status === "Hired"
                        ? "success"
                        : app.status === "Rejected"
                        ? "danger"
                        : app.status === "Interview Scheduled"
                        ? "info"
                        : "secondary"
                    }
                  >
                    {app.status}
                  </Badge>
                </td>
                <td>
                  {app.interviewDate
                    ? new Date(app.interviewDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => window.open(app.resumeUrl, "_blank")}
                    >
                      📄 Resume
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-success"
                      onClick={() => updateStatus(app._id, "review")}
                    >
                      Review
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-warning"
                      onClick={() => {
                        setSelectedApp(app);
                        setShowModal(true);
                      }}
                    >
                      Schedule
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => updateStatus(app._id, "reject")}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-info"
                      onClick={() => fetchHistory(app.email)}
                    >
                      History
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-dark"
                      onClick={() => sendMessage(app._id)}
                    >
                      💬 Message
                    </Button>
                    {app.status === "Hired" ? (
                      <Button
                        size="sm"
                        variant="success"
                        disabled
                      >
                        Onboarding: {app.onboardingStatus}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => updateStatus(app._id, "hire")}
                      >
                        Hire
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Interview Scheduler Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>📅 Schedule Interview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Date</Form.Label>
            <Form.Control
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleSchedule(selectedApp._id);
              setShowModal(false);
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Candidate History Modal */}
      <Modal
        show={history.length > 0}
        onHide={() => setHistory([])}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>📜 Candidate History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Position</th>
                <th>Status</th>
                <th>Interview Date</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i}>
                  <td>{h.position}</td>
                  <td>{h.status}</td>
                  <td>
                    {h.interviewDate
                      ? new Date(h.interviewDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{new Date(h.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  );
}
