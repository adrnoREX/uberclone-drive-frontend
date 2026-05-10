import React, { useState } from "react";
import { Menu, X, Home, User, Car, Settings, LogOut } from "lucide-react";

const DriverDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg flex flex-col transition-all duration-300`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1
            className={`text-xl font-bold text-blue-600 ${
              !sidebarOpen && "hidden"
            }`}
          >
            Driver Panel
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-4">
          <SidebarItem icon={<Home />} label="Dashboard" open={sidebarOpen} />
          <SidebarItem icon={<User />} label="Profile" open={sidebarOpen} />
          <SidebarItem icon={<Car />} label="My Rides" open={sidebarOpen} />
          <SidebarItem icon={<Settings />} label="Settings" open={sidebarOpen} />
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <SidebarItem icon={<LogOut />} label="Logout" open={sidebarOpen} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome Back, Driver 🚖
        </h2>

        {/* Example content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Rides" value="120" />
          <StatCard title="Earnings" value="₹45,000" />
          <StatCard title="Rating" value="4.8 ⭐" />
        </div>

        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Recent Rides</h3>
          <ul className="space-y-3">
            <li className="flex justify-between border-b pb-2">
              <span>Ride #101 - Airport Drop</span>
              <span className="text-green-600">₹450</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span>Ride #102 - City Center</span>
              <span className="text-green-600">₹220</span>
            </li>
            <li className="flex justify-between">
              <span>Ride #103 - Station Pickup</span>
              <span className="text-green-600">₹300</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, open }) => (
  <div className="flex items-center space-x-3 text-gray-700 hover:bg-blue-50 p-2 rounded-lg cursor-pointer">
    {icon}
    {open && <span>{label}</span>}
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-md text-center">
    <h4 className="text-gray-500">{title}</h4>
    <p className="text-2xl font-bold text-blue-600 mt-2">{value}</p>
  </div>
);

export default DriverDashboard;