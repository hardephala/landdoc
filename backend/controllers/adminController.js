const AdminRole = require("../models/AdminRole");
const respond = require('../utils/respond');

const createAdminRoles = async (req, res) => {
  try {
    const { roles } = req.body;

    const newRoles = await Promise.all(roles.map(async (role) => {
      const newRole = new AdminRole({
        role
      });
      await newRole.save();
      return newRole;
    }));

    respond(res, 201, 'success', newRoles);
  } catch (error) {
    respond(res, 500, 'Failed to update admin role', error);
  }
};

// Controller for getting all admin roles
const getAllAdminRoles = async (req, res) => {
  try {
    const roles = await AdminRole.find();
    respond(res, 200, 'success', roles);
  } catch (error) {
    respond(res, 500, 'Failed to retrieve admin roles', error);
  }
};



const deleteAdminRoles = async (req, res) => {
  const { roles } = req.body;
  try {
    for(let role of roles) {
      const existing = await AdminRole.findById(role);
      if (!existing) {
        // return res.status(404).json({ error: 'Requirement not found' });
        continue;
      }
      await existing.deleteOne();
    }

    res.json({ message: 'Roles deleted succesfully.' });
  } catch (error) {
    console.error('Error deleting requirement:', error);
    res.status(500).json({ error: 'Failed to delete requirement' });
  }
};


module.exports = {
  createAdminRoles,
  getAllAdminRoles,
  deleteAdminRoles
};
