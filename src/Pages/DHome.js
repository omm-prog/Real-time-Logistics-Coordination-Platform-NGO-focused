import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./DHome.css";
import donorImage from "../assets/food2.png";

const DHomePage = () => {
  const [zoom, setZoom] = useState(false);
  const navigate = useNavigate(); // ✅ Define navigate

  useEffect(() => {
    const interval = setInterval(() => {
      setZoom((prevZoom) => !prevZoom); // Toggle zoom state
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
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

            {/* <div className="cards-container">
              <div className="card">
                <h2>Be a donor</h2>
                <p>Description for Card 1.</p>
                <button className="card-button" onClick={() => navigate("/donate")}>Donate</button>
              </div>
              <div className="card">
                <h2>Be a volunteer</h2>
                <p>Description for Card 2.</p>
                <button className="card-button" onClick={() => navigate("/learn-more")}>Learn More</button>
              </div>
            </div> */}

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


          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default DHomePage;
