const mongoose = require('mongoose');

const defaultRoles = ['user', 'admin','IntakeOfficer','SchemeOfficer','ExecutiveSecretary','Account','Legal','PermanentSecretary','Commissioner','Registry','Collection']

const adminRolesSchema = new mongoose.Schema({
  role: {
    type: String,
    default: 'admin'
  },
});

const AdminRole = mongoose.model('AdminRoles', adminRolesSchema);

module.exports = AdminRole;
