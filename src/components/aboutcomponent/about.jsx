import React from "react";
import { Link } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./navbar";

function About() {
  return (
    <>
      <div className="overflow-hidden relative">
        <section className="relative  text-center items-center">
          <img
            src="/first.jpg"
            alt=""
            className="w-full  h-168 pt-20 object-cover opacity-90"
          />
          <section className="absolute flex flex-col items-center text-center justify-center top-90 sm:top-110 md:top-110 lg:top-124 left-0 space-y-4 text-white/95 w-100 sm:w-full md:mx-auto md:px-20">
            <h1 className="text-3xl font-bold">About Us</h1>
            <p className="text-[90%] w-1/2 ">
              We created MyRide to make traveling simpler, smarter, and more
              reliable. Our mission is to connect riders with safe and
              affordable rides anytime, anywhere. With just a few taps, you can
              book, track, and enjoy your journey without hassle. We believe
              every ride should be comfortable, convenient, and stress-free.
            </p>
          </section>
          <section className="container flex flex-col items-center sm:items-start justify-start text-center sm:text-start pt-20 w-full px-20 md:px-40 pb-20 space-y-8">
            <h1 className="text-5xl font-bold text-gray-700">
              Your Journey, <br /> Our Commitment
            </h1>
            <p className="lg:w-1/2">
              At MyRide, we believe traveling should be easy, reliable, and
              stress-free. Our platform is designed to connect you with trusted
              drivers in just a few clicks. Whether it’s a quick city ride or a
              long trip, we ensure safety and comfort every time. With
              transparent pricing and real-time tracking, you’re always in
              control of your journey. We’re here to redefine the way you move,
              making every ride smooth and memorable.
            </p>
          </section>
          <section className="bg-green-500/80 pt-40 flex flex-col text-white/85 space-y-40 px-20 md:px-12 lg:px-30 xl:px-50 pb-40 items-center justify-center md:text-left w-full">
            <section className="flex flex-col md:flex-row justify-between items-center gap-10">
              <section className="md:w-[34%] space-y-4 pt-10">
                <h1 className="text-2xl">Life</h1>
                <p>
                  Life at MyRide is all about innovation, collaboration, and
                  growth. We foster a culture where creativity meets technology
                  to make travel seamless. Every team member is encouraged to
                  share ideas and build meaningful solutions. Work here is
                  exciting, dynamic, and focused on making a real-world impact.
                </p>
              </section>
              <section className="pt-0 md:pt-10 lg:pt-0">
                <img src="/life.jpg" alt="" className="w-120 object-cover" />
              </section>
            </section>
            <section className="flex flex-col md:flex-row justify-between items-center gap-10">
              <section className="md:w-[34%] space-y-4 pt-10">
                <h1 className="text-2xl">Teams</h1>
                <p>
                  Our teams are made up of passionate professionals from diverse
                  backgrounds. From engineers to designers and customer support,
                  everyone plays a vital role. We work together to deliver safe,
                  efficient, and user-friendly ride experiences. Collaboration
                  and teamwork are at the heart of everything we do.
                </p>
              </section>
              <section className="pt-0 md:pt-10 lg:pt-0">
                <img src="/team.jpg" alt="" className="w-120 object-cover" />
              </section>
            </section>
            <section className="flex flex-col md:flex-row justify-between items-center gap-10">
              <section className="md:w-[34%] space-y-4 pt-10">
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
              <section className="pt-0 md:pt-10 lg:pt-0">
                <img src="/location.jpg" alt="" className="w-120 object-cover" />
              </section>
            </section>
          </section>
          <section className="flex flex-col px-20 lg:px-30 xl:px-40 w-full pt-20 pb-20 space-y-4 text-center items-center md:items-start md:text-start">
            <h1 className="text-4xl font-bold">
              Our Journey To Trusted Travel
            </h1>
            <p className="md:w-3/5">
              MyRide has been serving travelers since 2025, starting with a
              vision to make rides simple and reliable. What began as a small
              service in one city quickly grew as more people trusted our
              platform. From the very beginning, we focused on safety,
              affordability, and convenience for every rider.
            </p>
          </section>
          <section className="flex px-20 lg:px-30 xl:px-40 pb-50 text-left">
            <section className="flex flex-col items-center text-center md:text-start md:items-start md:flex-row justify-between space-y-15 md:space-y-0 md:gap-x-40">
              <section className="space-y-2 lg:w-2/4 xl:w-2/6">
                <h1 className="text-xl font-semibold">Ride</h1>
                <p className="pb-4">Book Ride makes every trip simple, safe, and comfortable. With
                real-time tracking and transparent pricing, you’re always in
                control.
                </p>
                <Link to="/ride" className="underline underline-offset-8 cursor-pointer">Explore</Link>
              </section>
              <section className="space-y-2 lg:w-2/4 xl:w-2/6 ">
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
