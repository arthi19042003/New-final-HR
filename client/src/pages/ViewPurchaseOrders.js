import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewPurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch POs from backend
  const fetchPOs = async () => {
    try {
      const res = await fetch("/api/purchase-orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch purchase orders");
      const result = await res.json();
      setPurchaseOrders(result);
    } catch (err) {
      console.error("Error fetching POs:", err);
      alert("❌ Failed to load purchase orders");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update PO status
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/purchase-orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchPOs();
    } catch (err) {
      console.error("Error updating PO status:", err);
      alert("❌ Failed to update status");
    }
  };

  // ✅ Download PO (Placeholder)
  const downloadPO = (po) => {
    alert(`🧾 Download feature for ${po.poNumber} coming soon!`);
  };

  useEffect(() => {
    fetchPOs();
  }, []);

  if (loading)
    return <p className="text-center mt-8 text-lg">Loading purchase orders...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          🧾 View Purchase Orders
        </h1>
        <button
          onClick={() => navigate("/create-po")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          ➕ Create New PO
        </button>
      </div>

      {purchaseOrders.length === 0 ? (
        <p className="text-gray-600">No purchase orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">PO Number</th>
                <th className="border p-2">Candidate</th>
                <th className="border p-2">Position</th>
                <th className="border p-2">Department</th>
                <th className="border p-2">Rate ($/hr)</th>
                <th className="border p-2">Start Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((po) => (
                <tr key={po._id}>
                  <td className="border p-2">{po.poNumber}</td>
                  <td className="border p-2">{po.candidateName}</td>
                  <td className="border p-2">{po.positionTitle}</td>
                  <td className="border p-2">{po.department}</td>
                  <td className="border p-2">{po.rate}</td>
                  <td className="border p-2">
                    {po.startDate ? new Date(po.startDate).toLocaleDateString() : "-"}
                  </td>
                  <td
                    className={`border p-2 font-medium ${
                      po.status === "Approved"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {po.status}
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    {po.status !== "Approved" && (
                      <button
                        onClick={() => updateStatus(po._id, "Approved")}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        ✅ Approve
                      </button>
                    )}
                    <button
                      onClick={() => downloadPO(po)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      ⬇️ Download
                    </button>
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
