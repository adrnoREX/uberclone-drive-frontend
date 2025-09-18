import React, { useState, useEffect } from "react";
import axios from "axios";
import { LayoutDashboard, Car, Settings, LogOut, FileText } from "lucide-react";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [rideStatus, setRideStatus] = useState("No active ride");
  const [activeRide, setActiveRide] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalRides, setTotalRides] = useState(0);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    pincode: "",
    services: "",
  });

  useEffect(() => {
    if (driver) {
      setForm({
        first_name: driver.first_name || "",
        last_name: driver.last_name || "",
        email: driver.email || "",
        phone_number: driver.phone_number || "",
        address: driver.address || "",
        city: driver.city || "",
        pincode: driver.pincode || "",
        services: driver.services || "",
      });
    }
  }, [driver]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateDriver = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8800/api/driver/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // For cookies
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successfully!");
        setUser(data.driver);
      } else {
        toast.error("Update failed: " + data.error);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/api/driver/details",
          {
            withCredentials: true, // cookie token
          }
        );
        setDriver(res.data.driver);
      } catch (err) {
        console.error("Error fetching driver details:", err);
        toast.error("Failed to load driver details");
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8800/api/driver/logout",
        {},
        { withCredentials: true }
      );
      toast.success("Logged out successfully!");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  const fetchActiveRide = async () => {
    if (!driver?.id) return; // wait for driver data

    try {
      const res = await axios.get(
        `http://localhost:8800/api/rides/driver/${driver.id}`,
        { withCredentials: true }
      );

      setRides(res.data.rides || []);
      const active = res.data.rides.find((r) => r.status !== "completed");
      setActiveRide(active || null);

      const completedRides = res.data.rides.filter(
        (r) => r.status === "completed"
      );
      const earnings = completedRides.reduce(
        (sum, r) => sum + (r.fare || 0),
        0
      );
      setTotalEarnings(earnings);
      setTotalRides(res.data.rides.length);
    } catch (err) {
      console.error("Error fetching rides:", err);
      toast.error("Failed to fetch rides");
      setActiveRide(null);
      setRideStatus("No active ride");
    }
  };

  useEffect(() => {
    if (driver) fetchActiveRide();
  }, [driver]);

  const requestRide = async (ride_id) => {
    try {
      const res = await axios.put(
        "http://localhost:8800/api/rides/accept",
        { ride_id, driver_id: driver.id },
        { withCredentials: true }
      );
      setActiveRide(res.data.ride);
      setRideStatus(res.data.ride.status);
      toast.success("Ride accepted!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to accept ride");
    }
  };

  const updateRideStatus = async (newStatus) => {
    try {
      const res = await axios.put(
        "http://localhost:8800/api/rides/status",
        { ride_id: activeRide.id, status: newStatus },
        { withCredentials: true }
      );
      setRideStatus(res.data.ride.status);
      if (newStatus === "completed") setActiveRide(null);
      toast.success(`Ride ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update ride status");
    }
  };

  // Map marker icon
  const driverIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61168.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  // Sample chart data
  const chartData = rides.map((r) => ({
    date: new Date(r.created_at).toLocaleDateString(),
    earnings: r.fare || 0,
  }));

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">Driver Panel</h1>
          <p className="text-sm text-gray-500">{driver?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === "dashboard"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>

          <button
            onClick={() => setActiveTab("status")}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === "status"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Car size={18} /> Ride Status
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === "settings"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Settings size={18} /> Settings
          </button>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="flex justify-around">
              <div className="bg-white rounded-xl shadow p-6 w-1/4 text-center">
                <h3 className="text-gray-500">Total Earnings</h3>
                <p className="text-2xl font-bold text-green-600">
                  ₹{totalEarnings}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow p-6 w-1/4 text-center">
                <h3 className="text-gray-500">Total Rides</h3>
                <p className="text-2xl font-bold text-blue-600">{totalRides}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-700 mb-4">Earnings Over Time</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="earnings" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {activeRide && (
              <div
                className="bg-white rounded-xl shadow p-6"
                style={{ height: "400px" }}
              >
                <MapContainer
                  center={[
                    activeRide.pickup_lat || 28.7041,
                    activeRide.pickup_lng || 77.1025,
                  ]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <Marker
                    position={[activeRide.pickup_lat, activeRide.pickup_lng]}
                    icon={driverIcon}
                  >
                    <Popup>Pickup: {activeRide.pickup}</Popup>
                  </Marker>
                  <Marker
                    position={[activeRide.drop_lat, activeRide.drop_lng]}
                    icon={driverIcon}
                  >
                    <Popup>Drop: {activeRide.drop}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>
        )}

        {activeTab === "status" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-500" /> Ride Status
            </h2>

            {activeRide ? (
              <div className="space-y-4">
                <p>
                  <span className="font-medium">Ride ID:</span> {activeRide.id}
                </p>
                <p>
                  <span className="font-medium">Pickup:</span>{" "}
                  {activeRide.pickup}
                </p>
                <p>
                  <span className="font-medium">Drop:</span> {activeRide.drop}
                </p>
                <p>
                  <span className="font-medium">Status:</span> {rideStatus}
                </p>

                {activeRide.status === "requested" && (
                  <button
                    onClick={() => requestRide(activeRide.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Accept Ride
                  </button>
                )}

                {activeRide.status === "accepted" && (
                  <button
                    onClick={() => updateRideStatus("progress")}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                  >
                    Start Ride
                  </button>
                )}

                {activeRide.status === "progress" && (
                  <button
                    onClick={() => updateRideStatus("completed")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Complete Ride
                  </button>
                )}
              </div>
            ) : (
              <p className="text-gray-600">No active ride</p>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Update Profile
            </h2>

            <form
              onSubmit={handleUpdateDriver}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="space-y-2">
                <h1>First Name</h1>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="border border-gray-300 p-2 focus:ring-1 focus:ring-gray-400 focus:outline-none rounded w-full"
                />
              </div>
              <div className="space-y-2">
                <h1>Last Name</h1>
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="border border-gray-300 p-2 focus:ring-1 focus:ring-gray-400 focus:outline-none rounded w-full"
                />
              </div>
              <div className="space-y-2">
                <h1>Email</h1>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="border border-gray-300 p-2 focus:ring-1 focus:ring-gray-400 focus:outline-none rounded w-full"
                />
              </div>
              <div className="space-y-2">
                <h1>Contact</h1>
                <input
                  type="text"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="border border-gray-300 p-2 focus:ring-1 focus:ring-gray-400 focus:outline-none rounded w-full"
                />
              </div>
              <div className="space-y-2">
                <h1>Address</h1>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="border border-gray-300 p-2 focus:ring-1 focus:ring-gray-400 focus:outline-none rounded w-full"
                />
              </div>
              <div className="space-y-2">
                <h1>City</h1>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="border border-gray-300 p-2 focus:ring-1 focus:ring-gray-400 focus:outline-none rounded w-full"
                />
              </div>
              <div className="space-y-2">
                <h1>Pincode</h1>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  className="border border-gray-300 p-2 focus:ring-1 focus:ring-gray-400 focus:outline-none rounded w-full"
                />
              </div>
              <div className="space-y-2">
                <h1>Service</h1>
                <input
                  type="text"
                  name="services"
                  value={form.services}
                  onChange={handleChange}
                  placeholder="Service"
                  className="border border-gray-300 p-2 focus:ring-1 focus:ring-gray-400 focus:outline-none rounded w-full"
                />
              </div>

              <div className="col-span-2 mt-4 mb-4 flex justify-center">
                <button type="submit" className="px-4 py-2 border rounded">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default DriverDashboard;
