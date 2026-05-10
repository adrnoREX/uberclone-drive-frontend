import { useQuery } from "@tanstack/react-query";
import api from "../../../api"; // your Axios instance

export const useDriverData = () => {
  return useQuery({
    queryKey: ["driverDetails"],
    queryFn: async () => {
      const res = await api.get("/driver/details"); // Axios automatically parses JSON
      return res.data.driver; // driver object
    },
  });
};