import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <>
      <div>
        <section className="  text-center items-center">
          <img
            src="/first.jpg"
            alt=""
            className="w-full h-168 pt-20 object-cover"
          />
          <section className="absolute top-124 left-100 space-y-4 text-white/95 w-[50%]">
            <h1 className="text-3xl font-bold">About Us</h1>
            <p className="text-[90%]">
              We created MyRide to make traveling simpler, smarter, and more
              reliable. Our mission is to connect riders with safe and
              affordable rides anytime, anywhere. With just a few taps, you can
              book, track, and enjoy your journey without hassle. We believe
              every ride should be comfortable, convenient, and stress-free.
            </p>
          </section>
          <section className="pl-50 text-left pt-20 w-[60%] pb-20 space-y-8">
            <h1 className="text-5xl font-bold text-gray-700">
              Your Journey, <br /> Our Commitment
            </h1>
            <p>
              At MyRide, we believe traveling should be easy, reliable, and
              stress-free. Our platform is designed to connect you with trusted
              drivers in just a few clicks. Whether it’s a quick city ride or a
              long trip, we ensure safety and comfort every time. With
              transparent pricing and real-time tracking, you’re always in
              control of your journey. We’re here to redefine the way you move,
              making every ride smooth and memorable.
            </p>
          </section>
          <section className="bg-green-500/80 pt-40 text-white/85 space-y-40 pl-50 pb-40 text-left">
            <section className="flex space-x-40">
              <section className="w-[34%] space-y-4 pt-20">
                <h1 className="text-2xl">Life</h1>
                <p>
                  Life at MyRide is all about innovation, collaboration, and
                  growth. We foster a culture where creativity meets technology
                  to make travel seamless. Every team member is encouraged to
                  share ideas and build meaningful solutions. Work here is
                  exciting, dynamic, and focused on making a real-world impact.
                </p>
              </section>
              <section>
                <img src="/life.jpg" alt="" className="h-85" />
              </section>
            </section>
            <section className="flex space-x-40">
              <section className="w-[34%] space-y-4 pt-20 ">
                <h1 className="text-2xl">Teams</h1>
                <p>
                  Our teams are made up of passionate professionals from diverse
                  backgrounds. From engineers to designers and customer support,
                  everyone plays a vital role. We work together to deliver safe,
                  efficient, and user-friendly ride experiences. Collaboration
                  and teamwork are at the heart of everything we do.
                </p>
              </section>
              <section>
                <img src="/team.jpg" alt="" className="h-82 w-128" />
              </section>
            </section>
            <section className="flex space-x-40 ">
              <section className="w-[34%] space-y-4 pt-18">
                <h1 className="text-2xl">Locations</h1>
                <p>
                  MyRide is expanding across cities to bring convenient travel
                  to more people. Our presence is growing, connecting riders and
                  drivers in urban and rural areas. Each location is supported
                  with dedicated local teams ensuring reliable service. No
                  matter where you are, Book Ride aims to be your trusted travel
                  partner.
                </p>
              </section>
              <section>
                <img src="/location.jpg" alt="" className="h-82" />
              </section>
            </section>
          </section>
          <section className="pl-50 pt-20 pb-20 w-[60%] space-y-4 text-left">
            <h1 className="text-4xl font-bold">
              Our Journey To Trusted Travel
            </h1>
            <p>
              MyRide has been serving travelers since 2025, starting with a
              vision to make rides simple and reliable. What began as a small
              service in one city quickly grew as more people trusted our
              platform. From the very beginning, we focused on safety,
              affordability, and convenience for every rider.
            </p>
          </section>
          <section className="pl-50 pr-50 pb-50 text-left">
            <section className="flex space-x-40">
              <section className="space-y-2">
                <h1 className="text-xl font-semibold">Ride</h1>
                <p className="pb-4">Book Ride makes every trip simple, safe, and comfortable. With
                real-time tracking and transparent pricing, you’re always in
                control.
                </p>
                <Link to="/ride" className="underline underline-offset-8 cursor-pointer">Explore</Link>
              </section>
              <section className="space-y-2">
                <h1 className="text-xl font-semibold">Driver</h1>
                <p className="pb-4">
                Our drivers are the heart of Book Ride, ensuring safe and
                reliable travel. We empower them with fair earnings, flexible
                schedules, and full support.
                </p>
                <Link to="/drive" className="underline underline-offset-8 cursor-pointer">Explore</Link>
              </section>
            </section>
          </section>
        </section>
      </div>
    </>
  );
}

export default About;
