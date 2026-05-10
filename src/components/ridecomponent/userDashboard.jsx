import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LogOut,
  User,
  Calendar,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import toast from "react-hot-toast";
import { supabase } from "../../supabaseClient";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [rideStatus, setRideStatus] = useState("No active ride");

  // Subscribe to booking changes for this user
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("user-ride-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "booking",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("User ride update:", payload);
          setRideStatus(payload.new.status);
          toast.success(`Ride status updated: ${payload.new.status}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Fetch current user and rides
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/auth/me", {
          withCredentials: true,
        });
        setUser(res.data.user);

        // TODO: Replace with real rides API
        setRides([
          {
            id: 1,
            date: "2025-09-15",
            from: "Kolkata",
            to: "Delhi",
            price: "₹1200",
          },
          {
            id: 2,
            date: "2025-09-10",
            from: "Bangalore",
            to: "Hyderabad",
            price: "₹800",
          },
        ]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8800/api/auth/logout",
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b flex items-center gap-3">
          <User className="w-10 h-10 text-blue-600" />
          <div>
            <p className="font-semibold text-gray-800">{user?.email}</p>
            <p className="text-xs text-gray-500">
              Registered since {new Date(user?.created_at).toDateString()}
            </p>
          </div>
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
            onClick={() => setActiveTab("rides")}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === "rides"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Calendar size={18} /> Rides
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
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Welcome back, {user?.name || user?.email}
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white shadow rounded-xl p-5">
                <p className="text-sm text-gray-500">Total Rides</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {rides.filter((ride) => ride.status === "completed").length}
                </h3>
              </div>
              <div className="bg-white shadow rounded-xl p-5">
                <p className="text-sm text-gray-500">Total Spent</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  ₹
                  {rides
                    .filter((ride) => ride.status === "completed")
                    .reduce(
                      (sum, ride) =>
                        sum + parseInt(ride.price.replace("₹", "")),
                      0
                    )}
                </h3>
              </div>
              <div className="bg-white shadow rounded-xl p-5">
                <p className="text-sm text-gray-500">Member Since</p>
                <h3 className="text-lg font-semibold text-gray-800">
                  {new Date(user?.created_at).toLocaleDateString()}
                </h3>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Monthly Ride Overview
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={rides
                      .filter((ride) => ride.status === "completed")
                      .map((ride) => ({
                        month: new Date(ride.date).toLocaleString("default", {
                          month: "short",
                        }),
                        price: parseInt(ride.price.replace("₹", "")),
                      }))}
                  >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="price" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Ride Locations
              </h2>
              <div className="h-72 rounded-lg overflow-hidden">
                <MapContainer
                  center={[22.5726, 88.3639]} // Default: Kolkata
                  zoom={5}
                  className="h-full w-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {rides
                    .filter((ride) => ride.status === "completed")
                    .map((ride) => (
                      <Marker
                        key={ride.id}
                        position={[28.7041, 77.1025]} // TODO: replace with ride pickup/drop coords
                      >
                        <Popup>
                          {ride.pickup} → {ride.drop} <br /> {ride.price}
                        </Popup>
                      </Marker>
                    ))}
                </MapContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "rides" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" /> Ride Booking
              History
            </h2>

            {/* 🔹 Active Ride Details */}
            {rides.some((r) => r.status !== "completed") && (
              <div className="mb-6 p-4 border rounded-lg bg-blue-50">
                <h3 className="text-md font-bold text-gray-800 mb-2">
                  Active Ride
                </h3>
                {rides
                  .filter((r) => r.status !== "completed")
                  .map((ride) => (
                    <div key={ride.id} className="mb-3">
                      <p>
                        <span className="font-medium">Pickup:</span>{" "}
                        {ride.pickup}
                      </p>
                      <p>
                        <span className="font-medium">Drop:</span> {ride.drop}
                      </p>
                      <p>
                        <span className="font-medium">Driver:</span>{" "}
                        {ride.driver_name || "Assigning..."}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        <span className="capitalize">{ride.status}</span>
                      </p>
                    </div>
                  ))}
              </div>
            )}

            {/* 🔹 Ride History */}
            {rides.length === 0 ? (
              <p className="text-gray-500 text-sm">No rides booked yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">From</th>
                      <th className="px-4 py-3">To</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rides.map((ride) => (
                      <tr key={ride.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{ride.date}</td>
                        <td className="px-4 py-3">{ride.pickup}</td>
                        <td className="px-4 py-3">{ride.drop}</td>
                        <td className="px-4 py-3 font-medium">{ride.price}</td>
                        <td className="px-4 py-3 capitalize">{ride.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-xl shadow p-6 max-w-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Account Settings
            </h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await axios.put(
                    "http://localhost:8800/api/auth/update",
                    { name: user.name, email: user.email },
                    { withCredentials: true }
                  );
                  toast.success("Profile updated successfully!");
                  setUser((prev) => ({ ...prev, ...res.data.user }));
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to update profile");
                }
              }}
              className="space-y-4"
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={user?.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                className="cursor-pointer px-4 py-2 rounded-lg shadow"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
