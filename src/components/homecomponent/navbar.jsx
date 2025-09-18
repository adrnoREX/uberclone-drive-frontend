import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Login from "../login";
import { useAuth } from "../../context/authContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [signupDropdown, setSignupDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const { user, loading, logout } = useAuth();

  

  return (
    <>
      <div className="flex fixed mb-50 z-20 font-semibold bg-white sm:w-full w-103 sm:space-x-[50%] space-x-20 sm:justify-normal justify-between pt-6 p-4">
        <h1 className="text-3xl sm:pl-30 cursor-default font-bold text-sky-500">
          MyRide
        </h1>
        <div className="space-x-8 cursor-pointer text-sky-400">
          <div className="sm:flex space-x-8 hidden">
            <Link to="/ride">Ride</Link>
            <Link to="/drive">Drive</Link>
            <Link to="/services">Services</Link>
            <Link to="/about">About</Link>

            {!user ? (
              <>
                <section onClick={() => setShowLogin(true)}>Log in</section>

                <div className="relative">
                  <section onClick={() => setSignupDropdown(!signupDropdown)}>
                    Sign up
                  </section>
                  {signupDropdown && (
                    <div className="absolute flex flex-col w-50 text-lg right-1 mt-2 bg-white shadow-md rounded p-6 space-y-2 text-sky-400">
                      <Link
                        to="/signupRide"
                        onClick={() => setSignupDropdown(false)}
                        className="flex space-x-24"
                      >
                        <div>Ride</div>
                        <img src="/car.png" alt="" className="w-5 h-5 mt-1" />
                      </Link>
                      <Link
                        to="/signupDrive"
                        onClick={() => setSignupDropdown(false)}
                        className="flex space-x-23"
                      >
                        <div>Drive</div>
                        <img
                          src="/steering-wheel.png"
                          alt=""
                          className="w-4 h-4 mt-1"
                        />
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Profile with dropdown
              <div className="relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setProfileDropdown(!profileDropdown)}
                >
                  {user.profileImage || user.profile_picture ? (
                    <img
                      src={user.profileImage}
                      alt="profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center mx-8 -mt-1 justify-center rounded-full bg-sky-500 text-white font-bold">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                {profileDropdown && (
                  <div className="absolute right-8 mt-2 bg-white shadow-md rounded w-40 p-4 flex flex-col space-y-2 text-sky-400">
                    {user.role === "driver" ? (
                      <Link
                        to="/driverDashboard"
                        onClick={() => setProfileDropdown(false)}
                        className="flex gap-15"
                      >
                        Profile
                        <img src="/user.png" alt="" className="w-5 h-5" />
                      </Link>
                    ) : (
                      <Link
                        to="/userDashboard"
                        onClick={() => setProfileDropdown(false)}
                        className="flex gap-15"
                      >
                        Profile
                        <img src="/user.png" alt="" className="w-5 h-5" />
                      </Link>
                    )}

                    <div
                      onClick={() => {
                        logout();
                        setProfileDropdown(false);
                      }}
                      className="text-left flex gap-14"
                    >
                      Logout
                      <img src="/logout.png" alt="" className="w-5 h-5 mt-1" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            className="sm:hidden flex cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            {open ? <FaTimes size={24} /> : <FaBars size={24} />}
          </div>
        </div>
      </div>

      {open && (
        <div className="sm:hidden flex flex-col bg-gray-500 text-sky-400 sm:relative absolute top-16 left-0 w-103 p-4 space-y-4 z-10">
          <Link to="/ride" onClick={() => setOpen(false)}>
            Ride
          </Link>
          <section onClick={() => setOpen(false)}>Drive</section>
          <Link to="/about">About</Link>

          {!user ? (
            <>
              <section
                onClick={() => {
                  setShowLogin(true);
                  setOpen(false);
                }}
              >
                Log in
              </section>

              <div>
                <section onClick={() => setSignupDropdown(!signupDropdown)}>
                  Sign up
                </section>
                {signupDropdown && (
                  <div className="flex flex-col bg-white text-black mt-2 rounded shadow-md p-2 space-y-2">
                    <Link
                      to="/signup/ride"
                      onClick={() => {
                        setSignupDropdown(false);
                        setOpen(false);
                      }}
                    >
                      Ride
                    </Link>
                    <Link
                      to="/signup/drive"
                      onClick={() => {
                        setSignupDropdown(false);
                        setOpen(false);
                      }}
                    >
                      Drive
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Mobile profile with dropdown
            <div className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setProfileDropdown(!profileDropdown)}
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-500 text-white font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>

              {profileDropdown && (
                <div className="absolute left-0 mt-2 bg-white shadow-md rounded p-4 flex flex-col space-y-2 text-sky-500">
                  <Link
                    to="/profile"
                    onClick={() => {
                      setProfileDropdown(false);
                      setOpen(false);
                    }}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdown(false);
                      setOpen(false);
                    }}
                    className="text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          setShowSignup={setShowSignup}
          onAuthed={() => {}}
        />
      )}
    </>
  );
}

export default Navbar;
