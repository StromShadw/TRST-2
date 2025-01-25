import Location from "../models/locations.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createLocation = asyncHandler(async (req, res) => {
    const {
        locationName,
        locationType,
        locationId,
        mainPhone,
        capacity,
        siteOwnership,
        siteManager,
        accessSafetySecurityEquipment,
        streetAddress1,
        streetAddress2,
        city,
        stateProvince,
        zipPostalCode,
        country,
        parentLocation,
    } = req.body;

    if (!locationName || !locationId) {
        throw new ApiError(400, "Location name and ID are required");
    }

    const existingLocation = await Location.findOne({
        $or: [{ locationName }, { locationId }]
    });

    if (existingLocation) {
        throw new ApiError(409, "Location with this name or ID already exists");
    }

    const location = await Location.create({
        locationName,
        locationType,
        locationId,
        mainPhone,
        capacity,
        siteOwnership,
        siteManager,
        accessSafetySecurityEquipment,
        streetAddress1,
        streetAddress2,
        city,
        stateProvince,
        zipPostalCode,
        country,
        parentLocation,
    });

    // If there's a parent location, update its childLocations
    if (parentLocation) {
        await Location.findByIdAndUpdate(
            parentLocation,
            { $push: { childLocations: location._id } }
        );
    }

    return res.status(201).json(
        new ApiResponse(201, location, "Location created successfully")
    );
});

const getAllLocations = asyncHandler(async (req, res) => {
    const locations = await Location.find()
        .populate("siteManager", "firstName lastName email")
        // .populate('parentBusinessEntity', 'businessEntity businessEntityType businessEntityId description')
        // .populate('childBusinessEntities', 'businessEntity businessEntityType businessEntityId description')
        .populate("childLocations", "locationName")
        .populate("businessEntities", "name");

    return res.status(200).json(
        new ApiResponse(200, locations, "Locations retrieved successfully")
    );
});

const getLocationById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const location = await Location.findById(id)
        .populate("siteManager", "firstName lastName email")
        .populate("parentLocation", "locationName")
        .populate("childLocations", "locationName")
        .populate("businessEntities", "name");

    if (!location) {
        throw new ApiError(404, "Location not found");
    }

    return res.status(200).json(
        new ApiResponse(200, location, "Location retrieved successfully")
    );
});

const updateLocation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const location = await Location.findById(id);

    if (!location) {
        throw new ApiError(404, "Location not found");
    }

    // Handle parent location change
    if (updateData.parentLocation && updateData.parentLocation !== location.parentLocation?.toString()) {
        // Remove from old parent's childLocations
        if (location.parentLocation) {
            await Location.findByIdAndUpdate(
                location.parentLocation,
                { $pull: { childLocations: location._id } }
            );
        }
        // Add to new parent's childLocations
        await Location.findByIdAndUpdate(
            updateData.parentLocation,
            { $push: { childLocations: location._id } }
        );
    }

    const updatedLocation = await Location.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
    ).populate("siteManager parentLocation childLocations businessEntities");

    return res.status(200).json(
        new ApiResponse(200, updatedLocation, "Location updated successfully")
    );
});

const deleteLocation = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const location = await Location.findById(id);

    if (!location) {
        throw new ApiError(404, "Location not found");
    }

    // Remove reference from parent location
    if (location.parentLocation) {
        await Location.findByIdAndUpdate(
            location.parentLocation,
            { $pull: { childLocations: location._id } }
        );
    }

    // Update child locations to remove parent reference
    await Location.updateMany(
        { _id: { $in: location.childLocations } },
        { $unset: { parentLocation: "" } }
    );

    await Location.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, null, "Location deleted successfully")
    );
});

export {
    createLocation,
    getAllLocations,
    getLocationById,
    updateLocation,
    deleteLocation
};
