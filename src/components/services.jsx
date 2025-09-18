import React from "react";
import Navbar from "./aboutcomponent/navbar";
import Footer from "./aboutcomponent/footer";

export const services = [
  {
    title: "MyRide AutoRickshaw",
    desc: "Affordable and quick auto-rickshaw rides for short city trips.",
    media: "/autorickshaw.jpg",
    type: "image",
  },
  {
    title: "MyRide Taxi (4-Seater)",
    desc: "Standard car rides for up to 4 passengers.",
    media: "/taxi-four.jpg",
    type: "image",
  },
  {
    title: "MyRide Taxi (6-Seater)",
    desc: "Spacious rides for groups and families.",
    media: "/taxi-six.jpg",
    type: "image",
  },
  {
    title: "MyRide Reservation Car",
    desc: "Book a car in advance for planned trips.",
    media: "/reservation.jpg",
    type: "image",
  },
  {
    title: "MyRide Intercity",
    desc: "Comfortable and reliable travel between cities.",
    media: "/intercity.png",
    type: "image",
  },
  {
    title: "MyRide Bike",
    desc: "Fast and budget-friendly two-wheeler rides for solo travelers.",
    media: "/bike.jpg",
    type: "image",
  },
  {
    title: "MyRide Assist (Handicap Accessible)",
    desc: "Cars designed for differently-abled riders with wheelchair support.",
    media: "/handicap.jpg",
    type: "image",
  },
  {
    title: "MyRide Share",
    desc: "Share your ride with others heading the same way, at lower cost.",
    media: "/share.jpg",
    type: "image",
  },
  {
    title: "MyRide Traveller (14–16 Seater)",
    desc: "Van-type vehicles for big groups and family outings.",
    media: "/traveller.jpg",
    type: "image",
  },
];

function Services() {
  return (
    <>
      <Navbar />
      <section className="bg-gray-50">
        <div className="relative w-full h-[200px] sm:h-[400px] lg:h-[400px] overflow-hidden">
          <video
            src="/services.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute pt-30 inset-0 bg-black/70 flex items-center justify-center">
            <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold">
              Our Services
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform transition duration-300"
              >
                {service.type === "image" ? (
                  <img
                    src={service.media}
                    alt={service.title}
                    className="w-100 h-56 p-8  sm:h-64 object-cover"
                  />
                ) : (
                  <video
                    src={service.media}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-56 sm:h-64 object-cover"
                  />
                )}

                <div className="p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Services;