import React, { useEffect, useState } from "react";
import { Card, Button, Form, Spinner, ListGroup } from "react-bootstrap";

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/applications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setMessages(data.filter(app => app.communication?.length > 0));
    } catch (err) {
      console.error("Error fetching inbox:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (id) => {
    if (!newMessage.trim()) return;
    try {
      const res = await fetch(`/api/applications/${id}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: newMessage,
          from: "hiringManager",
        }),
      });
      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" /> Loading Inbox...
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">💬 Inbox</h2>
      <div className="row">
        <div className="col-md-4">
          <Card className="shadow-sm">
            <Card.Header>Candidate Threads</Card.Header>
            <ListGroup variant="flush">
              {messages.map((app) => (
                <ListGroup.Item
                  key={app._id}
                  action
                  onClick={() => setSelectedApp(app)}
                >
                  <strong>{app.candidateName}</strong> – {app.position}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </div>

        <div className="col-md-8">
          {selectedApp ? (
            <Card className="shadow-sm">
              <Card.Header>
                Conversation with {selectedApp.candidateName}
              </Card.Header>
              <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
                {selectedApp.communication.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2 mb-2 rounded ${
                      msg.from === "hiringManager"
                        ? "bg-primary text-white text-end"
                        : "bg-light"
                    }`}
                  >
                    <div>{msg.message}</div>
                    <small className="text-muted d-block">
                      {new Date(msg.timestamp).toLocaleString()}
                    </small>
                  </div>
                ))}
              </Card.Body>
              <Card.Footer>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(selectedApp._id);
                  }}
                >
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" variant="primary">
                      Send
                    </Button>
                  </div>
                </Form>
              </Card.Footer>
            </Card>
          ) : (
            <p className="text-muted text-center mt-5">
              Select a conversation to view messages.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
