const User = require("../models/UserModel.js");
const Application = require("../models/ApplicationModel.js");

const checkUser = async (req, res) => {
  try {
    const { address } = req.body;

    const existingUser = await User.findOne({
      address: new RegExp(address, "i"),
    });

    if (existingUser) {
      const user = await User.findById(existingUser._id).populate({
        path: "applications",
        populate: {
          path: "documents",
        },
      });
      res.json({
        isNewUser: false,
        address: user.address,
        role: user.role,
        applications: user.applications,
      });
    } else {
      const newUser = new User({ address });
      await newUser.save();

      res.json({
        isNewUser: true,
        address: newUser.address,
        role: newUser.role,
        applications: [],
      });
    }
  } catch (error) {
    res.status(500).json({ error: "User check failed" });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { adminAddress, adminRole } = req.body;
    let user = await User.findOne({ address: new RegExp(adminAddress, "i") });

    if (!user) {
      user = await User.create({
        address: adminAddress,
        role: adminRole
      });
      await user.save();
    } else {
      user.role = adminRole;
      await user.save();
    }

    res.json({
      status: "success",
      message: "User Role is successfully updated",
      admin: user,
    });
  } catch (error) {
    res.status(500).json({ error: "Admin role assignment failed" });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "User creation failed" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findOne({
      address: new RegExp(req.params.address, "i"),
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "User retrieval failed" });
  }
};

const getUserApplications = async (req, res) => {
  try {
    const user = await User.findOne({
      address: new RegExp(req.params.address, "i"),
    }).populate("applications");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.applications);
  } catch (error) {
    res.status(500).json({ error: "Applications retrieval failed" });
  }
};

const getAdmins = async (req, res) => {
  try {
    //const admins = await User.find({ role: "IntakeOfficer,SchemeOfficer,ExecutiveSecretary,Account,Legal,PermanentSecretary,Commissioner,Registry,Collection" })
    const admins = await User.find({ role: "admin" });
    if (!admins) {
      return res.status(404).json({ error: "Admins not found" });
    }
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: "Failed to get admins" });
  }
};

const demoteAdminToUser = async (req, res) => {
  const { adminId } = req.params;

  try {
    const existingAdmin = await User.findById(adminId);
    if (!existingAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (existingAdmin.role === "user") {
      return res.status(403).json({ error: "User is not an admin" });
    }

    existingAdmin.role = "user";
    await existingAdmin.save();

    res.json({ message: "Admin demoted to user successfully" });
  } catch (error) {
    console.error("Error demoting admin to user:", error);
    res.status(500).json({ error: "Failed to demote admin to user" });
  }
};

module.exports = {
  checkUser,
  createAdmin,
  createUser,
  getUser,
  getAdmins,
  getUserApplications,
  demoteAdminToUser,
};
