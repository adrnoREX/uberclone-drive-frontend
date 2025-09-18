import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api";

const categories = [
  { name: "MyRide AutoRickshaw" },
  { name: "MyRide Taxi (4-Seater)" },
  { name: "MyRide Taxi (6-Seater)" },
  { name: "MyRide Reservation Car" },
  { name: "MyRide Intercity" },
  { name: "MyRide Bike" },
  { name: "MyRide Assist (Handicap Accessible)" },
  { name: "MyRide Share" },
  { name: "MyRide Traveller (14–16 Seater)" },
];

const languages = [
  { code: "en_US", name: "English (US)" },
  { code: "ar_SA", name: "Arabic (SA)" },
  { code: "de_DE", name: "German (GE)" },
  { code: "fr_FR", name: "French (FR)" },
  { code: "it_IT", name: "Italian (IT)" },
  { code: "ja_JP", name: "Japanese (JP)" },
  { code: "ko_KR", name: "Korean (KR)" },
  { code: "ms_MY", name: "Malay (MY)" },
  { code: "nl_NL", name: "Dutch (NL)" },
  { code: "pt_BR", name: "Portuguese (BR)" },
  { code: "ru_RU", name: "Russian (RU)" },
  { code: "sv_SE", name: "Swedish (SE)" },
  { code: "th_TH", name: "Thai (TH)" },
  { code: "tl_PH", name: "Tagalog (PH)" },
  { code: "zh_CN", name: "Chinese (CN)" },
  { code: "zh_TW", name: "Chinese (TW)" },
];

function SignupDrive() {
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);

  const [formData, setFormData] = useState({
    language: "",
    services: "",
    profile_picture: null,
    profile_picturePreview: null,
    aadhar_card_pic: null,
    aadhar_card_picPreview: null,
    driving_license_pic: null,
    driving_license_picPreview: null,
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    pincode: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
        [`${name}Preview`]: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    const loadingToastId = toast.loading("Submitting...");

    try {

      const payload = new FormData();
      payload.append("first_name", formData.first_name);
      payload.append("last_name", formData.last_name);
      payload.append("email", formData.email);
      payload.append("phone_number", formData.phone_number);
      payload.append("address", formData.address);
      payload.append("city", formData.city);
      payload.append("pincode", formData.pincode);
      payload.append("language", formData.language);
      payload.append("services", formData.services);

      if (formData.profile_picture)
        payload.append("profile_picture", formData.profile_picture);
      if (formData.aadhar_card_pic)
        payload.append("aadhar_card_pic", formData.aadhar_card_pic);
      if (formData.driving_license_pic)
        payload.append("driving_license_pic", formData.driving_license_pic);

      const res = await api.post("/driver/signupDrive", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Signup successful", { id: loadingToastId });

      // Reset Form
      setFormData({
        language: "",
        services: "",
        profile_picture: null,
        profile_picturePreview: null,
        aadhar_card_pic: null,
        aadhar_card_picPreview: null,
        driving_license_pic: null,
        driving_license_picPreview: null,
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
        city: "",
        pincode: "",
      });

      // Reset step to 1
      setStep(1);
      setMaxStep(1);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", { id: loadingToastId });
    }
  };

  const nextStep = () => {
    setStep((prev) => {
      const newStep = Math.min(prev + 1, 5);
      setMaxStep((prevMax) => Math.max(prevMax, newStep));
      return newStep;
    });
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <Link
        to="/"
        className="text-3xl sm:pl-32 pt-6 absolute inset-0 bottom-25 bg-black/20 cursor-default font-bold text-sky-500"
      >
        MyRide
      </Link>
      <img src="/drive-pic.jpg" alt="" className="object-cover h-150 w-full " />
      <section className="absolute bottom-34 text-white/90 font-semibold left-[38%] text-5xl">
        Signup For Drive
      </section>

      <div className="pl-10 pt-10 pb-5 pr-6">
        {/* Form Under Sections */}
        <div className="mt-6 mb-12 flex justify-center">
          <div className=" rounded-xl py-6 px-8 w-[500px] h-[320px] shadow-2xl border-r border-l border-t border-gray-200 flex flex-col justify-between">
            {/* Step 2 */}
            {step === 2 && (
              <div className="">
                <h2 className="text-lg font-semibold mb-2">Profile Picture</h2>
                <input
                  type="file"
                  name="profile_picture"
                  accept="image/*"
                  onChange={handleChange}
                  className="border border-gray-200 mb-2 file:p-2 rounded-md file:bg-gray-200"
                />
                <div className="w-full h-36">
                  {formData.profile_picture && (
                    <div className="space-y-2">
                      <p>{formData.profile_picture.name}</p>
                      <img
                        src={formData.profile_picturePreview}
                        alt="Preview"
                        className="h-24 rounded-md object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="px-8 py-2 border border-gray-300 rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-4 py-2 border border-gray-300 rounded-lg ml-auto"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Aadhar Card</h2>
                <input
                  type="file"
                  name="aadhar_card_pic"
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  className="border-gray-200 border mb-2 file:bg-gray-200 rounded-md file:p-2"
                />
                <div className="w-full h-36">
                  {formData.aadhar_card_pic && (
                    <div className="space-y-2">
                      <p>{formData.aadhar_card_pic.name}</p>
                      {formData.aadhar_card_pic.type.startsWith("image/") ? (
                        <img
                          src={formData.aadhar_card_picPreview}
                          alt="Preview"
                          className="h-24 rounded-md object-cover"
                        />
                      ) : (
                        <iframe
                          src={formData.aadhar_card_picPreview}
                          title="PDF Preview"
                          className="h-24 rounded-md object-cover"
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="px-8 py-2 border border-gray-300 rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-4 py-2 border border-gray-300 rounded-lg ml-auto"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Driving License</h2>
                <input
                  type="file"
                  name="driving_license_pic"
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  className="border-gray-200 border mb-2 file:bg-gray-200 rounded-md file:p-2"
                />
                <div className="w-full h-36">
                  {formData.driving_license_pic && (
                    <div className="space-y-2">
                      <p>{formData.driving_license_pic.name}</p>
                      {formData.driving_license_pic.type.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={formData.driving_license_picPreview}
                          alt="Preview"
                          className="h-24 rounded-md object-cover"
                        />
                      ) : (
                        <iframe
                          src={formData.driving_license_picPreview}
                          title="PDF Preview"
                          className="h-24 rounded-md object-cover"
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="px-8 py-2 border border-gray-300 rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-4 py-2 border border-gray-300 rounded-lg ml-auto"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Personal Details</h2>
                <div className="h-24">
                  <section className="flex gap-4">
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First Name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="border border-gray-400 py-2 px-4 rounded-md mb-4 w-1/2"
                    />
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last Name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="border border-gray-400 py-2 px-4 rounded-md mb-4 w-1/2"
                    />
                  </section>
                  <section className="flex gap-4">
                    <input
                      type="text"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border border-gray-400 py-2 px-4 rounded-md mb-4 w-1/2"
                    />
                    <input
                      type="text"
                      name="phone_number"
                      placeholder="Phone Number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="border border-gray-400 py-2 px-4 rounded-md mb-4 w-1/2"
                    />
                  </section>
                  <section className="flex gap-4">
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleChange}
                      className="border border-gray-400 py-2 px-4 rounded-md mb-4 w-1/3"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      className="border border-gray-400 py-2 px-4 rounded-md mb-4 w-1/3"
                    />
                    <input
                      type="number"
                      name="pincode"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="border border-gray-400 py-2 px-4 rounded-md mb-4 w-1/3"
                    />
                  </section>
                </div>
                <div className="flex justify-between mt-24">
                  <button
                    onClick={prevStep}
                    className="px-8 py-2 border border-gray-300 rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 border border-gray-300 rounded-lg ml-auto"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-2">
                  Selection of Car & Language
                </h2>

                <label>Services</label>
                <select
                  name="services"
                  value={formData.services}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 mt-2 rounded-md w-full"
                >
                  <option value="" disabled>
                    Select your service
                  </option>
                  {categories.map((cat) => (
                    <option>{cat.name}</option>
                  ))}
                </select>

                <label>Language</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 mt-2 rounded-md w-full"
                >
                  <option value="" disabled>
                    Select the language
                  </option>
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>

                <div className="flex justify-between mt-4">
                  {step > 1 && (
                    <button
                      onClick={prevStep}
                      className="px-8 py-2 border border-gray-300 rounded-lg"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={nextStep}
                    className="px-4 py-2 border border-gray-300 rounded-lg ml-auto"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-6 text-center justify-center">
          {[
            "Car and Language ",
            "Profile Picture",
            "Aadhar Card",
            "Driving License",
            "Personal Details",
          ].map((label, index) => {
            const stepNumber = index + 1;
            const isActive = step === stepNumber;
            const isUnlocked = stepNumber <= maxStep;

            return (
              <section
                key={index}
                onClick={() => isUnlocked && setStep(stepNumber)}
                className={`w-44 py-2 rounded-3xl ${
                  isActive
                    ? "bg-black/90 text-white/80  cursor-pointer"
                    : isUnlocked
                    ? "border border-gray-800"
                    : "border border-gray-400 bg-gray-50 text-gray-400 cursor-not-allowed"
                }`}
              >
                {label}
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default SignupDrive;
