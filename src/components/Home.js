import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; // Removed Pagination module
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
// Removed: import "swiper/css/pagination";
import "./Home.css";
import donorImage from "../assets/food2.png";
import { FaUserPlus, FaHandsHelping, FaLink, FaGift, FaHeart } from "react-icons/fa";

const HomePage = () => {
  const [zoom, setZoom] = useState(false);
  const navigate = useNavigate();
  const stepsRef = useRef([]);

  // Toggle zoom effect for carousel images
  useEffect(() => {
    const interval = setInterval(() => {
      setZoom((prevZoom) => !prevZoom);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for step cards animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.3 }
    );

    stepsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      stepsRef.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <>
      <Swiper
        modules={[Navigation, Autoplay]} // Removed Pagination module
        navigation
        autoplay={{ delay: 8000 }}
        loop
        className="home-carousel"
      >
        <SwiperSlide>
          <div className="home-container">
            <div className={`image-container ${zoom ? "zoomed" : "zoom-out"}`}>
              <div className="background-image"></div>
            </div>
            <div className="content-wrapper">
              <h1 className={`home-text ${zoom ? "text-enlarge" : "text-small"}`}>
                FOR IT IS IN <span className="kword">GIVING</span> <br />
                THAT WE <span className="kword">RECEIVE</span>
              </h1>
              <div className="cards-container">
                <div className="card">
                  <h2>WELCOME</h2>
                  <p>Donor or Volunteer</p>
                  {/* <button className="card-button" onClick={() => navigate("/donate")}>
                    Donate
                  </button> */}
                  <button className="card-button" onClick={() => navigate("/auth?redirect=/dhome")}>
  Get Started
</button>
                </div>
                {/* <div className="card">
                  <h2>Be a volunteer</h2>
                  <p>Description for Card 2.</p>
                  <button className="card-button" onClick={() => navigate("/learn-more")}>
                    Learn More
                  </button>
                </div> */}
              </div>
              <img src={donorImage} alt="Helping Hands" className="right-image" />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="home-container">
            <div className={`image-container ${zoom ? "zoomed" : "zoom-out"}`}>
              <div className="background-image second-slide"></div>
            </div>
            <div className="content-wrapper">
              <h1 className={`home-text ${zoom ? "text-enlarge" : "text-small"}`}>
                YOUR HELP <span className="kword">MATTERS</span> <br />
                TO <span className="kword">SOMEONE</span> IN NEED
              </h1>
              <div className="cards-container">
                <div className="card">
                  <h2>Join the Cause</h2>
                  <p>Make an impact in someone's life today.</p>
                  <button className="card-button" onClick={() => navigate("/join")}>
                    Join Now
                  </button>
                </div>
                <div className="card">
                  <h2>Spread Awareness</h2>
                  <p>Encourage others to contribute and make a change.</p>
                  <button className="card-button" onClick={() => navigate("/share")}>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* How It Works Section */}
      <div id="how-it-works" className="steps-section">
        <h2 className="steps-header">How It Works</h2>
        <div className="steps-container">
          {[
            { icon: <FaUserPlus />, text: "Sign Up" },
            { icon: <FaHandsHelping />, text: "Choose Your Role" },
            { icon: <FaLink />, text: "Connect" },
            { icon: <FaGift />, text: "Contribute" },
            { icon: <FaHeart />, text: "Make an Impact" },
          ].map((step, index) => (
            <div
              key={index}
              className="step-card"
              ref={(el) => (stepsRef.current[index] = el)}
            >
              {step.icon}
              <p>
                <strong>Step {index + 1}:</strong> {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
