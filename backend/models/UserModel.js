const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      // enum: ['user', 'admin','IntakeOfficer','SchemeOfficer','ExecutiveSecretary','Account','Legal','PermanentSecretary','Commissioner','Registry','Collection'],
      default: "user",
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
