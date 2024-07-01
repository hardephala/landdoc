/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios";

import "../assets/admin/vendor/bootstrap/css/bootstrap.min.css";
import "../assets/admin/css/style.css";

const Applications = ({ address, userRole }) => {
  const [allApplications, setAllApplications] = useState();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await axios.post(
          `http://localhost:4000/api/applications/admin`,
          { address },
          {}
        );
        setAllApplications(results.data);
        console.log(results.data);
      } catch (err) {
        console.log(err);
      }
    };

    console.log(" i ran");
    fetchData();
  }, []);

  const getApplicationDisabled = (application) => {
    if (!application) return true;
    const requiredSteps = application.appType.requiredSteps;
    let allowedSteps = requiredSteps.filter((step) => step.role === userRole);

    if (userRole === "admin") {
      return false;
    }
    const allowed = allowedSteps
      .map((steps) => steps.from == application.status)
      .some((step) => step == true);

    console.log({ allowed, allowedSteps });
    return !allowed;
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div style={{ height: "50px" }}></div>
          <div className=" col-lg-12">
            <div className="cardHeader mb-4 text-xl">
              <h2>All Applications</h2>
              <p></p>
            </div>

            {allApplications &&
              [...Object.keys(allApplications)].map((app) => {
                const { applications } = allApplications[app];

                if (applications.length === 0) return <></>;
                return (
                  <>
                    <div className="cardHeader">
                      <h2 className="capitalize mb-2">{app}</h2>
                    </div>
                    <table
                      className="table table-striped table-hover table-bordered"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <td>Application ID</td>
                          <td>Applicant Address</td>
                          <td>Application Type</td>
                          <td>Status</td>
                          <td>Action</td>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((application, index) => (
                          <ApplicationTableItem
                            key={index}
                            application={application}
                            getApplicationDisabled={getApplicationDisabled}
                            handleDownload={handleDownload}
                          />
                        ))}
                      </tbody>
                    </table>
                  </>
                );
              })}
          </div>

          {/* <table
              className="table table-striped table-hover table-bordered"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <td>Application ID</td>
                  <td>Applicant Address</td>
                  <td>Application Type</td>
                  <td>Status</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {allApplications?.pending.applications.map(
                  (application, index) => (
                    <ApplicationTableItem
                      key={index}
                      application={application}
                      getApplicationDisabled={getApplicationDisabled}
                      handleDownload={handleDownload}
                    />
                  )
                )}
              </tbody>
            </table> */}

          {/* <div style={{height:"50px"}}></div>
                <div class=" col-lg-12">
                    <div class="cardHeader">
                        <h2>Pending Applications</h2>
                    </div>
                    <table class="table table-striped table-hover table-bordered" style={{width: "100%"}}>
                        <thead>
                            <tr>
                                <td>Application ID</td>
                                <td>Owner Hash</td>
                                <td>Application Type</td>
                                <td>Payment Status</td>
                                <td>Status</td>
                                <td>Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {allApplications?.Pending.applications.map((application, index) => (
                                <tr>
                                    <td>{application?._id}</td>
                                    <td>{application?.userId?.address?.substring(0, 5)}...{application?.userId?.address?.slice(-3)}</td>
                                    <td>{application.appType.applicationName}</td>
                                    <td>Paid</td>
                                    <td><span className="status pending">{application.status}</span></td>
                                    <td><Link to={`/application/${application._id}`}>View Info</Link> / <Link onClick={() => handleDownload(application.appType.applicationName, application._id, application?.userId?.address, "Paid")}>Print</Link></td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>


                <div style={{height:"30px"}}></div>
                <div class=" col-lg-12">
                    <div class="cardHeader">
                        <h2>Approved Applications</h2>
                    </div>
                    <table class="table table-striped table-hover table-bordered" style={{width: "100%"}}>
                        <thead>
                            <tr>
                                <td>Application ID</td>
                                <td>Owner Hash</td>
                                <td>Application Type</td>
                                <td>Payment Status</td>
                                <td>Status</td>
                                <td>Action</td>
                            </tr>
                        </thead>

                        <tbody>
                            {allApplications?.Approved.applications.map((application, index) => (
                                <tr>
                                    <td>{application?._id}</td>
                                    <td>{application?.userId?.address?.substring(0, 5)}...{application?.userId?.address?.slice(-3)}</td>
                                    <td>{application.appType.applicationName}</td>
                                    <td>Paid</td>
                                    <td><span className="status inProgress">{application.status}</span></td>
                                    <td><Link to={`/application/${application._id}`}>View Info</Link> / <Link onClick={() => handleDownload(application.appType.applicationName, application._id, application?.userId?.address, "Paid")}>Print</Link></td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>

                <div style={{height:"30px"}}></div>
                <div class=" col-lg-12">
                    <div class="cardHeader">
                        <h2>Action Needed</h2>
                    </div>
                    <table class="table table-striped table-hover table-bordered" style={{width: "100%"}}>
                        <thead>
                            <tr>
                                <td>Application ID</td>
                                <td>Owner Hash</td>
                                <td>Application Type</td>
                                <td>Payment Status</td>
                                <td>Status</td>
                                <td>Action</td>
                            </tr>
                        </thead>

                        <tbody>
                            {allApplications?.ActionNeeded.applications.map((application, index) => (
                                <tr>
                                    <td>{application?._id}</td>
                                    <td>{application?.userId?.address?.substring(0, 5)}...{application?.userId?.address?.slice(-3)}</td>
                                    <td>{application.appType.applicationName}</td>
                                    <td>Paid</td>
                                    <td><span className="status return">{application.status}</span></td>
                                    <td><Link to={`/application/${application._id}`}>View Info</Link> / <Link onClick={() => handleDownload(application.appType.applicationName, application._id, application?.userId?.address, "Paid")}>Print</Link></td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>

                <div style={{height:"30px"}}></div>
                <div class=" col-lg-12">
                    <div class="cardHeader">
                        <h2>Completed Applications</h2>
                    </div>
                    <table class="table table-striped table-hover table-bordered" style={{width: "100%"}}>
                        <thead>
                            <tr>
                                <td>Application ID</td>
                                <td>Owner Hash</td>
                                <td>Application Type</td>
                                <td>Payment Status</td>
                                <td>Status</td>
                                <td>Action</td>
                            </tr>
                        </thead>

                        <tbody>
                            {allApplications?.Completed.applications.map((application, index) => (
                                <tr>
                                    <td>{application?._id}</td>
                                    <td>{application?.userId?.address?.substring(0, 5)}...{application?.userId?.address?.slice(-3)}</td>
                                    <td>{application?.appType?.applicationName}</td>
                                    <td>Paid</td>
                                    <td><span className="status delivered">{application?.status}</span></td>
                                    <td><Link to={`/application/${application?._id}`}>View Info</Link> / <Link onClick={() => handleDownload(application.appType.applicationName, application._id, application?.userId?.address, "Paid")}>Print</Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> */}
        </div>
      </div>
    </>
  );
};

const ApplicationTableItem = ({
  application,
  getApplicationDisabled,
  handleDownload,
}) => {
  const disabled = getApplicationDisabled(application);
  console.log(disabled);

  return (
    <tr>
      <td>{application?._id}</td>
      <td>
        {application?.userId?.address?.substring(0, 5)}...
        {application?.userId?.address?.slice(-3)}
      </td>
      <td>{application.appType.applicationName}</td>
      <td>
        <span className={`status ${application.status.replace(" ", "-")}`}>
          {application.status}
        </span>
      </td>
      <td>
        <button
          disabled={disabled}
          className="disabled:pointer-events-none disabled:opacity-80"
        >
          <Link to={`/application/${application._id}`}>View Info</Link>{" "}
        </button>
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
  );
};

export default Applications;
