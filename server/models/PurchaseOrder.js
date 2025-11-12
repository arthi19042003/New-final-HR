// server/models/PurchaseOrder.js
const mongoose = require("mongoose");
const { connectHiringManagerDB } = require("../config/db");

let PurchaseOrderModel;

(async () => {
  const conn = await connectHiringManagerDB();
  const PurchaseOrderSchema = new mongoose.Schema({
    candidateName: { type: String, required: true },
    positionTitle: { type: String, required: true },
    department: { type: String },
    rate: { type: Number, required: true },
    startDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  });
  PurchaseOrderModel =
    conn.models.PurchaseOrder ||
    conn.model("PurchaseOrder", PurchaseOrderSchema);
})();

module.exports = async () => PurchaseOrderModel;
