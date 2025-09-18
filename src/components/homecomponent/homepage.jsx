import { MapPin } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Homepage() {
  const navigate = useNavigate();

  const handleBookRide = () => {
    navigate("/ride");
  };

  return (
    <>
      <div className="px-4 sm:px-8 lg:px-16 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 py-10 lg:py-20">
          <video
            src="/uber-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full lg:w-1/2 rounded-2xl shadow-lg max-h-[70vh] object-cover"
          />

          <section className="flex flex-col text-center lg:text-left max-w-lg w-full space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-sky-500 leading-snug">
              Get your first ride <br /> from here
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Book rides instantly, schedule for later, or share with friends
              all in one app.
            </p>
            <div
              onClick={handleBookRide}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
            >
              Book a Ride
            </div>
          </section>
        </div>

        <h2 className="text-3xl font-bold mb-12 sm:text-left text-center text-sky-500">
          Core Features
        </h2>
        <div className="grid sm:grid-cols-3 grid-cols-1 gap-8 mb-16">
          {[
            {
              img: "/booking.png",
              title: "Real-time Ride Booking",
              desc: "Book rides instantly with your pickup & drop location.",
            },
            {
              img: "/google-live-tracking.png",
              title: "Live Tracking",
              desc: "Track your driver live on the map for full transparency.",
            },
            {
              img: "/fare-estimator.png",
              title: "Fare Estimator",
              desc: "See estimated fare before confirming your trip.",
            },
            {
              img: "/payments.png",
              title: "Multiple Payment Options",
              desc: "Pay using UPI, cards, wallets, or cash — your choice.",
            },
            {
              img: "/riding-schedule.png",
              title: "Ride Scheduling",
              desc: "Book a ride for later — perfect for airport runs.",
            },
            {
              img: "/ride-sharing.jpg",
              title: "Ride Sharing / Pooling",
              desc: "Save money & the planet with carpooling.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition text-center"
            >
              <img
                src={feature.img}
                alt={feature.title}
                className="w-20 h-20 mx-auto mb-4 rounded-lg object-cover"
              />
              <h3 className="font-semibold text-lg mb-2 text-sky-600">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-12 sm:text-left text-center text-sky-500">
          Features for Riders
        </h2>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-8 mb-16">
          {[
            {
              img: "/riders preference.jpg",
              title: "Ride Preferences",
              desc: "Music, AC, quiet mode — personalize your ride experience.",
            },
            {
              img: "/emergency-buttons.png",
              title: "Emergency Button",
              desc: "One-tap emergency support with live location sharing.",
            },
            {
              img: "/rating.jpg",
              title: "Driver Ratings & Reviews",
              desc: "Rate drivers, share feedback, and build trust.",
            },
            {
              img: "/referral program.jpg",
              title: "Loyalty & Referral Program",
              desc: "Earn rewards, get discounts, and invite friends.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition text-center"
            >
              <img
                src={feature.img}
                alt={feature.title}
                className="w-20 h-20 mx-auto mb-4 rounded-lg object-cover"
              />
              <h3 className="font-semibold text-lg mb-2 text-sky-600">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Homepage;
