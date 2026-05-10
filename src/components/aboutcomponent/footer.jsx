import React from "react";

function Footer() {
  return (
    <>
      <hr className="border-t-2 border-gray-200" />
      <div className="sm:pt-16 pt-20 w-full px-5 sm:px-10 md:px-20 lg:px-30 xl:px-40 flex flex-col text-center bg-green-500/80 text-white">
        <h1 className="sm:mb-16 mb-4 text-3xl font-bold">MyRide</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-10 items-start justify-between sm:text-left text-center">
          <div className="flex flex-col space-y-4 mx-auto">
            <strong>Company</strong>
            <section>About us</section> 
            <section>Our Offerings </section>
            <section>Newsroom</section> 
            <section>Investors</section> 
            <section>Blog </section>
            <section>Careers</section>
          </div>
          <div className="flex flex-col space-y-4 mx-auto">
            <strong>Products</strong>
            <section>Ride</section> 
            <section>Drive</section>
            <section>Business</section> 
            <section>Health</section> 
            <section>Gift Cards</section> 
          </div>
          <div className="flex flex-col sm:mt-0 mt-4 space-y-4 mx-auto">
            <strong>Global Citizenship</strong>
            <section>Safety</section> 
            <section>Sustainability</section>
          </div>
          <div className="flex flex-col sm:mt-0 mt-4 space-y-4 mx-auto">
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