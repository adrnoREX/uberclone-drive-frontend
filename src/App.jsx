import react from "react";
import { Toaster } from "react-hot-toast";
import Homecomponent from "./components/homecomponent/homecomponent";
import { Route, Router, Routes } from "react-router-dom";
import Ridecomponent from "./components/ridecomponent/ridecomponent";
import Drivecomponent from "./components/drivecomponent/drivecomponent";
import Services from "./components/services";
import Aboutcomponent from "./components/aboutcomponent/aboutcomponent";
import Login from "./components/login";
import Signup from "./components/ridecomponent/signupRide";
import SignupDrive from "./components/drivecomponent/signupDrive";
import SignupRide from "./components/ridecomponent/signupRide";
import DriverDashboard from "./components/drivecomponent/driverDashboard";
import UserDashboard from "./components/ridecomponent/userDashboard";

function App() {
  return (
    <>
      
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "white", 
              color: "black",
              padding: "12px 25px",
              borderRadius: "8px",
              border: "1px",
              fontSize: "14px",
              textAlign: "left",
            },
            success: {
              iconTheme: {
                primary: "black",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#f87171", 
                secondary: "#fff",
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Homecomponent />} />
          <Route path="/services" element={<Services />} />
          <Route path="/ride" element={<Ridecomponent />} />
          <Route path="/drive" element={<Drivecomponent />} />
          <Route path="/about" element={<Aboutcomponent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signupRide" element={<SignupRide />} />
          <Route path="/signupDrive" element={<SignupDrive />} />
          <Route path="/driverDashboard" element={<DriverDashboard />} />
          <Route path="/userDashboard" element={<UserDashboard />} />
        </Routes>
      
    </>
  );
}

export default App;
