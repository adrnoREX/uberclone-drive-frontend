import React, { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Login = ({ setShowLogin, setShowSignup, onAuthed }) => {
  const [loginType, setLoginType] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [role, setRole] = useState("user"); // NEW: "user" or "driver"
  const { login } = useAuth();

  // Request OTP
  const requestOtp = async () => {
    try {
      if (loginType === "email" && !email)
        return toast.error("Enter your email");
      if (loginType === "phone" && !phone)
        return toast.error("Enter your phone number");

      await api.post(
        role === "driver" ? "/driver/send-otp-driver" : "/auth/send-otp-login",
        { email, phone },
        { withCredentials: true }
      );
      setOtpSent(true);
      toast.success("OTP sent successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send OTP");
    }
  };

  // Verify OTP
  const handleOtpLogin = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Enter the OTP");

    try {
      await login({ email, phone, otp, role }); // send credentials to context login
      toast.success(
        `${role === "driver" ? "Driver" : "User"} logged in successfully`
      );
      setShowLogin(false);
      onAuthed && onAuthed();
     
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to verify OTP");
    }
  };

  const switchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  return (
    <div className="fixed inset-0 pt-20 pb-20 pl-80 pr-60 z-[10000] bg-black/60">
      <div className="bg-white flex space-x-10 w-192 h-full p-7 rounded-2xl shadow-md">
        {/* Left video section */}
        <div className="relative w-85 h-full">
          <div className="absolute w-85 h-full px-4 pt-90 text-center inset-ring backdrop-blur-sm text-white/95">
            <h1 className="font-semibold">
              Welcome to the MyRide {role === "driver" ? "Driver" : "User"}{" "}
              Portal
            </h1>
            <p className="font-light">
              {role === "driver"
                ? "Drive with us and earn on every ride. Login to continue."
                : "Your gateway to quick and easy rides. Sign in to continue your journey."}
            </p>
          </div>
          <video
            src="/login-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-150 h-full object-cover"
          ></video>
        </div>

        {/* Right form section */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-4 text-left">
            {role === "driver" ? "Driver Login" : "User Login"}
          </h2>
          <button
            onClick={() => setShowLogin(false)}
            className="absolute mx-72 top-22 right-42 text-gray-500 hover:text-gray-700 font-bold"
          >
            ✕
          </button>

          {/* Role selection (User/Driver) */}
          <div className="flex mb-4 mt-2 space-x-6">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={role === "user"}
                onChange={() => setRole("user")}
                className="hidden"
              />
              <span className="w-5 h-5 flex items-center justify-center">
                {role === "user" ? (
                  <img
                    src="/check-mark.png"
                    alt="checked"
                    className="w-4 h-4"
                  />
                ) : (
                  <img src="/radio.png" alt="unchecked" className="w-4 h-4" />
                )}
              </span>
              <span>User Login</span>
            </label>

            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={role === "driver"}
                onChange={() => setRole("driver")}
                className="hidden"
              />
              <span className="w-5 h-5 flex items-center justify-center">
                {role === "driver" ? (
                  <img
                    src="/check-mark.png"
                    alt="checked"
                    className="w-4 h-4"
                  />
                ) : (
                  <img src="/radio.png" alt="unchecked" className="w-4 h-4" />
                )}
              </span>
              <span>Driver Login</span>
            </label>
          </div>

          <form
            onSubmit={handleOtpLogin}
            className="flex flex-col cursor-pointer space-y-2 w-80"
          >
            {/* Email or Phone */}
            {loginType === "email" && (
              <>
                <label>Email</label>
                <input
                  className="border border-gray-500 outline-none py-2 px-4 rounded-3xl"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </>
            )}

            {loginType === "phone" && (
              <>
                <label>Phone</label>
                <input
                  className="border border-gray-500 outline-none py-2 px-4 rounded-3xl"
                  value={phone}
                  placeholder="Enter your phone number"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </>
            )}

            {/* OTP input */}
            {!otpSent ? (
              <div
                onClick={requestOtp}
                className="bg-black text-white mt-2 text-center py-2 rounded-3xl"
              >
                Send OTP
              </div>
            ) : (
              <>
                <label>OTP</label>
                <input
                  className="border-2 border-gray-500 outline-none py-2 px-4 rounded-3xl"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </>
            )}

            {/* Verify OTP button */}
            <div
              onClick={handleOtpLogin}
              className="bg-black  text-white mt-2 text-center py-2 rounded-3xl"
            >
              Verify OTP
            </div>

            {/* Switch to Signup */}
            {role === "user" ? (
              <div className="flex mt-2">
                Create an account?
                <Link
                  to="/signupRide"
                  onClick={switchToSignup}
                  className="text-blue-500 mx-1 cursor-pointer hover:underline underline-offset-2"
                >
                  Signup
                </Link>
              </div>
            ) : (
              <div className="flex mt-2">
                Create an account?
                <Link
                  to="/signupDrive"
                  onClick={switchToSignup}
                  className="text-blue-500 mx-1 cursor-pointer hover:underline underline-offset-2"
                >
                  Signup
                </Link>
              </div>
            )}

            {/* Login type selection */}
            <div className="flex mt-2 space-x-6">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={loginType === "email"}
                  onChange={() => setLoginType("email")}
                  className="hidden"
                />
                <span className="w-5 h-5 flex items-center justify-center">
                  {loginType === "email" ? (
                    <img
                      src="/check-mark.png"
                      alt="checked"
                      className="w-4 h-4"
                    />
                  ) : (
                    <img src="/radio.png" alt="unchecked" className="w-4 h-4" />
                  )}
                </span>
                <span>Use Email</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={loginType === "phone"}
                  onChange={() => setLoginType("phone")}
                  className="hidden"
                />
                <span className="w-5 h-5 flex items-center justify-center">
                  {loginType === "phone" ? (
                    <img
                      src="/check-mark.png"
                      alt="checked"
                      className="w-4 h-4"
                    />
                  ) : (
                    <img src="/radio.png" alt="unchecked" className="w-4 h-4" />
                  )}
                </span>
                <span>Use Phone</span>
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
