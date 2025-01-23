import mongoose from "mongoose"

// Define the allowed business entity types
const BUSINESS_ENTITY_TYPES = ['Company', 'Business Unit', 'Division', 'Department'];

const businessEntitySchema = new mongoose.Schema({
    businessEntityType: {
        type: String,
        required: true,
        trim: true
    },
    businessEntity: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    businessEntityId: {
        type: String,
        unique: true,
    },
    editors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    description: {
        type: String,
    },
    parentBusinessEntity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessEntity",
    },
    childBusinessEntities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessEntity"
    }],
    relatedLocations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location"
    }],
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true
})

// Update the updatedAt timestamp before saving
businessEntitySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export const BusinessEntity = mongoose.model("BusinessEntity", businessEntitySchema)

export { BUSINESS_ENTITY_TYPES };