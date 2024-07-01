/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";

import customer1 from "../assets/admin/imgs/customer01.jpg";
import "../assets/admin/vendor/bootstrap/css/bootstrap.min.css";
import "../assets/admin/css/style.css";
import { allStatusTypes } from "../constants";
import toast from "react-hot-toast";

const Application = ({ address, contract, userRole }) => {
  const { applicationId } = useParams();
  const [application, setApplication] = useState();
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("");
  const [documentStatuses, setDocumentStatuses] = useState({});
  const [comments, setComments] = useState("");

  const [completedDocument, setCompletedDocument] = useState("");
  const [completedDocURL, setCompletedDocURL] = useState("");
  const [transactionDetails, setTransactionDetails] = useState({});
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await axios.post(
          `http://localhost:4000/api/applications/${applicationId}`,
          { address },
          {}
        );
        setApplication(results.data.application);

        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false,
        };
        const logsWithISOStrings = results.data.logs.map((log) => {
          const isoDateString = new Date(log.date).toLocaleDateString(
            undefined,
            options
          );
          console.log(isoDateString);
          return { ...log, date: isoDateString };
        });
        setLogs(logsWithISOStrings);

        setStatus(results.data.application.status);
        const initialDocumentStatuses = {};
        results.data.application.documents.forEach((document) => {
          initialDocumentStatuses[document._id] = document.status;
        });
        setDocumentStatuses(initialDocumentStatuses);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [applicationId]);

  const storeHashOnChain = async (id, hash) => {
    try {
      const tx = await contract.storeHash(id, hash);

      console.log("Transaction Hash:", tx.hash);

      await tx.wait();

      const retrievedHash = await contract.getHashByIdentifier(id);

      console.log("Stored hash:", retrievedHash);
      setTransactionDetails({
        transactionHash: tx.hash,
        storedURL: retrievedHash,
      });
      setShowTransactionDetails(true);
      return { transactionHash: tx.hash, storedURL: retrievedHash };
    } catch (error) {
      console.error("Error storing hash on chain:", error);
      throw error;
    }
  };

  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      if (status === "Completed") {
        storeHashOnChain(completedDocURL.hash, completedDocURL.url);

        await axios.put(
          // `http://localhost:4000/api/applications/completed/${applicationId}`,
          `http://localhost:4000/api/applications/status/${applicationId}`,
          { status, comments, address, completedDocURL },
          {}
        );
      } else {
        await axios.put(
          `http://localhost:4000/api/applications/status/${applicationId}`,
          { status, comments, address },
          {}
        );
      }

      await Promise.all(
        Object.entries(documentStatuses).map(([documentId, documentStatus]) =>
          axios.put(
            `http://localhost:4000/api/documents/${documentId}/status`,
            { status: documentStatus },
            {}
          )
        )
      );
      toast.success("Application Status Updated Successfully");
      navigate(-1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowTransactionDetails(false);
    navigate("/applications");
  };

  const handleDocumentStatusChange = (documentId, newStatus) => {
    setDocumentStatuses({
      ...documentStatuses,
      [documentId]: newStatus,
    });
  };

  const handleDocumentUpload = async (applicationName) => {
    try {
      const formData = new FormData();
      formData.append("status", "Completed");
      formData.append("documentName", applicationName);
      formData.append("file", completedDocument);

      const results = await axios.post(
        "http://localhost:4000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCompletedDocURL(results.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusDisabled = (status) => {
    if (!application) return true;
    const requiredSteps = application.appType.requiredSteps;
    let allowedSteps = requiredSteps.filter((step) => step.role === userRole);

    if (userRole === "admin") {
      return false;
    }
    const allowed = allowedSteps
      .map(
        (steps) =>
          steps.from == application.status &&
          (steps.to == status || steps.from == status)
      )
      .some((step) => step === true);

    return !allowed;
  };

  // console.log({ application });

  return (
    <>
      <div className="container">
        <div style={{ marginTop: "40px" }}></div>
        <h3>
          <strong>{application?.appType?.applicationName}</strong>
        </h3>
        <br />
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>Applicant's Full Name :</strong>{" "}
              {application?.ownerFullName}
            </p>
            <p>
              <strong>Applicant's Address :</strong> {application?.ownerAddress}
            </p>
            <p>
              <strong>Email Address :</strong> {application?.email}
            </p>
          </div>
          <div className="col-md-6">
            <label>
              <strong>Application status :</strong> {application?.status}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-control"
              >
                {allStatusTypes.map((status) => (
                  <option key={status} disabled={getStatusDisabled(status)}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <br />
          {status === "completed" && (
            <label>
              <strong>Completed Document : </strong>
              <input
                type="file"
                onChange={(e) => setCompletedDocument(e.target.files[0])}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  handleDocumentUpload(application?.appType?.applicationName)
                }
              >
                Upload
              </button>
            </label>
          )}
          {application?.completedDocURL && (
            <div className="col-md-6">
              {`Completed ${application?.appType?.applicationName} Document`} :{" "}
              <a
                href={`http://localhost:4000/${application?.completedDocURL}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View in new tab
              </a>
            </div>
          )}
          <br />
          <br />
          <br />
          <label>
            <strong>Comments : </strong>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="form-control"
            />
          </label>

          <p>
            <strong>Document Files : </strong>
          </p>
          <ul>
            {application?.documents?.map((file) => (
              <div key={file._id}>
                <div className="col-md-6">
                  {file.document} :{" "}
                  <a
                    href={`http://localhost:4000/${file.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View in new tab
                  </a>
                </div>

                <label className="col-md-6">
                  <select
                    className="form-control"
                    value={documentStatuses[file._id] || ""}
                    onChange={(e) =>
                      handleDocumentStatusChange(file._id, e.target.value)
                    }
                  >
                    <option>pending</option>
                    <option>action needed</option>
                    <option>completed</option>
                  </select>
                </label>
                <br />
              </div>
            ))}
          </ul>

          <button
            onClick={handleUpdateStatus}
            className="btn btn-primary form-control col-md-6 mx-2"
            disabled={loading}
          >
            Update Status
          </button>
        </div>

        <div>
          <div style={{ height: "70px" }}></div>
          <div className="cardHeader">
            <h2>Logs</h2>
          </div>
          <table
            className="table table-striped table-hover table-bordered"
            style={{ width: "100%" }}
          >
            <thead>
              <tr>
                <td>Date</td>
                <td>Data</td>
                <td>Admin</td>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td>{log?.date}</td>
                  <td>{log?.data}</td>
                  <td>
                    {log?.adminId?.address.substring(0, 5)}...
                    {log?.adminId?.address.slice(-3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showTransactionDetails && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "50vw",
              height: "50vh",
              background: "#459cfc",
              color: "#eee",
              padding: "15px",
              display: "flex",
              borderRadius: "7px",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3>Transaction Details</h3>
            <p>Transaction Hash: {transactionDetails.transactionHash}</p>
            <p>Stored URL: {transactionDetails.storedURL}</p>
            <p>
              Transaction Link:{" "}
              <a
                href={`https://testnet.bscscan.com/tx/${transactionDetails.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#000" }}
              >
                View on BSCScan
              </a>
            </p>
            <button
              onClick={handleClosePopup}
              style={{
                background: "#fff",
                color: "#111",
                padding: "7px 20px",
                borderRadius: "7px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Application;
