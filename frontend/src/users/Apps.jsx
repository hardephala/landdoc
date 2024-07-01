import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import SingleApp from "./SingleApp";

const handleDownload = (
  applicationName,
  applicationId,
  ownerId,
  paymentStatus
) => {
  const pdf = new jsPDF();

  pdf.text(`Application ID: ${applicationId}`, 10, 20);
  pdf.text(`Owner Hash: ${ownerId}`, 10, 30);
  pdf.text(`Application Type: ${applicationName}`, 10, 40);
  pdf.text(`Payment Status: ${paymentStatus}`, 10, 50);

  pdf.save(`${applicationName}.pdf`);
};

const Apps = ({ address, setShowApps }) => {
  const [applicationList, setApplicationList] = useState();
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log(address);
      try {
        const results = await axios.post(
          "http://localhost:4000/api/my-applications",
          { address },
          {}
        );
        console.log(results.data);
        setApplicationList(results.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleViewInfo = (application) => {
    setSelectedApplication(application);
  };

  const handleGoBackToList = () => {
    setSelectedApplication(null);
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          maxHeight: "100vh",
          maxWidth: "100vw",
          zIndex: "999",
          position: "absolute",
          top: "0",
          background: "#fff",
        }}
      >
        <div className="row">
          <div className="col-lg-12">
            <div className="cardHeader text-center p-3">
              <h2>Applications</h2>
              <Link
                to="/"
                onClick={() => {
                  setShowApps(false);
                }}
              >
                Back to Home
              </Link>
            </div>
            <table
              className="table table-striped table-hover table-bordered"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <td>Application ID</td>
                  <td>Application Type</td>
                  <td>Status</td>
                  <td>Comments</td>
                </tr>
              </thead>
              <tbody>
                {applicationList?.map((application, index) => (
                  <tr key={index}>
                    <td>{application?._id}</td>
                    <td>{application?.appType?.applicationName}</td>
                    <td>
                      <span className={`status pending ${application?.status.replace(" ", "-")}`}>
                        {application?.status}
                      </span>
                    </td>
                    <td>
                      <Link onClick={() => handleViewInfo(application)}>
                        View Info
                      </Link>{" "}
                      /{" "}
                      <Link
                        onClick={() =>
                          handleDownload(
                            application.appType.applicationName,
                            application._id,
                            application?.userId?.address,
                            "Paid"
                          )
                        }
                      >
                        Print
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectedApplication && (
        <SingleApp
          application={selectedApplication}
          address={address}
          onGoBack={handleGoBackToList}
        />
      )}
    </>
  );
};

export default Apps;
