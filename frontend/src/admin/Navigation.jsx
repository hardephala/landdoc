import React from 'react';
import {IonIcon} from '@ionic/react'
import { Link } from 'react-router-dom';

import customer1 from '../assets/admin/imgs/customer01.jpg'
import '../assets/admin/vendor/bootstrap/css/bootstrap.min.css'
import '../assets/admin/css/style.css'

const Navigation = () => {
  
  const disconnectWallet = () => {
    window.location.reload();
  };

  return (
    <div className="navigation">
      <ul>
        <li>
          <Link to="/">
            <span className="icon">
              <IonIcon icon="home"/>
            </span>
            <span style={{marginRight:"40px", marginTop:"20px", fontWeight:"bolder"}}>DASHBOARD</span>
          </Link>
        </li>
        <li>
          <Link to="/">
            <span className="icon">
            <IonIcon icon="home-outline"/>
            </span>
            <span className="title">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/applications">
            <span className="icon">
              <IonIcon icon="chatbubble-outline"/>
            </span>
            <span className="title">Applications</span>
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <span className="icon">
              <IonIcon icon="settings-outline"/>
            </span>
            <span className="title">Settings</span>
          </Link>
        </li>
        <li>
          <Link to="#" onClick={disconnectWallet}>
            <span className="icon">
              <IonIcon icon="log-out-outline"/>
            </span>
            <span className="title">Sign Out</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
