import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
  Badge,
} from "react-bootstrap";

export default function HiringManagerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const [newPosition, setNewPosition] = useState({
    title: "",
    department: "",
    location: "",
    requiredSkills: "",
    openings: 1,
    status: "Open",
  });

  // ✅ Fetch dashboard summary
  const fetchDashboard = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/hiring-dashboard/summary", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      const result = await res.json();
      setData(Array.isArray(result) ? result[0] : result);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ Add a new position
  const addPosition = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newPosition,
        requiredSkills: newPosition.requiredSkills
          ? newPosition.requiredSkills.split(",").map((s) => s.trim())
          : [],
      };

      const res = await fetch("/api/positions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add position");

      setNewPosition({
        title: "",
        department: "",
        location: "",
        requiredSkills: "",
        openings: 1,
        status: "Open",
      });

      alert("✅ Position added successfully!");
      fetchDashboard();
    } catch (err) {
      console.error("Error adding position:", err);
      alert("❌ Failed to add position");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" /> Loading dashboard...
      </div>
    );

  if (!data)
    return (
      <p className="text-center text-danger mt-5">
        No dashboard data available.
      </p>
    );

  const chartData = [
    { name: "Submissions", value: data.totalSubmissions || 0 },
    { name: "Interviews", value: data.interviewsScheduled || 0 },
    { name: "Offers", value: data.offersMade || 0 },
    { name: "Hired", value: data.hired || 0 },
  ];

  return (
    <Container className="py-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🏢 Hiring Manager Dashboard</h2>
        <Badge bg="info" className="p-2 fs-6">
          Welcome Back 👋
        </Badge>
      </div>

      {/* ROW 1: Chart + Metrics */}
      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title>📊 Hiring Progress</Card.Title>
                <Button
                  onClick={fetchDashboard}
                  disabled={refreshing}
                  variant={refreshing ? "secondary" : "primary"}
                >
                  {refreshing ? "Refreshing..." : "🔄 Refresh"}
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0d6efd" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4 shadow-sm text-center">
            <Card.Body>
              <Card.Title>📈 Key Metrics</Card.Title>
              <ul className="list-unstyled mt-3">
                <li>📄 Total Submissions: {data.totalSubmissions}</li>
                <li>📅 Interviews Scheduled: {data.interviewsScheduled}</li>
                <li>💼 Offers Made: {data.offersMade}</li>
                <li>🎯 Hired: {data.hired}</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ROW 2: Manage Positions */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title>💼 Manage Positions</Card.Title>
            <Button variant="info" onClick={() => navigate("/positions")}>
              View All Positions →
            </Button>
          </div>
          <Form onSubmit={addPosition}>
            <Row className="g-3">
              <Col md={2}>
                <Form.Control
                  type="text"
                  placeholder="Title"
                  required
                  value={newPosition.title}
                  onChange={(e) =>
                    setNewPosition({ ...newPosition, title: e.target.value })
                  }
                />
              </Col>
              <Col md={2}>
                <Form.Control
                  type="text"
                  placeholder="Department"
                  value={newPosition.department}
                  onChange={(e) =>
                    setNewPosition({
                      ...newPosition,
                      department: e.target.value,
                    })
                  }
                />
              </Col>
              <Col md={2}>
                <Form.Control
                  type="text"
                  placeholder="Location"
                  value={newPosition.location}
                  onChange={(e) =>
                    setNewPosition({
                      ...newPosition,
                      location: e.target.value,
                    })
                  }
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="text"
                  placeholder="Required Skills (comma separated)"
                  value={newPosition.requiredSkills}
                  onChange={(e) =>
                    setNewPosition({
                      ...newPosition,
                      requiredSkills: e.target.value,
                    })
                  }
                />
              </Col>
              <Col md={1}>
                <Form.Control
                  type="number"
                  min="1"
                  placeholder="Openings"
                  value={newPosition.openings}
                  onChange={(e) =>
                    setNewPosition({
                      ...newPosition,
                      openings: parseInt(e.target.value),
                    })
                  }
                />
              </Col>
              <Col md={2}>
                <Button type="submit" variant="success" className="w-100">
                  ➕ Add
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* ROW 3: Applications, PO, Inbox, Onboarding, Agencies */}
      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>📬 Candidate Applications</Card.Title>
              <Card.Text>
                Review applications, communicate with candidates, and schedule
                interviews.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => navigate("/applications-dashboard")}
              >
                View Applications →
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>🧾 Purchase Orders (PO)</Card.Title>
              <Card.Text>
                Create and track purchase orders for hired candidates.
              </Card.Text>
              <div className="d-flex gap-2">
                <Button variant="success" onClick={() => navigate("/create-po")}>
                  ➕ Create PO
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => navigate("/purchase-orders")}
                >
                  📄 View All POs
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>💌 Inbox</Card.Title>
              <Card.Text>
                View and reply to messages from candidates in real time.
              </Card.Text>
              <Button
                variant="warning"
                className="text-white"
                onClick={() => navigate("/inbox")}
              >
                💬 Go to Inbox →
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>🚀 Onboarding Tracker</Card.Title>
              <Card.Text>
                Track onboarding progress of hired candidates.
              </Card.Text>
              <Button
                style={{ backgroundColor: "#6f42c1", color: "white" }}
                onClick={() => navigate("/onboarding")}
              >
                View Onboarding →
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>🤝 Agency / Recruiter Invites</Card.Title>
              <Card.Text>
                Invite agencies or recruiters to submit candidates for open
                positions and track their participation.
              </Card.Text>
              <Button
                variant="dark"
                onClick={() => navigate("/agency-invites")}
              >
                ✉️ Manage Invites →
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
