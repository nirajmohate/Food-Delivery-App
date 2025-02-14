import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <h1>TastyTrack</h1>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. At
            veritatis esse animi?
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+1-222-222-4444</li>
                <li>contact@#2E7D32.com</li>

            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 @ #2E7D32.com - All Right Reserved</p>
    </div>
  );
};

export default Footer;
