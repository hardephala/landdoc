const express = require("express");
const router = express.Router();
const {
  checkUser,
  createAdmin,
  createUser,
  getUser,
  getUserApplications,
  getAdmins,
  demoteAdminToUser,
} = require("../controllers/userController.js");
const {
  createApplication,
  updateApplication,
  completeApplication,
  getApplication,
  getMyApplications,
  getApplicationStatistics,
  getAllApplications,
  updateApplicationStatus,
  approveApplication,
  rejectApplication,
  uploadDocumentToApplication,
  getDocumentsForApplication,
} = require("../controllers/applicationController.js");
const {
  createDocument,
  getDocument,
  updateDocumentStatus,
} = require("../controllers/documentController.js");
const { uploadFiles, handleFileUploads } = require("../controllers/upload.js");
const checkUserRole = require("../middlewares/middleware.js");
const {
  createRequirement,
  getRequirements,
  deleteRequirement,
} = require("../controllers/requirementController.js");
const {
  createAdminRoles,
  getAllAdminRoles,
  deleteAdminRoles,
} = require("../controllers/adminController.js");
const {
  validateRequirement,
} = require("../utils/validators/requirement.validator.js");

const {
  validateAdminRoles,
} = require("../utils/validators/admin.validator.js");

// User Routes
router.post("/check-user", checkUser);
router.post("/users", checkUserRole, createUser);
router.get("/users/admins", getAdmins);
router.post("/users/make-admin", checkUserRole, createAdmin);
router.delete("/users/admins/:adminId", demoteAdminToUser);
router.get("/users/:address", getUser);
router.get("/users/:address/applications", getUserApplications);

//Requirement Routes .// add checkUserRole letter
router.post("/requirements", validateRequirement, createRequirement);
router.get("/requirements", getRequirements);
router.delete("/requirements/:requirementId", deleteRequirement);

// Application Routes
router.post("/upload", uploadFiles, handleFileUploads);

router.post("/applications", createApplication);
router.post("/applications/stats", checkUserRole, getApplicationStatistics);
router.post("/applications/admin", checkUserRole, getAllApplications);
router.post("/applications/:appId", getApplication);
router.put(
  "/applications/completed/:appId",
  checkUserRole,
  completeApplication
);
router.put("/applications/:appId", updateApplication);
router.put(
  "/applications/status/:appId",
  checkUserRole,
  updateApplicationStatus
);
router.post("/applications/:appId/documents", uploadDocumentToApplication);
router.get("/applications/:appId/documents", getDocumentsForApplication);
router.post("/my-applications", getMyApplications);
router.put("/approveApplication/:appId", checkUserRole, approveApplication);
router.put("/rejectApplication/:appId", checkUserRole, rejectApplication);

// Document Routes
router.post("/applications/:appId/documents", createDocument);
router.get("/applications/:appId/documents/:docId", getDocument);
router.put("/documents/:documentId/status", updateDocumentStatus);

// admin role
router.post("/admin/roles", validateAdminRoles, createAdminRoles);
router.delete("/admin/roles", validateAdminRoles, deleteAdminRoles);
router.get("/admin/roles", getAllAdminRoles);

module.exports = router;
