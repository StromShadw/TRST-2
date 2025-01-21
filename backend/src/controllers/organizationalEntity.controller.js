import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BusinessEntity } from "../models/organizationalEntities.model.js";

const createOrganizationalEntity = asyncHandler(async (req, res) => {
    const {
        businessEntityType, 
        businessEntity, 
        businessEntityId, 
        editors, 
        description, 
        parentBusinessEntity,
        childBusinessEntities, 
        relatedLocations
    } = req.body

    // Validate required fields
    if (!businessEntityType || !businessEntity) {
        throw new ApiError(400, "All required fields must be provided")
    }

    // Check if entity already exists
    const existingEntity = await BusinessEntity.findOne({
        $or: [
            { businessEntity },
            { businessEntityId }
        ]
    })

    if (existingEntity) {
        throw new ApiError(409, "Entity with this name or ID already exists")
    }

    // First, verify if the parent business entity exists and get its ID if provided
    let parentEntityId = null;
    if (parentBusinessEntity) {
        const parentEntity = await BusinessEntity.findOne({ businessEntity: parentBusinessEntity });
        if (!parentEntity) {
            throw new ApiError(404, "Parent business entity not found");
        }
        parentEntityId = parentEntity._id;
    }

    // Convert string IDs to ObjectIds and handle arrays properly
    const formattedData = {
        businessEntityType,
        businessEntity,
        businessEntityId,
        description,
        editors: editors?.length ? await BusinessEntity.find({ businessEntity: { $in: editors } }).distinct('_id') : [],
        parentBusinessEntity: parentEntityId, // Now can be null
        childBusinessEntities: childBusinessEntities?.length ? 
            await BusinessEntity.find({ businessEntity: { $in: childBusinessEntities } }).distinct('_id') : [],
        relatedLocations: relatedLocations?.length ? relatedLocations.filter(id => id).map(id => id.toString()) : []
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
    const { id } = req.params
    const updateData = { ...req.body }

    // First check if the entity exists
    const existingEntity = await BusinessEntity.findById(id)
    if (!existingEntity) {
        throw new ApiError(404, "Organizational Entity not found")
    }

    // Check for duplicate businessEntity name only if it's being changed
    if (updateData.businessEntity && updateData.businessEntity !== existingEntity.businessEntity) {
        const duplicateEntity = await BusinessEntity.findOne({
            businessEntity: updateData.businessEntity,
            _id: { $ne: id } // exclude current entity
        })
        if (duplicateEntity) {
            throw new ApiError(409, "An entity with this name already exists")
        }
    }

    const updatedEntity = await BusinessEntity.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    )

    return res.status(200).json(
        new ApiResponse(200, updatedEntity, "Organizational Entity Updated Successfully!")
    )
})

const deleteOrganizationalEntity = asyncHandler(async (req, res) => {
    const { id } = req.params

    const entityToDelete = await BusinessEntity.findById(id)

    if (!entityToDelete) {
        throw new ApiError(404, "Organizational Entity not found")
    }

    // Remove this entity from parent's childBusinessEntities
    if (entityToDelete.parentBusinessEntity) {
        await BusinessEntity.findByIdAndUpdate(
            entityToDelete.parentBusinessEntity,
            {
                $pull: { childBusinessEntities: id }
            }
        )
    }

    // Delete the entity
    await BusinessEntity.findByIdAndDelete(id)

    return res.status(200).json(
        new ApiResponse(200, {}, "Organizational Entity Deleted Successfully!")
    )
})

const getOrganizationalEntityDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const entity = await BusinessEntity.findById(id)
        .populate('parentBusinessEntity', 'businessEntity businessEntityType businessEntityId description')
        .populate('childBusinessEntities', 'businessEntity businessEntityType businessEntityId description')
        .populate('editors', 'businessEntity businessEntityType businessEntityId');

    if (!entity) {
        throw new ApiError(404, "Organizational Entity not found");
    }

    return res.status(200).json(
        new ApiResponse(200, entity, "Organizational Entity details fetched successfully!")
    );
});

export {
    createOrganizationalEntity,
    updateOrganizationalEntity,
    deleteOrganizationalEntity,
    getOrganizationalEntityDetails
}