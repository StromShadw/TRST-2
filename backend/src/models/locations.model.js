import mongoose from "mongoose"

const locationSchema = new mongoose.Schema({
    locationName: {
        type: String,
        unique: true,
    },
    locationType: {
        type: String,
    },
    locationId: {
        type: String,
        unique: true,
    },
    mainPhone: {
        type: String,
    },
    capacity: {
        type: Number,
    },
    siteOwnership: {
        type: String,
    },
    siteManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    accessSafetySecurityEquipment: {
        type: String,
    },
    streetAddress1: {
        type: String,
    },
    streetAddress2: {
        type: String,
    },
    city: {
        type: String,
    },
    stateProvince: {
        type: String,
    },
    zipPostalCode: {
        type: String,
    },
    city: {
        type: String,
    },
    country: {
        type: String,
    },
    parentLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location"
    },
    childLocations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location"
    }],
    businessEntities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessEntity"
    }],
}, {
    timestamps: true
})

const Location = mongoose.model("Location", locationSchema)

export default Location