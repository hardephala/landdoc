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
    <div class="container">
      <div style={{ height: "40px" }}></div>
      <div class="cardBox">
        <div class="card">
          <div>
            <div class="numbers">{stats?.totalApplications}</div>
            <div class="cardName">Applications</div>
          </div>
        </div>

        <div class="card">
          <div>
            <div class="numbers">{stats?.pendingApplications}</div>
            <div class="cardName">Pending</div>
          </div>
        </div>

        <div class="card">
          <div>
            <div class="numbers">{stats?.totalUsers}</div>
            <div class="cardName">Users</div>
          </div>
        </div>
      </div>

      <div class="details">
        <div class="recentOrders">
          <div class="cardHeader">
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
                <tr>
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

        <div class="recentCustomers">
          <div class="cardHeader">
            <h2>Recent Users</h2>
          </div>

          <table>
            {stats?.recentUsers.map((user, index) => (
              <tr>
                <td width="60px">
                  <div class="imgBx">
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
