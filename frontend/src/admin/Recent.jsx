import React, { useState, useEffect } from "react";
import customer2 from "../assets/admin/imgs/customer02.jpg";
import customer1 from "../assets/admin/imgs/customer01.jpg";
import { Link } from "react-router-dom";
import axios from "axios";

import "../assets/admin/vendor/bootstrap/css/bootstrap.min.css";
import "../assets/admin/css/style.css";

const Recent = ({ address }) => {
  const [stats, setStats] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await axios.post(
          `http://localhost:4000/api/applications/stats`,
          { address },
          {}
        );
        setStats(results.data);
        console.log(results.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <div style={{ height: "40px" }}></div>
      <div className="cardBox">
        <div className="card">
          <div>
            <div className="numbers">{stats?.totalApplications}</div>
            <div className="cardName">Applications</div>
          </div>
        </div>

        <div className="card">
          <div>
            <div className="numbers">{stats?.pendingApplications}</div>
            <div className="cardName">Pending</div>
          </div>
        </div>

        <div className="card">
          <div>
            <div className="numbers">{stats?.totalUsers}</div>
            <div className="cardName">Users</div>
          </div>
        </div>
      </div>

      <div className="details">
        <div className="recentOrders">
          <div className="cardHeader">
            <h2>Recent Orders</h2>
            <Link to="/applications" class="btn">
              View All
            </Link>
          </div>

          <table>
            <thead>
              <tr>
                <td>Name</td>
                <td>Status</td>
                <td>Completed</td>
                <td>Paid</td>
              </tr>
            </thead>

            <tbody>
              {stats?.recentApplications.map((application, index) => (
                <tr key={index}>
                  <td>{application.appType.applicationName}</td>
                  <td>
                    <span className="status return">{application.status}</span>
                  </td>
                  <td>
                    {application.status == "Completed" ? "True" : "False"}
                  </td>
                  <td>True</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="recentCustomers">
          <div className="cardHeader">
            <h2>Recent Users</h2>
          </div>

          <table>
            {stats?.recentUsers.map((user, index) => (
              <tr key={index}>
                <td width="60px">
                  <div className="imgBx">
                    <img src={customer2} alt="" />
                  </div>
                </td>
                <td>
                  <h4>
                    {user?.address} <br /> <span>{user?.role}</span>
                  </h4>
                  {/* <h4>{user?.address.substring(0, 5)}...{user?.address.slice(-3)} <br/> <span>{user?.role}</span></h4> */}
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Recent;
