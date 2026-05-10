import React from "react";
import { Link } from "react-router-dom";

function Drivepage() {
  return (
    <>
      <section className="flex flex-col items-center text-center py-24 bg-black text-white">
        <h2 className="text-5xl font-bold mb-4">Earn on your schedule</h2>
        <p className="text-lg text-gray-600 mb-6">
          Drive with MyRide and make money on your terms.
        </p>
        <Link
          to="/signupDrive"
          className="px-6 py-3 bg-white text-black rounded-lg shadow hover:bg-gray-100"
        >
          Sign up to Driver
        </Link>
      </section>

      <section className="max-w-6xl mx-auto py-20 px-6">
        <h3 className="text-3xl font-bold text-center mb-12">How it Works</h3>
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div>
            <img
              src="/signup.png"
              alt="Sign up"
              className="mx-auto mb-4 w-20 h-20"
            />
            <h4 className="text-xl font-semibold mb-2">Step 1: Sign Up</h4>
            <p className="text-gray-600">
              Register with your details and create your driver profile.
            </p>
          </div>
          <div>
            <img
              src="/upload.png"
              alt="Upload"
              className="mx-auto mb-4 w-20 h-20"
            />
            <h4 className="text-xl font-semibold mb-2">
              Step 2: Upload Documents
            </h4>
            <p className="text-gray-600">
              Upload license, ID, and vehicle documents for verification.
            </p>
          </div>
          <div>
            <img
              src="/driving.png"
              alt="Start driving"
              className="mx-auto mb-4 w-20 h-20"
            />
            <h4 className="text-xl font-semibold mb-2">
              Step 3: Start Driving
            </h4>
            <p className="text-gray-600">
              Get approved and start earning with flexible hours.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 py-20 px-6">
        <h3 className="text-3xl font-bold text-center mb-12">
          Why Drive with MyRide?
        </h3>
        <div className="grid md:grid-cols-3 gap-10 text-center max-w-6xl mx-auto">
          <div>
            <img
              src="/schedule.png"
              alt="Schedule"
              className="mx-auto mb-4 w-20 h-20"
            />
            <h4 className="text-xl font-semibold mb-2">Flexible Schedule</h4>
            <p className="text-gray-600">Work when you want, where you want.</p>
          </div>
          <div>
            <img src="/wallet.png" alt="Payments" className="mx-auto mb-4 w-20 h-20" />
            <h4 className="text-xl font-semibold mb-2">Weekly Payments</h4>
            <p className="text-gray-600">
              Get paid fast with direct deposit every week.
            </p>
          </div>
          <div>
            <img src="/support.png" alt="Payments" className="mx-auto mb-4 w-20 h-20" />
            <h4 className="text-xl font-semibold mb-2">24/7 Support</h4>
            <p className="text-gray-600">
              We’re always here to help you on the road.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Drivepage;
