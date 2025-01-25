import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BusinessEntity, BUSINESS_ENTITY_TYPES } from "../models/organizationalEntities.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
// import { Location } from "../models/locations.model.js";

const createOrganizationalEntity = asyncHandler(async (req, res) => {
    const {
        businessEntityType, 
        businessEntityId,
        businessEntity, 
        editors, 
        description, 
        parentBusinessEntity,
        childBusinessEntities, 
        relatedLocations
    } = req.body

    // Validate required fields
    if (!businessEntityType || !businessEntity || !businessEntityId) {
        throw new ApiError(400, "businessEntityType, businessEntityId and businessEntity fields must be provided")
            res.status(400)
    }

    // Check if businessEntityType is provided and valid
    if (businessEntityType && !BUSINESS_ENTITY_TYPES.includes(businessEntityType)) {
        throw new ApiError(400, "Invalid businessEntityType");
    }

    // Check if businessEntityId is provided and unique
    let businessEntityIdValue = businessEntityId || null; // Ensure it is explicitly set to null if not provided
    if (businessEntityIdValue) {
        const existingBusinessEntityId = await BusinessEntity.findOne({ businessEntityId: businessEntityIdValue });
        if (existingBusinessEntityId) {
            throw new ApiError(409, "businessEntityId must be unique");
        }
    }

    // Check if entity already exists by name
    const existingEntity = await BusinessEntity.findOne({ businessEntity });
    if (existingEntity) {
        throw new ApiError(409, "Entity with this name already exists");
    }

    // Check if the provided ID already exists in the request
    if (req.body.id) {
        throw new ApiError(400, "ID should not be provided for creating a new entity");
    }

    // First, verify if the parent business entity exists by name
    let parentEntityId = null;
    let parentEntityName = null;
    if (parentBusinessEntity) {
        const parentEntity = await BusinessEntity.findOne({ businessEntity: parentBusinessEntity });
        if (!parentEntity) {
            throw new ApiError(404, "Parent business entity not found");
        }
        parentEntityId = parentEntity._id; // Get the ObjectId of the found entity
        parentEntityName = parentEntity.businessEntity; // Store the name if needed
    }

    // Find related locations by name
    let relatedLocationIds = [];
    if (relatedLocations?.length) {
        const relatedLocations = await Location.find({ location: { $in: relatedLocations } });
        relatedLocationIds = relatedLocations.map(location => location._id);
    }

    // Find editors by username or fullName
    let editorIds = [];
    if (editors?.length) {
        editorIds = await User.find({
            $or: [
                { username: { $in: editors } },
                { fullName: { $in: editors } }
            ]
        }).distinct('_id');

        if (editorIds.length === 0) {
            throw new ApiError(400, "No editors found with the provided names/usernames");
        }
    }

    // Convert string IDs to ObjectIds and handle arrays properly
    const formattedData = {
        businessEntityType,
        businessEntityId: businessEntityIdValue || null,
        businessEntity,
        description,
        editors: editorIds, // Use the found editor IDs
        parentBusinessEntity: parentEntityId,
        parentBusinessEntityName: parentEntityName,
        childBusinessEntities: childBusinessEntities?.length ? 
            await BusinessEntity.find({ businessEntity: { $in: childBusinessEntities } }).distinct('_id') : [],
        relatedLocations: relatedLocations?.length ? relatedLocations.filter(id => id).map(id => id.toString()) : []
    }

    // Validate that editors are valid ObjectIds if provided
    if (editors?.length) {
        try {
            editorIds.forEach(editorId => {
                if (!mongoose.Types.ObjectId.isValid(editorId)) {
                    throw new ApiError(400, "Invalid editor ID format");
                }
            });
        } catch (error) {
            throw new ApiError(400, "Invalid editor IDs provided");
        }
    }

    // Create new entity
    const newOrganizationalEntity = await BusinessEntity.create(formattedData)

    // Update parent's childBusinessEntities only if parent exists
    if (parentEntityId) {
        await BusinessEntity.findByIdAndUpdate(
            parentEntityId,
            {
                $addToSet: { childBusinessEntities: newOrganizationalEntity._id }
            }
        )
    }

    return res.status(201).json(
        new ApiResponse(201, newOrganizationalEntity, "Organizational Entity Created Successfully!")
    )
})

const updateOrganizationalEntity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Log the incoming request data
    console.log("Incoming Update Data:", updateData);

    // First check if the entity exists
    const existingEntity = await BusinessEntity.findById(id);
    if (!existingEntity) {
        throw new ApiError(404, "Organizational Entity not found");
    }

    // Check if the provided ID matches the entity being updated
    if (updateData.id && updateData.id !== id) {
        throw new ApiError(400, "ID cannot be changed");
    }

    // Check if businessEntityId is provided and unique
    if (updateData.businessEntityId && updateData.businessEntityId !== existingEntity.businessEntityId) {
        const duplicateEntity = await BusinessEntity.findOne({
            businessEntityId: updateData.businessEntityId,
            _id: { $ne: id } // exclude current entity
        });
        if (duplicateEntity) {
            throw new ApiError(409, "businessEntityId must be unique");
        }
    }

    // Check if businessEntityType is provided and valid
    if (updateData.businessEntityType && !BUSINESS_ENTITY_TYPES.includes(updateData.businessEntityType)) {
        throw new ApiError(400, "Invalid businessEntityType");
    }

    // Check for duplicate businessEntity name only if it's being changed
    if (updateData.businessEntity && updateData.businessEntity !== existingEntity.businessEntity) {
        const duplicateEntity = await BusinessEntity.findOne({
            businessEntity: updateData.businessEntity,
            _id: { $ne: id } // exclude current entity
        });
        if (duplicateEntity) {
            throw new ApiError(409, "An entity with this name already exists. Please use a different name.");
        }
    }

    // Find editors by username or fullName
    if (updateData.editors?.length) {
        const editorIds = await User.find({
            $or: [
                { username: { $in: updateData.editors } },
                { fullName: { $in: updateData.editors } }
            ]
        }).distinct('_id');

        if (editorIds.length === 0) {
            throw new ApiError(400, "No editors found with the provided names/usernames");
        }
        updateData.editors = editorIds; // Update to use ObjectIds
    }

    // Check if parentBusinessEntity is provided and handle removal
    if (updateData.parentBusinessEntity === "") {
        console.log("Removing parentBusinessEntity");
        updateData.parentBusinessEntity = null; // Set to null to remove the parent entity
    } else if (updateData.parentBusinessEntity) {
        // If a name is provided, find the parent entity by name
        const parentEntity = await BusinessEntity.findOne({ businessEntity: updateData.parentBusinessEntity });
        if (parentEntity) {
            updateData.parentBusinessEntity = parentEntity._id; // Set to the ObjectId of the found entity
        } else {
            throw new ApiError(404, "Parent business entity not found by name");
        }
    }


    // Find child business entities by name and convert to ObjectIds
    if (updateData.childBusinessEntities?.length) {
        const childEntities = await BusinessEntity.find({
            businessEntity: { $in: updateData.childBusinessEntities }
        }).distinct('_id');

        if (childEntities.length === 0) {
            throw new ApiError(400, "No valid child business entities found");
        }
        updateData.childBusinessEntities = childEntities; // Update to use ObjectIds
    }

    const updatedEntity = await BusinessEntity.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedEntity, "Organizational Entity Updated Successfully!")
    );
})

const deleteOrganizationalEntity = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const entityToDelete = await BusinessEntity.findById(id);

    if (!entityToDelete) {
        throw new ApiError(404, "Organizational Entity not found");
    }

    // Remove this entity from its parent's childBusinessEntities
    if (entityToDelete.parentBusinessEntity) {
        await BusinessEntity.findByIdAndUpdate(
            entityToDelete.parentBusinessEntity,
            {
                $pull: { childBusinessEntities: id }
            }
        );
    }

    // Remove this entity from any childBusinessEntities in other entities
    await BusinessEntity.updateMany(
        { childBusinessEntities: id },
        { $pull: { childBusinessEntities: id } } // Remove from child entities
    );

    // Remove this entity from any parentBusinessEntity references in other entities
    await BusinessEntity.updateMany(
        { parentBusinessEntity: id },
        { $set: { parentBusinessEntity: null } } // Set parent to null
    );

    // Delete all child entities of the parent
    await BusinessEntity.deleteMany({ parentBusinessEntity: entityToDelete._id });

    // Delete the entity
    await BusinessEntity.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Organizational Entity Deleted Successfully!")
    );
})

const getOrganizationalEntityDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const entity = await BusinessEntity.findById(id)
        .populate('parentBusinessEntity', 'businessEntity businessEntityType businessEntityId description')
        .populate('childBusinessEntities', 'businessEntity businessEntityType businessEntityId description')
        .populate('editors', 'username fullName email')
        .populate('relatedLocations', 'locationName locationType locationId');

    if (!entity) {
        throw new ApiError(404, "Organizational Entity not found");
    }

    return res.status(200).json(
        new ApiResponse(200, entity, "Organizational Entity details fetched successfully!")
    );
});

const getAllOrganizationalEntities = asyncHandler(async (req, res) => {
    const entities = await BusinessEntity.find()
        .populate('parentBusinessEntity', 'businessEntity businessEntityType businessEntityId description')
        .populate('childBusinessEntities', 'businessEntity businessEntityType businessEntityId description')
        .populate('editors', 'username fullName email')
        // .populate('relatedLocations', 'locationName locationType locationId');

    return res.status(200).json(
        new ApiResponse(200, entities, "Organizational Entities fetched successfully!")
    );
});

export {
    createOrganizationalEntity,
    updateOrganizationalEntity,
    deleteOrganizationalEntity,
    getOrganizationalEntityDetails,
    getAllOrganizationalEntities
}