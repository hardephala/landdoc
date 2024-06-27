import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal";
import { getAllRoles } from "../services/apis";

import "../assets/admin/vendor/bootstrap/css/bootstrap.min.css";
import "../assets/admin/css/style.css";
import toast from "react-hot-toast";

const defaultStep = {
  from: "",
  to: "",
  role: "",
};

const Settings = ({ address }) => {
  const [applicationName, setApplicationName] = useState("");
  const [document, setDocument] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [fee, setFee] = useState();
  const [documents, setDocuments] = useState({});
  const [step, setStep] = useState(defaultStep);

  const [steps, setSteps] = useState([]);

  const [showSModal, setShowSModal] = useState(false);
  const [showEModal, setShowEModal] = useState(false);
  const [adminAddress, setAdminAddress] = useState("");
  const [adminRole, setAdminRole] = useState("");

  const [newAdminRole, setNewAdminRole] = useState("");

  const [requirements, setRequirements] = useState();
  const [admins, setAdmins] = useState();
  const [reason, setReason] = useState("Could not get application details");

  const [roles, setRoles] = useState([]);
  const defaultRoles = roles.filter((role) => role.role !== "admin");

  console.log(defaultRoles);

  useEffect(() => {
    const getApplicationReqs = async () => {
      try {
        const results = await axios.get(
          `http://localhost:4000/api/requirements`
        );
        setRequirements(results.data);
        console.log(results.data);
      } catch (err) {
        console.log(err);
      }
    };
    const getAdmins = async () => {
      try {
        const results = await axios.get(
          `http://localhost:4000/api/users/admins`
        );
        setAdmins(results.data);
        console.log(results.data);
      } catch (err) {
        console.log(err);
      }
    };

    const getRoles = async () => {
      console.log("fetched ");
      const roles = await getAllRoles(address);
      console.log(roles);
      setRoles(roles);
    };
    getApplicationReqs();
    getAdmins();
    getRoles();
  }, []);

  const requirementSaveDisabled =
    !applicationName &&
    !(Object.keys(documents).length > 0) &&
    !steps.length > 0;

  const handleCreate = async () => {
    if (
      applicationName &&
      Object.keys(documents).length > 0 &&
      steps.length > 0
    ) {
      setLoading(true);
      try {
        const results = await axios.post(
          `http://localhost:4000/api/requirements`,
          {
            address,
            requiredDocuments: documents,
            applicationName,
            requiredSteps: steps,
          }
        );

        console.log(results.data);
        toast.success(results.data.message);
        setReason(results.data.message);
        setShowSModal(true);
        setRequirements((prevRequirements) => [
          ...prevRequirements,
          results.data.data,
        ]);
        // reset form
        setApplicationName("");
        setFee();
        setDocuments([]);
        setSteps([]);
        setSteps(defaultStep);
      } catch (err) {
        setShowEModal(true);

        console.log(err);
      }
      setLoading(false);
    }
  };

  const handleSaveDoc = async () => {
    if (document && fee) {
      setDocuments({ ...documents, [document]: fee });
      setDocument("");
      setFee("");
    }
  };

  const handleSaveSteps = async () => {
    if (step?.role && step?.to && step?.from) {
      setSteps((steps) => [...steps, step]);
      setDocument("");
      setFee("");
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();

    if (adminAddress) {
      setAdminLoading(true);
      try {
        const results = await axios.post(
          `http://localhost:4000/api/users/make-admin`,
          { address, adminAddress, adminRole },
          {}
        );

        setReason(results.data.message);
        setAdminAddress("");
        setAdminRole("");
        if (results.data.status == "success") {
          setShowSModal(true);
          setAdmins((prevAdmins) => [...prevAdmins, results.adminRole]);
        } else {
          setShowEModal(true);
        }

        // toast success message.
        toast.success(results.data.message);
      } catch (err) {
        console.log(err);
      }
      setAdminLoading(false);
    }
  };

  const handleAddNewAdminRole = async (e) => {
    e.preventDefault();

    if (newAdminRole) {
      setAdminLoading(true);

      try {
        const results = await axios.post(
          `http://localhost:4000/api/admin/roles`,
          { roles: [newAdminRole] }
        );

        setReason(results.data.message);
        setNewAdminRole("");
        // toast success message.
        toast.success(results.data.message);
      } catch (err) {
        console.log(err);
      }
      setAdminLoading(false);
    }
  };

  const handleRequirementDelete = async (requirementId) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/requirements/${requirementId}`
      );
      setRequirements((prevRequirements) =>
        prevRequirements.filter((req) => req._id !== requirementId)
      );
    } catch (error) {
      console.error("Error deleting requirement:", error);
    }
  };

  const handleAdminDelete = async (adminId) => {
    try {
      await axios.delete(`http://localhost:4000/api/users/admins/${adminId}`);
      setAdmins((prevAdmins) =>
        prevAdmins.filter((admin) => admin._id !== adminId)
      );
    } catch (error) {
      console.error("Error removing admin:", error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div style={{ height: "40px" }}></div>

        <div className="col-md-6">
          <div className="col-lg-offset-1 col-lg-12">
            <div className="cardHeader">
              <h2>Add requirements for an application type</h2>
            </div>

            <div className="form-container">
              <div className="form-group">
                <label>Application Name</label>
                <input
                  type="text"
                  placeholder="Application Name"
                  value={applicationName}
                  onChange={(e) => setApplicationName(e.target.value)}
                  className="form-control input-lg"
                  required
                />
              </div>
              <div className="form-group">
                <div className="form-group">
                  <label>Add Document</label>
                  <input
                    type="text"
                    placeholder="Document name"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    className="form-control input-md"
                    required
                    style={{ marginBottom: "2px" }}
                  />
                  <input
                    type="number"
                    placeholder="Fee"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="form-control input-md"
                    style={{ marginBottom: "5px" }}
                    required
                  />
                  <button
                    onClick={handleSaveDoc}
                    className="btn btn-secondary input-lg form-control"
                  >
                    Add Document
                  </button>
                </div>

                <div className="form-group">
                  <label>
                    <b>Add Status</b>
                  </label>
                  <br />
                  <select
                    className="input-lg form-control"
                    style={{
                      cursor: "pointer",
                    }}
                    defaultValue=""
                    value={step.role}
                    onChange={(e) =>
                      setStep((step) => ({ ...step, role: e.target.value }))
                    }
                  >
                    <option value="">Select Role</option>
                    {defaultRoles.map((role) => (
                      <option key={role._id}>{role.role}</option>
                    ))}
                  </select>
                  <label>Status From</label>
                  <input
                    type="text"
                    placeholder="Pending"
                    value={step.from}
                    onChange={(e) =>
                      setStep((step) => ({ ...step, from: e.target.value }))
                    }
                    className="form-control input-md"
                    required
                    style={{ marginBottom: "2px" }}
                  />
                  <label>Status To</label>
                  <input
                    type="text"
                    placeholder="To"
                    value={step.to}
                    onChange={(e) =>
                      setStep((step) => ({ ...step, to: e.target.value }))
                    }
                    className="form-control input-md"
                    required
                    style={{ marginBottom: "6px" }}
                  />

                  {/* Button Action to Add Status Step */}
                  <button
                    className="btn btn-secondary input-lg form-control"
                    disabled={!step?.role}
                    onClick={handleSaveSteps}
                  >
                    Add Status Step
                  </button>
                </div>

                {loading ? (
                  <button
                    style={{ cursor: "default" }}
                    className="btn btn-warning form-control"
                  >
                    ...loading
                  </button>
                ) : (
                  <button
                    onClick={handleCreate}
                    className="btn btn-primary form-control"
                    disabled={requirementSaveDisabled}
                  >
                    Save all
                  </button>
                )}
              </div>

              <div
                style={{
                  fontSize: "17px",
                  fontFamily: "monospace",
                  margin: "5px auto",
                }}
              >
                {Object.keys(documents).length > 0 && (
                  <>
                    <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                      Docs:{" "}
                    </span>
                    {Object.entries(documents).map(
                      ([doc, fee], index, array) => (
                        <span key={index}>
                          {`${doc}: $${fee}${
                            index < array.length - 1 ? ", " : ""
                          }`}
                        </span>
                      )
                    )}
                  </>
                )}
                {Object.keys(documents).length > 0 && (
                  <button
                    onClick={() => setDocuments({})}
                    style={{
                      margin: "5px",
                      fontFamily: "monospace",
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>

              <div
                style={{
                  fontSize: "17px",
                  fontFamily: "monospace",
                  margin: "5px auto",
                }}
              >
                {steps.length > 0 && (
                  <>
                    <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                      Steps:{" "}
                    </span>
                    <br />

                    {steps.map((step, index, array) => (
                      <span key={index}>
                        {`${step.role}: ${step.from} -> ${step.to}${
                          index < array.length - 1 ? ", " : ""
                        }`}
                      </span>
                    ))}
                  </>
                )}
                {steps.length > 0 && (
                  <button
                    onClick={() => setSteps([])}
                    style={{
                      margin: "5px",
                      fontFamily: "monospace",
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>

              <br />
              <br />

              <div className="cardHeader">
                <h2>Add an admin</h2>
              </div>

              <form className="form-container" onSubmit={handleAddAdmin}>
                <div className="form-group">
                  <label>Wallet address</label>
                  <input
                    type="text"
                    placeholder="Address"
                    value={adminAddress}
                    onChange={(e) => setAdminAddress(e.target.value)}
                    className="form-control input-lg"
                    required
                  />

                  <label>User Role</label>
                  <select
                    className="input-lg form-control"
                    style={{
                      cursor: "pointer",
                    }}
                    defaultValue="Select Role"
                    onChange={(e) => setAdminRole(e.target.value)}
                  >
                    <option value="Select Role" disabled hidden>
                      Select Role
                    </option>
                    {defaultRoles.map((role) => (
                      <option key={role._id}>{role.role}</option>
                    ))}
                  </select>
                </div>
                {adminLoading ? (
                  <button
                    style={{ cursor: "default" }}
                    className="btn btn-warning form-control"
                  >
                    ...loading
                  </button>
                ) : (
                  <button className="btn btn-primary form-control">
                    Add admin
                  </button>
                )}
              </form>

              <br></br>

              <div className="cardHeader">
                <h2>Create User Role</h2>
              </div>
              <form className="form-container" onSubmit={handleAddNewAdminRole}>
                <div className="form-group">
                  <label>Admin Role</label>
                  <input
                    type="text"
                    placeholder="Enter Admin Role"
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value)}
                    className="form-control input-lg"
                    required
                  />
                </div>
                {adminLoading ? (
                  <button
                    style={{ cursor: "default" }}
                    className="btn btn-warning form-control"
                  >
                    ...loading
                  </button>
                ) : (
                  <button className="btn btn-primary form-control">
                    Add Role
                  </button>
                )}
              </form>
            </div>
            <br />
            <br />
            {showSModal && <Modal text={reason} status="success" />}
            {showEModal && <Modal text={reason} status="error" />}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="main col-lg-12">
            <div className="col-lg-12">
              <div className="cardHeader">
                <h2>Application types</h2>
                <div style={{ height: "20px" }}></div>
                {requirements?.map((requirement, index) => (
                  <div key={index}>
                    {requirement.applicationName} (
                    {requirement.requiredDocuments.map((doc, index, array) => (
                      <span key={doc._id}>
                        {doc.document}
                        {index < array.length - 1 ? ", " : ""}
                      </span>
                    ))}
                    ){" "}
                    <button
                      style={{ margin: "7px" }}
                      className="btn btn-secondary"
                      onClick={() => handleRequirementDelete(requirement._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: "80px" }}></div>
            <div className="col-lg-12">
              <div className="cardHeader">
                <h2>Admins</h2>
                <div style={{ height: "20px" }}></div>
                {admins?.map((admin, index) => (
                  <div key={index}>
                    {admin?.address?.substring(0, 7)}...
                    {admin?.address?.slice(-4)}
                    <button
                      className="btn-secondary btn"
                      onClick={() => handleAdminDelete(admin._id)}
                      style={{ margin: "7px" }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
