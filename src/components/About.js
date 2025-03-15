import React from "react";
import "./About.css";
import image1 from "../assets/food3.jpg"; // Fruit Market
import image2 from "../assets/food6.jpg"; // Farming

const About = () => {
  return (
    <div className="about-container">
      {/* Background Image Section */}
      <div className="about-banner">
        <h1 className="about-title">About Us</h1>
      </div>

      {/* Our Vision Section */}
      <div className="vision-section">
        {/* Left Side Images */}
        <div className="vision-images">
          <img src={image1} alt="Market" className="vision-img" />
          <img src={image2} alt="Farming" className="vision-img" />
        </div>

        {/* Right Side Text */}
        <div className="vision-text">
          <h3 className="vision-subtitle">FOOD FIRST</h3>
          <h2 className="vision-title">Our Vision</h2>
          <p className="vision-desc">
            The Institute for Food and Development Policy, better known as Food First, envisions a world in which all people have access to healthy, ecologically produced, and culturally appropriate food.
          </p>
          <p className="vision-desc">
            After 40 years of analysis of the global food system, we know that making this vision a reality involves more than technical solutions — it requires <em>action and political transformation</em>.
          </p>
          {/* <button className="vision-btn">SUPPORT OUR VISION</button> */}

          <h2 className="mission-title">Our Mission</h2>
    <p className="mission-desc">
      The Institute for Food and Development Policy, better known as Food First, is dedicated to ensuring that all people have access to healthy, ecologically produced, and culturally appropriate food.
    </p>
    <p className="mission-desc">
      After 40 years of analysis of the global food system, we know that making this mission a reality involves more than technical solutions — it requires <em>action and political transformation</em>.
    </p>
    <button className="mission-btn">SUPPORT OUR MISSION</button>
        </div>
      </div>
    </div>
  );
};

export default About;
