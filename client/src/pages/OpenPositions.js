import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function OpenPositions() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", location: "", openings: 1 });

  // ✅ Fetch all positions for logged-in manager
  const fetchPositions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/positions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to load positions");
      const data = await res.json();
      setPositions(data);
    } catch (err) {
      console.error("Error fetching positions:", err);
      toast.error("Failed to load positions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  // ✅ Handle edit button click
  const handleEdit = (position) => {
    setEditingId(position._id);
    setEditData({
      title: position.title,
      location: position.location,
      openings: position.openings,
    });
  };

  // ✅ Handle save edit
  const handleSave = async (id) => {
    try {
      const res = await fetch(`/api/positions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error("Failed to update position");

      toast.success("Position updated successfully!");
      setEditingId(null);
      fetchPositions();
    } catch (err) {
      console.error(err);
      toast.error("Error updating position");
    }
  };

  // ✅ Close position
  const handleClose = async (id) => {
    try {
      const res = await fetch(`/api/positions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "Closed" }),
      });
      if (!res.ok) throw new Error("Failed to close position");
      toast.success("Position closed!");
      fetchPositions();
    } catch (err) {
      console.error(err);
      toast.error("Error closing position");
    }
  };

  // ✅ Delete position
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this position?")) return;
    try {
      const res = await fetch(`/api/positions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete position");
      toast.success("Position deleted");
      fetchPositions();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting position");
    }
  };

  if (loading) return <p className="text-center mt-8 text-lg">Loading positions...</p>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Open Positions</h2>

      {positions.length === 0 ? (
        <p className="text-center text-gray-600">No open positions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-xl shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">required skills</th>
                <th className="p-3 text-left">Openings</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((pos) => (
                <tr key={pos._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {editingId === pos._id ? (
                      <input
                        type="text"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      pos.title
                    )}
                  </td>
                  <td className="p-3">
                    {editingId === pos._id ? (
                      <input
                        type="text"
                        value={editData.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      pos.location
                    )}
                    </td>
                    <td className="p-3">
                    {editingId === pos._id ? (
                      <input
                        type="text"
                        value={editData.requiredSkills}
                        onChange={(e) => setEditData({ ...editData, requiredSkills: e.target.value })}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      pos.requiredSkills
                    )}
                  </td>
                  <td className="p-3">
                    {editingId === pos._id ? (
                      <input
                        type="number"
                        value={editData.openings}
                        onChange={(e) => setEditData({ ...editData, openings: e.target.value })}
                        className="border rounded p-1 w-20"
                      />
                    ) : (
                      pos.openings
                    )}
                  </td>
                  <td className="p-3">{pos.status}</td>
                  <td className="p-3 flex gap-2">
                    {editingId === pos._id ? (
                      <>
                        <button
                          onClick={() => handleSave(pos._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(pos)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        {pos.status === "Open" && (
                          <button
                            onClick={() => handleClose(pos._id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                          >
                            Close
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(pos._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
