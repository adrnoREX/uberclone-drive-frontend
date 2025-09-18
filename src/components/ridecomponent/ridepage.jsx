import React, { useState, useEffect, useRef } from "react";
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, ArrowRightLeft, Search } from "lucide-react";
import { services } from "../services";
import { loadStripe } from "@stripe/stripe-js";
import api from "../../api";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import greenPin from "../../assets/greenPin.png";
import redPin from "../../assets/redPin.png";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useAuth } from "../../context/authContext";
import { supabase } from "../../supabaseClient";


function RidePage() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({ pickup: null, drop: null });
  const routeRef = useRef(null);
  const pickupRef = useRef(null);
  const dropRef = useRef(null);

  const { user } = useAuth();
  const isLoggedIn = !!user;
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [pickupCoord, setPickupCoord] = useState(null);
  const [dropCoord, setDropCoord] = useState(null);
  const [showServices, setShowServices] = useState(false);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [rideUpdates, setRideUpdates] = useState(null);

  const pickupTimer = useRef(null);
  const dropTimer = useRef(null);

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

  // Map icons
  const greenIcon = new Leaflet.Icon({
    iconUrl: greenPin,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [35, 35],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowSize: [32, 32],
  });

  const redIcon = new Leaflet.Icon({
    iconUrl: redPin,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [35, 35],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowSize: [32, 32],
  });

  

  // Distance (km)
  const distanceKm = (c1, c2) => {
    if (!c1 || !c2) return 0;
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(c2.lat - c1.lat);
    const dLon = toRad(c2.lon - c1.lon);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(c1.lat)) *
        Math.cos(toRad(c2.lat)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Estimate time 
  const estimateTime = (km, speedKmh = 30) =>
    km > 0 ? (km / speedKmh) * 60 : 0;

  // Filter services
  const pickServicesForDistance = (km) => {
    const mapping = [
      { key: "Bike", max: 5 },
      { key: "AutoRickshaw", max: 5 },
      { key: "Taxi (4-Seater)", max: 20 },
      { key: "Taxi (6-Seater)", max: 40 },
      { key: "Reservation", max: 1000 },
      { key: "Intercity", min: 20 },
      { key: "Traveller", min: 15 },
      { key: "Share", max: 20 },
      { key: "Assist", max: 50 },
    ];
    const chosen = services.filter((svc) => {
      const title = svc.title.toLowerCase();
      let keep = false;
      for (const rule of mapping) {
        if (!title.includes(rule.key.toLowerCase())) continue;
        if (rule.min !== undefined && km >= rule.min) keep = true;
        if (rule.max !== undefined && km <= rule.max) keep = true;
      }
      if (
        !keep &&
        km <= 8 &&
        (title.includes("taxi") ||
          title.includes("auto") ||
          title.includes("bike"))
      )
        keep = true;
      return keep;
    });
    return chosen.length > 0 ? chosen : services.slice(0, 4);
  };

  // fetch suggestions 
  const fetchSuggestions = async (query, setSuggestions) => {
    if (!query) return setSuggestions([]);
    const API_KEY = import.meta.env.VITE_AUTOCOMPLETE_GEOAPIFY_KEY;
    if (!API_KEY) return console.error("Geoapify API key missing!");
    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query
        )}&limit=6&lang=en&apiKey=${API_KEY}`
      );
      const data = await res.json();
      const items =
        data.features?.map((f) => ({
          label: f.properties.formatted,
          lat: f.properties.lat,
          lon: f.properties.lon,
        })) || [];
      setSuggestions(items);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    }
  };

  // fetch route
  const fetchRoute = async (pickupCoord, dropCoord) => {
    if (!pickupCoord || !dropCoord) return [];
    const API_KEY = import.meta.env.VITE_ROUTING_GEOAPIFY_KEY;
    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${pickupCoord.lat},${pickupCoord.lon}|${dropCoord.lat},${dropCoord.lon}&mode=drive&apiKey=${API_KEY}`
      );
      const data = await res.json();
      return (
        data.features?.[0].geometry.coordinates.map(([lon, lat]) => [
          lat,
          lon,
        ]) || []
      );
    } catch (err) {
      console.error("Error fetching route:", err);
      return [];
    }
  };

  // Map updater
  useEffect(() => {
    const updateMap = async () => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // clear old route
      if (routeRef.current) {
        map.removeLayer(routeRef.current);
        routeRef.current = null;
      }

      // clear old markers
      Object.values(markersRef.current).forEach((m) => {
        if (m) map.removeLayer(m);
      });
      markersRef.current = { pickup: null, drop: null };

      // pickup marker
      if (pickupCoord) {
        markersRef.current.pickup = Leaflet.marker(
          [pickupCoord.lat, pickupCoord.lon],
          { icon: redIcon }
        )
          .addTo(map)
          .bindPopup("Pickup");
      }

      // drop marker
      if (dropCoord) {
        markersRef.current.drop = Leaflet.marker(
          [dropCoord.lat, dropCoord.lon],
          { icon: greenIcon }
        )
          .addTo(map)
          .bindPopup("Drop");
      }

      // route
      if (pickupCoord && dropCoord) {
        // remove old routing control if exists
        if (routeRef.current) {
          map.removeControl(routeRef.current);
          routeRef.current = null;
        }

        routeRef.current = Leaflet.Routing.control({
          waypoints: [
            Leaflet.latLng(pickupCoord.lat, pickupCoord.lon),
            Leaflet.latLng(dropCoord.lat, dropCoord.lon),
          ],
          routeWhileDragging: false,
          show: false,
          addWaypoints: false,
          draggableWaypoints: false,
          createMarker: (i, wp) => {
            return Leaflet.marker(wp.latLng, {
              icon: i === 0 ? redIcon : greenIcon, // pickup red, drop green
            });
          },
          lineOptions: {
            styles: [
              { color: "blue", weight: 4, opacity: 1 },
              { color: "orange", weight: 5, opacity: 1, dashArray: "8, 8" },
            ],
          },
        }).addTo(map);

        setFilteredServices(
          pickServicesForDistance(distanceKm(pickupCoord, dropCoord))
        );
      } else {
        setFilteredServices([]);
      }
    };
    updateMap();
  }, [pickupCoord, dropCoord]);

  // Debounced search 
  useEffect(() => {
    clearTimeout(pickupTimer.current);
    if (pickup)
      pickupTimer.current = setTimeout(
        () => fetchSuggestions(pickup, setPickupSuggestions),
        300
      );
    else setPickupSuggestions([]);
    return () => clearTimeout(pickupTimer.current);
  }, [pickup]);

  useEffect(() => {
    clearTimeout(dropTimer.current);
    if (drop)
      dropTimer.current = setTimeout(
        () => fetchSuggestions(drop, setDropSuggestions),
        300
      );
    else setDropSuggestions([]);
    return () => clearTimeout(dropTimer.current);
  }, [drop]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickupRef.current && !pickupRef.current.contains(e.target))
        setPickupSuggestions([]);
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropSuggestions([]);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //Initialize map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = Leaflet.map(mapRef.current, {
        zoomControl: true,
      }).setView([22.5726, 88.3639], 13);
      Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
      setTimeout(() => mapInstanceRef.current.invalidateSize(), 200);
    }
  }, []);

  // Suggestion select
  const selectSuggestion = (sugg, type) => {
    if (!sugg) return;
    if (type === "pickup") {
      setPickup(sugg.label);
      setPickupCoord({ lat: +sugg.lat, lon: +sugg.lon });
      setPickupSuggestions([]);
    } else {
      setDrop(sugg.label);
      setDropCoord({ lat: +sugg.lat, lon: +sugg.lon });
      setDropSuggestions([]);
    }
  };

  // Price calculator
  const calculatePrice = (service, km) => {
    const t = service.title.toLowerCase();
    if (t.includes("bike")) return Math.max(40, km * 12);
    if (t.includes("auto")) return Math.max(60, km * 15);
    if (t.includes("4")) return Math.max(120, km * 45);
    if (t.includes("6")) return Math.max(180, km * 60);
    if (t.includes("traveller")) return Math.max(500, km * 80);
    if (t.includes("intercity")) return Math.max(1000, km * 25);
    return Math.max(100, km * 30);
  };

  // Payment
  const handlePaymentClick = async (service) => {
    if (!user) return toast.error("Please log in to proceed with payment");
    if (!service) return;
    try {
      const { data } = await api.post("/payment/create-checkout-session", {
        service: service.title,
        amount: Math.round(service.price * 100),
        currency: "inr",
      });
      if (data.url) window.location.href = data.url;
      else alert("No Stripe URL returned. Check backend logs.");
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  useEffect(() => {
    // Subscribe to booking table changes
    const channel = supabase
      .channel("booking-changes") // just a label
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "booking" },
        (payload) => {
          console.log("Realtime change:", payload);
          setRideUpdates(payload); // store update in state
          toast.success(`Ride update: ${payload.eventType}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // react to updates
  useEffect(() => {
    if (!rideUpdates) return;

    if (rideUpdates.eventType === "UPDATE") {
      const newStatus = rideUpdates.new?.status;
      if (newStatus) {
        toast(`Your ride status: ${newStatus}`, { icon: "🚖" });
      }
    }
  }, [rideUpdates]);

  return (
    <div className="relative w-full h-screen">
      <div ref={mapRef} className="w-full h-full rounded-md"></div>

      {/* Bottom panel */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-[70%] md:w-[50%] bg-white/35 backdrop-blur-sm rounded-2xl shadow-lg p-6 z-[9999]">
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src="/ride.png" alt="ride" className="w-5 h-5" />
          <h1 className="text-lg font-bold">Choose Your Ride</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Pickup */}
          <div className="relative flex-1" ref={pickupRef}>
            <input
              type="text"
              placeholder="Source or Pickup"
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
                setPickupCoord(null); // clear chosen coord when typing new text
              }}
              className="w-full pl-10 pr-4 py-3 rounded-lg shadow-md outline-none border border-gray-200 focus:ring-2 focus:ring-black"
            />
            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-red-500" />

            {pickup && pickupSuggestions.length > 0 && (
              <ul className="absolute z-50 bg-white border rounded shadow-md w-full mt-1 max-h-40 overflow-y-auto text-left">
                {pickupSuggestions.map((s, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => selectSuggestion(s, "pickup")}
                  >
                    {s.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="hidden sm:flex items-center justify-center">
            <ArrowRightLeft
              className="w-6 h-6 text-gray-700 cursor-pointer"
              onClick={() => {
                // simple swap implementation
                const pText = pickup;
                const dText = drop;
                const pC = pickupCoord;
                const dC = dropCoord;
                setPickup(dText || "");
                setDrop(pText || "");
                setPickupCoord(dC || null);
                setDropCoord(pC || null);
              }}
            />
          </div>

          {/* Drop */}
          <div className="relative flex-1" ref={dropRef}>
            <input
              type="text"
              placeholder="Destination or Dropoff"
              value={drop}
              onChange={(e) => {
                setDrop(e.target.value);
                setDropCoord(null);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-lg shadow-md outline-none border border-gray-200 focus:ring-2 focus:ring-black"
            />
            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-green-500" />

            {drop && dropSuggestions.length > 0 && (
              <ul className="absolute z-50 bg-white border rounded shadow-md w-full mt-1 max-h-40 overflow-y-auto text-left">
                {dropSuggestions.map((s, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => selectSuggestion(s, "drop")}
                  >
                    {s.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            className="flex items-center justify-center gap-2 mx-auto sm:mx-0 px-6 py-3 bg-black rounded-xl hover:bg-gray-800 transition-all duration-300"
            onClick={() => {
              const map = mapInstanceRef.current;
              if (!map) return;
              if (pickupCoord && dropCoord) {
                const bounds = Leaflet.latLngBounds([
                  [pickupCoord.lat, pickupCoord.lon],
                  [dropCoord.lat, dropCoord.lon],
                ]);
                map.fitBounds(bounds.pad(0.2));

                // 🔹 open services list now
                setShowServices(true);
              } else if (pickupCoord) {
                map.setView([pickupCoord.lat, pickupCoord.lon], 14);
              } else if (dropCoord) {
                map.setView([dropCoord.lat, dropCoord.lon], 14);
              }
            }}
          >
            <Search className="w-5 h-5" />
            Search Ride
          </button>

          <button
            onClick={() => setShowServices(!showServices)}
            className="flex items-center justify-center gap-2 mx-auto sm:mx-0 px-6 py-3 bg-sky-500 rounded-xl hover:bg-sky-600 transition-all duration-300"
          >
            Services Ride
          </button>
        </div>

        {/* Services List */}
        {showServices && (
          <div className="mt-4 max-h-80 overflow-y-auto border rounded-lg bg-white p-4 shadow-md">
            {/* show computed distance if available */}
            {pickupCoord && dropCoord && (
              <div className="flex mb-3 text-sm text-center items-center justify-between text-gray-600">
                <section>
                  Distance: {distanceKm(pickupCoord, dropCoord).toFixed(2)} km
                </section>
                <section>
                  ETA:{" "}
                  {estimateTime(distanceKm(pickupCoord, dropCoord)).toFixed(0)}{" "}
                  mins
                </section>
              </div>
            )}

            {(filteredServices.length > 0 ? filteredServices : services).map(
              (service, idx) => {
                const km =
                  pickupCoord && dropCoord
                    ? distanceKm(pickupCoord, dropCoord)
                    : 0;
                const price = calculatePrice(service, km);

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 mb-4 p-3 border rounded-lg cursor-pointer ${
                      selectedService?.title === service.title
                        ? "border-black/80 bg-gray-200 border-2"
                        : "border-black bg-gray-50"
                    }`}
                    onClick={() => setSelectedService({ ...service, price })}
                  >
                    <img
                      src={service.media}
                      alt={service.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{service.desc}</p>
                    </div>
                    <div className="ml-auto font-bold text-gray-900">
                      ₹{price.toFixed(2)}
                    </div>
                  </div>
                );
              }
            )}
            {selectedService && (
              <div className="mt-4 flex justify-center">
                <div
                  className={`px-6 py-3 rounded-xl transition-all cursor-pointer ${
                    isLoggedIn
                      ? "bg-black/80 text-white/85 hover:bg-black/90"
                      : "bg-gray-400 text-white/85 cursor-not-allowed"
                  }`}
                  onClick={() => handlePaymentClick(selectedService)}
                >
                  Confirm & Pay ₹{selectedService.price.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RidePage;
