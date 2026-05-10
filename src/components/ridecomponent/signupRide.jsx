import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/authContext";

function SignupRide({ onAuthed }) {
  const [signupType, setSignupType] = useState("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Request OTP
  const requestOtp = async () => {
    try {
      if (signupType === "email" && !email)
        return toast.error("Enter your email");
      if (signupType === "phone" && !phone)
        return toast.error("Enter your phone number");

      // Call backend endpoint for sending OTP
      await api.post("/auth/send-otp-signup", { email, phone });
      setOtpSent(true);
      toast.success("OTP sent successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send OTP");
    }
  };

  // Verify OTP and complete signup
  const handleOtpSignup = async (e) => {
  e.preventDefault();
  if (!name) return toast.error("Enter your name");
  if (!otp) return toast.error("Enter the OTP");

  try {
    const response = await api.post("/auth/verify-otp-signup", {
      name,
      email,
      phone,
      otp,
    }, { withCredentials: true });

    // store in context
    login(response.data.user);

    toast.success("Account created successfully");
    onAuthed && onAuthed();

    setTimeout(() => navigate("/ride"), 1500);
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to verify OTP");
  }
};


  return (
    <>
      <div className="pl-10 pt-5 pb-5 pr-10 flex">
        <section className="flex flex-col">
          <Link
            to="/"
            className="cursor-pointer text-3xl pl-20 font-bold text-sky-500"
          >
            MyRide
          </Link>

          <div className="pt-5 text-center space-y-1">
            <h1 className="text-2xl font-bold">Create Your Account</h1>
            <section>Let’s get started after creating your account</section>
          </div>

          <section className="pt-6 px-36 space-x-16 space-y-6">
            <form
              onSubmit={handleOtpSignup}
              className="flex flex-col space-y-6"
            >
              {/* Name */}
              <section className="space-y-2 flex flex-col">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="py-2 px-4 outline-none border rounded-3xl border-gray-400"
                />
              </section>

              {/* Email */}
              {signupType === "email" && (
                <section className="space-y-2 flex flex-col">
                  <label>Email</label>
                  <input
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-2 px-4 outline-none border rounded-3xl border-gray-400"
                  />
                </section>
              )}

              {/* Phone */}
              {signupType === "phone" && (
                <section className="space-y-2 flex flex-col">
                  <label>Phone</label>
                  <input
                    type="text"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="py-2 px-4 outline-none border rounded-3xl border-gray-400"
                  />
                </section>
              )}

              {/* OTP */}
              {!otpSent ? (
                <div
                  type="button"
                  onClick={requestOtp}
                  className="bg-black/85 text-white/90 mt-2 text-center py-2 rounded-3xl cursor-pointer"
                >
                  Send OTP
                </div>
              ) : (
                <section className="space-y-2 flex flex-col">
                  <label>OTP</label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="py-2 px-4 outline-none border rounded-3xl border-gray-400"
                  />
                </section>
              )}

              {/* Terms */}
              <section className="flex gap-2">
                <input type="checkbox" />I agree to all Terms of Services &
                Privacy Policies
              </section>

              {/* Submit */}
              <div
                onClick={handleOtpSignup}
                className="w-full text-center rounded-3xl py-2 px-4 text-white/95 bg-black/80 cursor-pointer"
              >
                Verify OTP
              </div>

              {/* Signup type selection */}
              <div className="flex mt-2 space-x-6">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={signupType === "email"}
                    onChange={() => setSignupType("email")}
                    className="hidden"
                  />
                  <span className="w-5 h-5 flex items-center justify-center">
                    {signupType === "email" ? (
                      <img
                        src="/check-mark.png"
                        alt="checked"
                        className="w-4 h-4"
                      />
                    ) : (
                      <img
                        src="/radio.png"
                        alt="unchecked"
                        className="w-4 h-4"
                      />
                    )}
                  </span>
                  <span className={signupType === "email"}>Use Email</span>
                </label>

                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={signupType === "phone"}
                    onChange={() => setSignupType("phone")}
                    className="hidden"
                  />
                  <span className="w-5 h-5 flex items-center justify-center">
                    {signupType === "phone" ? (
                      <img
                        src="/check-mark.png"
                        alt="checked"
                        className="w-4 h-4"
                      />
                    ) : (
                      <img
                        src="/radio.png"
                        alt="unchecked"
                        className="w-4 h-4"
                      />
                    )}
                  </span>
                  <span className={signupType === "phone"}>Use Phone</span>
                </label>
              </div>
            </form>
          </section>
        </section>

        {/* Right side text */}
        <div className="absolute text-white/90 space-y-6 text-center right-50 bottom-30">
          <h1 className="text-4xl font-semibold">
            Create Your Account <br /> Start your journey today
          </h1>
          <p className="text-xl ">
            Seamlessly register in minutes and unlock a world of reliable rides.
          </p>
        </div>

        <img
          src="/signup-pic.jpg"
          alt="Signup Image"
          className="w-200 h-164 rounded-t-3xl rounded-3xl object-cover"
        />
      </div>
    </>
  );
}

export default SignupRide;