import express from "express";
import { createLocation, getAllLocations, getLocationById, updateLocation, deleteLocation } from "../controllers/locations.controller.js";

const router = express.Router();

// Create a new location
router.post("/", createLocation);

// Other routes (if needed)
router.get("/all", getAllLocations);
router.get("/:id", getLocationById);
router.put("/:id", updateLocation);
router.delete("/:id", deleteLocation);

export default router; 