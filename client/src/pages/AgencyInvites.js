import React, { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col, Table, Spinner } from "react-bootstrap";

export default function AgencyInvites() {
  const [invites, setInvites] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newInvite, setNewInvite] = useState({
    agencyName: "",
    contactEmail: "",
    positionId: "",
    message: "",
  });

  // ✅ Fetch invites
  const fetchInvites = async () => {
    try {
      const res = await fetch("/api/agencies", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setInvites(data);
    } catch (err) {
      console.error("Error fetching invites:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch positions for dropdown
  const fetchPositions = async () => {
    try {
      const res = await fetch("/api/positions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setPositions(data);
    } catch (err) {
      console.error("Error fetching positions:", err);
    }
  };

  // ✅ Send new invite
  const sendInvite = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/agencies/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newInvite),
      });
      if (!res.ok) throw new Error("Failed to send invite");
      alert("✅ Invitation sent successfully!");
      setNewInvite({ agencyName: "", contactEmail: "", positionId: "", message: "" });
      fetchInvites();
    } catch (err) {
      alert("❌ Error sending invite");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInvites();
    fetchPositions();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <div className="container py-4">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>📨 Invite Agency / Recruiter</Card.Title>
          <Form onSubmit={sendInvite}>
            <Row className="g-3 align-items-end">
              <Col md={3}>
                <Form.Control
                  type="text"
                  placeholder="Agency Name"
                  value={newInvite.agencyName}
                  onChange={(e) => setNewInvite({ ...newInvite, agencyName: e.target.value })}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="email"
                  placeholder="Contact Email"
                  value={newInvite.contactEmail}
                  onChange={(e) => setNewInvite({ ...newInvite, contactEmail: e.target.value })}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Select
                  value={newInvite.positionId}
                  onChange={(e) => setNewInvite({ ...newInvite, positionId: e.target.value })}
                  required
                >
                  <option value="">Select Position</option>
                  {positions.map((pos) => (
                    <option key={pos._id} value={pos._id}>
                      {pos.title} ({pos.department})
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Button variant="success" type="submit" className="w-100">
                  ➕ Send Invite
                </Button>
              </Col>
              <Col md={12}>
                <Form.Control
                  as="textarea"
                  placeholder="Add message (optional)"
                  value={newInvite.message}
                  onChange={(e) => setNewInvite({ ...newInvite, message: e.target.value })}
                  rows={3}
                />
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>📋 Sent Invites</Card.Title>
          <Table striped bordered hover responsive className="mt-3">
            <thead>
              <tr>
                <th>Agency</th>
                <th>Email</th>
                <th>Position</th>
                <th>Status</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((invite) => (
                <tr key={invite._id}>
                  <td>{invite.agencyName}</td>
                  <td>{invite.contactEmail}</td>
                  <td>{invite.positionId?.title}</td>
                  <td>{invite.invitationStatus}</td>
                  <td>{invite.message || "-"}</td>
                  <td>{new Date(invite.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
