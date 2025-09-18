import React from "react";

function Footer() {
  return (
    <>
      <hr className="border-t-2 border-gray-200" />
      <div className="sm:pt-16 pt-4 sm:pl-60 pl-20 sm:pr-38 pr-20 w-full sm:max-w-screen max-w-xl justify-between flex flex-col text-center bg-sky-500 text-white">
        <h1 className="sm:mb-16 mb-4">MyRide</h1>
        <div className="grid sm:grid-cols-4 grid-cols-1 sm:justify-normal justify-between sm:text-left text-center space">
          <div className="flex flex-col space-y-4">
            <strong>Company</strong>
            <section>About us</section> 
            <section>Our Offerings </section>
            <section>Newsroom</section> 
            <section>Investors</section> 
            <section>Blog </section>
            <section>Careers</section>
          </div>
          <div className="flex flex-col sm:mt-0 mt-4 space-y-4">
            <strong>Products</strong>
            <section>Ride</section> 
            <section>Drive</section>
            <section>Business</section> 
            <section>Health</section> 
            <section>Gift Cards</section> 
          </div>
          <div className="flex flex-col sm:mt-0 mt-4 space-y-4">
            <strong>Global Citizenship</strong>
            <section>Safety</section> 
            <section>Sustainability</section>
          </div>
          <div className="flex flex-col sm:mt-0 mt-4 space-y-4">
            <strong>Travel</strong>
            <section>Reserve</section>
            <section>Airports</section> 
            <section>Cities</section> 
          </div>
        </div>
          <hr className="mt-5" />
          <div className="sm:mt-10 mt-5 sm:mb-20 mb-25">
                Copyright 2025 MyRide Technologies Inc.
          </div>
      </div>
    </>
  );
}

export default Footer;
