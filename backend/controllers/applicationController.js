const Application = require("../models/ApplicationModel.js");
const Requirement = require("../models/RequirementModel.js");
const RequiredStep = require("../models/ReqStepModel.js");
const Document = require("../models/DocumentModel.js");
const User = require("../models/UserModel.js");
const TransactionLog = require("../models/LogModel.js");
const respond = require("../utils/respond");
const { allStatusTypes } = require("../constants/index.js")

const createApplication = async (req, res) => {
  try {
    const {
      address,
      applicationName,
      documentsURL,
      ownerFullName,
      ownerAddress,
      phone,
      email,
      //  prevOwnerType, developed, occupied, residentType, sizeSqm, location
    } = req.body;
    const user = await User.findOne({ address: new RegExp(address, "i") });
    const requirement = await Requirement.findOne({ applicationName });

    const createdDocuments = [];

    for (const [documentName, url] of Object.entries(documentsURL)) {
      const document = new Document({
        user: user._id,
        document: documentName,
        url: url,
      });

      await document.save();
      createdDocuments.push(document);
    }

    // const createdSteps = [];

    // for (const [stepstatus, steporderno] of Object.entries(StatusSteps)) {
    //   const step = new RequiredStep({
    //     requirement: requirement.requiredSteps,
    //     stepstatus: stepstatus,
    //     steporderno: steporderno,
    //     userprofile: user.role
    //   });

    //   await step.save();
    //   createdSteps.push(step);
    // }

    const application = new Application({
      userId: user._id,
      appType: requirement._id,
      ownerFullName,
      ownerAddress,
      phone,
      email,
      // prevOwnerType,developed,occupied,residentType,sizeSqm,location,
      documents: createdDocuments.map((doc) => doc._id),
      // status
    });

    console.log(application);

    const transactionLog = new TransactionLog({
      appId: application._id,
      data: "Application created",
    });

    await transactionLog.save();

    await application.save();

    user.applications.push(application);
    await user.save();

    res.json({ message: "success", application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Application creation failed" });
  }
};

const updateApplication = async (req, res) => {
  try {
    const {
      address,
      documentsURL,
      ownerFullName,
      ownerAddress,
      email,
      phone,
      status,
      // prevOwnerType, developed, occupied, residentType, sizeSqm, location
    } = req.body;
    const user = await User.findOne({ address: new RegExp(address, "i") });
    const { appId } = req.params;
    console.log(documentsURL);

    const application = await Application.findById(appId);

    const createdDocuments = [];

    await Promise.all(
      documentsURL.map(async (doc) => {
        const existingDocumentIndex = application.documents.findIndex(
          (existingDoc) => existingDoc.document === doc.document
        );

        if (existingDocumentIndex !== -1) {
          application.documents[existingDocumentIndex].url = doc.url;
        } else {
          const document = new Document({
            user: user._id,
            document: doc.document,
            url: doc.url,
          });

          await document.save();
          createdDocuments.push(document._id);
          console.log(createdDocuments);
        }
      })
    );

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    application.ownerFullName = ownerFullName || application.ownerFullName;
    application.ownerAddress = ownerAddress || application.ownerAddress;
    application.email = email || application.email;
    application.phone = phone || application.phone;
    application.status = status || application.status;
    // application.prevOwnerType = prevOwnerType || application.prevOwnerType;
    // application.developed = developed || application.developed;
    // application.occupied = occupied || application.occupied;
    // application.residentType = residentType || application.residentType;
    // application.sizeSqm = sizeSqm || application.sizeSqm;
    // application.location = location || application.location;
    // application.documents = createdDocuments;
    // application.status = "Pending";
    const transactionLog = new TransactionLog({
      appId: application._id,
      data: "Application updated by user",
    });

    await transactionLog.save();

    console.log(application);
    await application.save();

    // res.json({ status: "success", message: "Saved successfully" });
    respond(res, 200, "Saved successfully", application);
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: "Could not be saved" });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const { address } = req.body;
    const user = await User.findOne({ address: new RegExp(address, "i") });
    console.log(address, user._id);
    const applications = await Application.find({ userId: user._id })
      .populate("userId")
      .populate("appType")
      .populate("documents");
    // console.log(applications);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve applications" });
  }
};

const getApplication = async (req, res) => {
  try {
    const { address } = req.body;
    const { appId } = req.params;
    const user = await User.findOne({ address: new RegExp(address, "i") });

    let application = await Application.findById(appId)
      .populate({
        path: "appType",
        populate: {
          path: "requiredDocuments",
        },
      })
      .populate("userId")
      .populate("documents")
      .exec();

    const logs = await TransactionLog.find({ appId })
      .populate("adminId")
      .sort({ date: 1 });

    if (
      user.role != "admin" &&
      application.userId._id.toString() !== user._id.toString()
    ) {
      application = null;
    }
    console.log(application.createDate);

    if (!application) {
      return res
        .status(404)
        .json({ error: "Application not found or user is not the owner" });
    }

    res.json({ application, logs });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the application" });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          applications: { $push: "$$ROOT" },
        },
      },
    ]);

    const groupedApplications = {};
    const _allStatusTypes = allStatusTypes

    _allStatusTypes.forEach((status) => {
      groupedApplications[status] = {
        count: 0,
        applications: [],
      };
    });

    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(25)
      .populate("documents")
      .populate({
        path: "userId",
      })
      .populate({
        path: "appType",
        populate: {
          path: "requiredDocuments",
          model: "RequiredDocument",
        },
      });

    groupedApplications.recent = {
      applications: recentApplications,
    };

    const populatedApplications = await Promise.all(
      applicationsByStatus.map(async (group) => {
        const status = group._id || "None";
        const applications = await Application.populate(group.applications, [
          { path: "documents" },
          {
            path: "userId",
          },
          {
            path: "appType",
            populate: {
              path: "requiredDocuments",
              model: "RequiredDocument",
            },
          },
        ]);

        return {
          status,
          applications,
        };
      })
    );

    populatedApplications.forEach((group) => {
      groupedApplications[group.status] = {
        count: group.applications.length,
        applications: group.applications,
      };
    });

    res.json(groupedApplications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve applications" });
  }
};

const getApplicationStatistics = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({
      status: "Pending",
    });
    const totalUsers = await User.countDocuments();

    const recentApplications = await Application.find()
      .sort({ createDate: -1 })
      .limit(20)
      .populate("appType");
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(20);

    res.json({
      totalApplications,
      pendingApplications,
      totalUsers,
      recentApplications,
      recentUsers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve application statistics" });
  }
};

const approveApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    application.status = "Approved";
    await application.save();

    res.json({ message: "Application approved" });
  } catch (error) {
    res.status(500).json({ error: "Approval failed" });
  }
};

const rejectApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    application.status = "Rejected";
    await application.save();

    res.json({ message: "Application rejected" });
  } catch (error) {
    res.status(500).json({ error: "Rejection failed" });
  }
};

const uploadDocumentToApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const { documentName } = req.body;
    const application = await Application.findById(appId);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const document = new Document({
      user: application.userId,
      document: documentName,
    });
    await document.save();
    console.log(document);

    application.documents.push(document);
    application.status = "Pending";
    await application.save();

    res.json({ status: "success", message: "Document added to application" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: "Document could not be added" });
  }
};

const getDocumentsForApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const application = await Application.findById(appId).populate("documents");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(application.documents);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve documents" });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, comments, address, completedDocURL } = req.body;
    const { appId } = req.params;

    const updates = {
      status,
      comments,
    };

    if (status === "completed") {
      const { hash, url } = completedDocURL;

      updates.completedHash = hash;
      updates.completedDocURL = url;
    }

    const application = await Application.findByIdAndUpdate(appId, updates);

    const user = await User.findOne({ address: new RegExp(address, "i") });

    const transactionLog = new TransactionLog({
      appId: application._id,
      data: `Application status updated - ${comments}`,
      adminId: user._id,
    });

    await transactionLog.save();

    respond(res, 200, "Application status updated successfully", application);
  } catch (error) {
    res.status(500).json({ error: "Failed to update application status" });
  }
};

const completeApplication = async (req, res) => {
  try {
    const { address, completedDocURL } = req.body;
    const { hash, url } = completedDocURL;
    const { appId } = req.params;
    const application = await Application.findByIdAndUpdate(appId, {
      completedHash: hash,
      completedDocURL: url,
    });

    const user = await User.findOne({ address: new RegExp(address, "i") });

    const transactionLog = new TransactionLog({
      appId: application._id,
      data: `Application status updated - ${comments}`,
      adminId: user._id,
    });

    await transactionLog.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update application status" });
  }
};

module.exports = {
  createApplication,
  updateApplication,
  completeApplication,
  getApplication,
  getMyApplications,
  getAllApplications,
  getApplicationStatistics,
  approveApplication,
  rejectApplication,
  uploadDocumentToApplication,
  getDocumentsForApplication,
  updateApplicationStatus,
};
