const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["hiring_manager", "recruiter", "admin"],
      default: "hiring_manager",
    },
    firstName: {
      type: String,
      trim: true,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false, // prevents passwordHash from showing in normal queries
    },
    company: {
      name: { type: String, trim: true },
      address: { type: String, trim: true },
    },
    profileImage: {
      type: String, // optional: for user avatar/profile photo
      default: "",
    },
  },
  { timestamps: true }
);

// 🔒 Hash password automatically before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// ✅ Compare passwords for login
UserSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.passwordHash);
};

// 🧠 Return a safe JSON version (hide sensitive fields)
UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("User", UserSchema);
