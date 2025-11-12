import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePurchaseOrder() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    candidateName: "",
    positionTitle: "",
    department: "",
    rate: "",
    startDate: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.candidateName || !formData.positionTitle || !formData.startDate) {
      alert("⚠️ Candidate Name, Position Title, and Start Date are required.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/purchase-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          candidateName: formData.candidateName,
          positionTitle: formData.positionTitle,
          department: formData.department,
          rate: parseFloat(formData.rate),
          startDate: formData.startDate,
        }),
      });

      if (!res.ok) throw new Error("Failed to create PO");

      setFormData({
        candidateName: "",
        positionTitle: "",
        department: "",
        rate: "",
        startDate: "",
      });

      alert("✅ Purchase Order created successfully!");
      navigate("/purchase-orders"); // redirect after success
    } catch (err) {
      console.error("Error creating PO:", err);
      alert("❌ Failed to create PO");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          🧾 Create Purchase Order
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Candidate Name *
          </label>
          <input
            type="text"
            name="candidateName"
            value={formData.candidateName}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position Title *
          </label>
          <input
            type="text"
            name="positionTitle"
            value={formData.positionTitle}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rate ($/hr)
          </label>
          <input
            type="number"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="e.g. 75"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={submitting}
            className={`w-full md:w-auto px-6 py-3 font-semibold rounded-lg shadow ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {submitting ? "Submitting..." : "Generate PO"}
          </button>
        </div>
      </form>
    </div>
  );
}
