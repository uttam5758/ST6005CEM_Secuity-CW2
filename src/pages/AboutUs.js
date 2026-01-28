import React from "react";
import about_us from "../assets/images/about-us.jpg"
import about_us_2 from "../assets/images/about-us-2.jpg"

const AboutUs = () => {
  return (
    <div className="text-center about-us-parent">
        <h3 className="page-title">About FloralFurnish</h3>
      <div className="about-us-container">
        <div className="top-row">
          <div className="left-image">
            <img src={about_us_2} alt="AgriMart" className="agrimart-image" />
          </div>
          <div className="right-content">
            <p>
            Welcome to FloralFurnish, your premier destination for exquisite furniture 
            and a seamless shopping experience. At FloralFurnish, we believe that every 
            space deserves to be adorned with furniture that embodies style, comfort, and 
            functionality. 
            </p>
            <p>
            Our passion for design, commitment to quality, and dedication 
            to customer satisfaction set us apart as a trusted name in the world of home 
            furnishings
            </p>
          </div>
        </div>
        <div className="bottom-row">
          <div className="left-content">
            <h3>Our Vision</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
              tincidunt diam vitae augue ullamcorper vulputate. Donec ac sagittis
              elit. Vivamus et sem a nunc placerat venenatis ut et purus.
            </p>
          </div>
          <div className="right-image">
            <img src={about_us} alt="AgriMart" className="agrimart-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
