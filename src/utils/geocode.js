// Geocode.js
import axios from "axios";

// Helper to combine address parts
const getFullAddress = (formData) => {
  const parts = [];
  if (formData.address) parts.push(formData.address);
  if (formData.city) parts.push(formData.city);
  if (formData.pincode) parts.push(formData.pincode);
  parts.push("India"); // Country for context
  return parts.join(", ");
};

export const getCoordinates = async (formData) => {
  try {
    const fullAddress = `${formData.address}, ${formData.city}, ${formData.pincode}`;
    console.log("Requesting coordinates for:", fullAddress);

    const res = await axios.post("http://localhost:8800/geocode", { address: fullAddress });

    if (res.data && res.data.lat && res.data.lon) {
      return [parseFloat(res.data.lat), parseFloat(res.data.lon)];
    }

    return null;
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
};