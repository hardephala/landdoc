/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SingleApp = ({ application, address, onGoBack }) => {
  const [selectedApplication, setSelectedApplication] = useState({});
  const [documents, setDocuments] = useState({});
  const [documentsURL, setDocumentsURL] = useState({});

  const [ownerFullName, setOwnerFullName] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [prevOwnerType, setPrevOwnerType] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [residentType, setResidentType] = useState("");
  const [sizeSqm, setSizeSqm] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await axios.post(
          `http://localhost:4000/api/applications/${application._id}`,
          { address },
          {}
        );
        setSelectedApplication(results.data.application);
        setOwnerFullName(results.data.application.ownerFullName);
        setOwnerAddress(results.data.application.ownerAddress);
        setPrevOwnerType(results.data.application.prevOwnerType);
        setEmail(results.data.application.email);
        setPhone(results.data.application.phone);
        setResidentType(results.data.application.residentType);
        setSizeSqm(results.data.application.sizeSqm);
        setLocation(results.data.application.location);
        setIsLoading(false);

        console.log(results.data);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {}, [selectedApplication, documentsURL]);

  const handleUpdateApplication = async () => {
    try {
      console.log(documentsURL);

      const updatedDocuments = selectedApplication.documents.map((file) => {
        const newURL = documentsURL[file.document];
        return {
          ...file,
          url: newURL || file.url,
        };
      });

      Object.keys(documentsURL).forEach((documentName) => {
        const isNewDocument = !selectedApplication.documents.some(
          (file) => file.document === documentName
        );
        if (isNewDocument) {
          updatedDocuments.push({
            documentName: documentName,
            url: documentsURL[documentName],
          });
        }
      });

      setSelectedApplication((prevApp) => ({
        ...prevApp,
        documents: updatedDocuments,
      }));

      const results = await axios.put(
        `http://localhost:4000/api/applications/${selectedApplication._id}`,
        {
          address,
          ownerFullName,
          ownerAddress,
          prevOwnerType,
          email,
          phone,
          residentType,
          sizeSqm,
          location,
          documentsURL: updatedDocuments,
        },
        {}
      );
      onGoBack();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileChange = (documentName, file) => {
    setDocuments((prevUploads) => ({
      ...prevUploads,
      [documentName]: file,
    }));
    console.log(documents);
  };

  const handleDocumentUpload = async (documentName) => {
    try {
      const formData = new FormData();
      formData.append("documentName", documentName);
      formData.append("file", documents[documentName]);

      const results = await axios.post(
        "http://localhost:4000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const existingDocumentIndex = selectedApplication.documents.findIndex(
        (doc) => doc.document === documentName
      );

      if (existingDocumentIndex !== -1) {
        const updatedDocuments = [...selectedApplication.documents];
        updatedDocuments[existingDocumentIndex] = {
          document: documentName,
          url: results.data,
        };

        setSelectedApplication((prevApp) => ({
          ...prevApp,
          documents: updatedDocuments,
        }));
      } else {
        setSelectedApplication((prevApp) => ({
          ...prevApp,
          documents: [
            ...(prevApp.documents || []),
            {
              document: documentName,
              url: results.data,
            },
          ],
        }));
      }

      setDocumentsURL((prevUploads) => ({
        ...prevUploads,
        [documentName]: results.data,
      }));
      console.log(results.data, documentsURL);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleUpdateApplication();
  }, [documentsURL]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div
        className="container"
        style={{
          paddingLeft: "50px",
          paddingRight: "50px",
          minHeight: "100vh",
          minWidth: "100vw",
          maxHeight: "100vh",
          maxWidth: "100vw",
          zIndex: "1000",
          position: "absolute",
          top: "0",
          background: "#fff",
        }}
      >
        <div className="text-center" style={{ marginTop: "40px" }}></div>
        <Link
          to="/"
          onClick={() => {
            onGoBack();
          }}
        >
          Back
        </Link>
        <h3 className="text-center">
          Application Type: <strong>{selectedApplication?.appType?.applicationName}</strong>
        </h3>
        <br />
        <div className="row justify-content-center">
          <div className="col-md-6">
            <p>
              <strong>Applicant's Full Name:</strong>{" "}
              <input
                onChange={(e) => setOwnerFullName(e.target.value)}
                defaultValue={ownerFullName}
                className="col-md-4 form-control"
              />
            </p>
            <p>
              <strong>Applicant Wallet Address:</strong>{" "}
              <input
                onChange={(e) => setOwnerAddress(e.target.value)}
                defaultValue={ownerAddress}
                className="col-md-4 form-control"
              />
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <input
                className="col-md-4 form-control"
                placeholder={selectedApplication?.status}
                disabled
              />
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Email Address:</strong>{" "}
              <input
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-md-4 form-control"
              />
            </p>
            <p>
              <strong>Phone Number:</strong>{" "}
              <input
                defaultValue={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="col-md-4 form-control"
              />
            </p>
            
            
            {selectedApplication?.completedDocURL && (
              <p>
                {`Completed ${application?.appType?.applicationName} Document`}{" "}
                :{" 1"}
                <a
                  href={`http://localhost:4000/${application?.completedDocURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View in new tab
                </a>
              </p>
            )}
          </div>
          <p style={{ marginTop: "10px" }}>
            <strong>Comments:</strong>{" "}
            {selectedApplication.comments
              ? selectedApplication.comments
              : "None"}
          </p>

          <p>
            <strong>Document Files:</strong>
          </p>
          <ul>
            {selectedApplication?.appType.requiredDocuments?.map(
              (file, index) => (
                <div key={file._id}>
                  <div className="col-md-6">
                    <span style={{ marginRight: "10px" }}>
                      <strong>Document:</strong> {file.document}
                    </span>
                    <span style={{ marginRight: "10px" }}>
                      <strong>Status:</strong>{" "}
                      {selectedApplication.documents[index]?.status ||
                        "Action Needed"}
                    </span>{" "}
                    {selectedApplication.documents[index] && (
                      <a
                        href={`http://localhost:4000/${selectedApplication.documents[index]?.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View in new tab
                      </a>
                    )}
                  </div>
                  <br/>
                    <hr/>

                  {/* <input
                    type="file"
                    onChange={(e) =>
                      handleFileChange(file.document, e.target.files[0])
                    }
                    style={{ marginLeft: "10px" }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleDocumentUpload(file.document)}
                  >
                    Upload
                  </button> */}


                </div>
              )
            )}
          </ul>

          <button
            onClick={handleUpdateApplication}
            className="btn btn-primary col-md-6 justify-content-center form-control"
          >
            Update Application
          </button>
        </div>
      </div>
    </>
  );
};

export default SingleApp;
