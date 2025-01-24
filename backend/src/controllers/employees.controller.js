import mongoose from 'mongoose';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Employee from "../models/employees.model.js";
import {BusinessEntity} from "../models/organizationalEntities.model.js";
import Location from "../models/locations.model.js";    

// Create a new employee
const createEmployee = asyncHandler(async (req, res) => {
    const {
        employeeID, firstName, middleName, lastName, preferredName,
        title,
        timeZone,
        workEmailAddress, workPhone, workMobilePhone,
        fax,
        manager,
        subordinates,
        location,
        department,
        employeeStatus,
        streetAddress1,
        streetAddress2,
        city,
        zipPostalCode,
        stateProvince,
        country,
        homePhoneNumber,
        personalMobilePhone,
        personalEmailAddress,
    } = req.body;

    // Validate required fields
    const requiredFields = ['employeeID', 'firstName', 'lastName', 'preferredName'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
    }

    // Check if employeeID, firstName, lastName, or preferredName already exist
    const existingEmployee = await Employee.findOne({
        $or: [
            { employeeID },
            { firstName, lastName, middleName, preferredName }
        ]
    });

    if (existingEmployee) {
        throw new ApiError(409, "An employee with the same employeeID, first name, last name, or preferred name already exists.");
    }

    // Verify if the Manager exists
    let managerId = null;
    let managerName = null;
    if (manager) {
        const managerDoc = await Employee.findOne({ employeeID: manager });
        if (!managerDoc) {
            throw new ApiError(404, "Manager not found");
        }
        managerId = managerDoc._id;
        managerName = managerDoc.firstName + " " + managerDoc.lastName;
    }

    // Verify if the subordinates exist and get their IDs
    let subordinateIds = [] ;
    let subordinateNames = [];
    if (subordinates && Array.isArray(subordinates)) {
        for (const subordinateID of subordinates) {
            const subordinateDoc = await Employee.findOne({ employeeID: subordinateID });
            if (!subordinateDoc) {
                throw new ApiError(404, `Subordinate with ID ${subordinateID} not found`);
            }
            subordinateIds.push(subordinateDoc._id);
        }
    }

    // Initialize department arrays
    let departmentIds = [];
    let departmentNames = [];
    
    // Only process departments if the array exists and is not empty
    if (department && Array.isArray(department) && department.length > 0) {
        // Process each department name
        for (const deptName of department) {
            const businessEntity = await BusinessEntity.findOne({ 
                businessEntity: deptName 
            });
            
            if (!businessEntity) {
                throw new ApiError(404, `Department "${deptName}" not found`);
            }
            
            departmentIds.push(new mongoose.Types.ObjectId(businessEntity._id));
            departmentNames.push(businessEntity.businessEntity);
        }
    }

    // Verify if the Location exists
    let locationId = null;
    let locationName = null;
    if (location) {
        const locationDoc = await Location.findOne({ locationId: location });
        if (!locationDoc) {
            throw new ApiError(404, "Location not found");
        }
        locationId = locationDoc._id;
        locationName = locationDoc.locationName;
    }

    // Create employee with the processed data
    const employeeData = {
        employeeID,
        firstName,
        middleName,
        lastName,
        preferredName,
        title,
        timeZone,
        workEmailAddress,
        workPhone,
        workMobilePhone,
        fax,
        manager: managerId,
        managerName,
        subordinates: subordinateIds,
        subordinateNames,
        location: locationId,
        locationName,
        department: departmentIds,
        departmentNames,
        updatedBy: req.user._id,
        employeeStatus,
        streetAddress1,
        streetAddress2,
        city,
        zipPostalCode,
        stateProvince,
        country,
        homePhoneNumber,
        personalMobilePhone,
        personalEmailAddress
    };

    // Remove undefined or null values
    Object.keys(employeeData).forEach(key => {
        if (employeeData[key] === undefined || employeeData[key] === null) {
            delete employeeData[key];
        }
    });

    // Create the employee
    const newEmployee = await Employee.create(employeeData);

    // Populate the department references in the response
    const populatedEmployee = await Employee.findById(newEmployee._id)
        .populate('manager', 'firstName lastName employeeID')
        .populate('subordinates', 'firstName lastName employeeID')
        .populate('department', 'businessEntity businessEntityType businessEntityId')
        .populate('location', 'locationName locationId')
        .populate('updatedBy', 'fullName email');

    return res.status(201).json(
        new ApiResponse(201, populatedEmployee, "Employee Created Successfully!")
    );
});

// Get an employee by ID
const getEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const employee = await Employee.findById(id)
        .populate('manager')
        .populate('subordinates')
        .populate('location')
        .populate('department')
        .populate('updatedBy', 'fullName email');

    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    return res.status(200).json(
        new ApiResponse(200, employee, "Employee details fetched successfully!")
    );
});

// Get all employees with filtering and pagination
const getAllEmployees = asyncHandler(async (req, res) => {
    const { 
        page = 1, 
        limit = 10,
        search,
        department,
        employeeStatus 
    } = req.query;

    let query = {};

    // Search functionality
    if (search) {
        query.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { employeeID: { $regex: search, $options: 'i' } }
        ];
    }

    // Department filter - using departmentNames array instead of department ObjectIds
    if (department) {
        query.departmentNames = department;
    }

    // Status filter
    if (employeeStatus) {
        query.employeeStatus = employeeStatus;
    }

    const employees = await Employee.find(query)
        .populate('manager', 'firstName lastName employeeID')
        .populate('subordinates', 'firstName lastName employeeID')
        .populate('department', 'businessEntity businessEntityType businessEntityId')
        .populate('location', 'locationName locationId')
        .populate('updatedBy', 'fullName email')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await Employee.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            employees,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalEmployees: count
        }, "Employees fetched successfully!")
    );
});

// Update an employee by ID
const updateEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = { 
        ...req.body,
        updatedBy: req.user._id // Add this line to automatically set the logged-in user
    };

    // First check if the employee exists
    const existingEmployee = await Employee.findById(id);
    if (!existingEmployee) {
        throw new ApiError(404, "Employee not found");
    }

    // Check if employeeID is being changed
    if (updateData.employeeID && updateData.employeeID !== existingEmployee.employeeID) {
        throw new ApiError(400, "Employee ID cannot be changed");
    }

    // Handle manager update if present
    if (updateData.manager) {
        const managerDoc = await Employee.findOne({ employeeID: updateData.manager });
        if (!managerDoc) {
            throw new ApiError(404, "Manager not found");
        }
        updateData.manager = managerDoc._id;
    }

    // Handle department updates if present
    if (updateData.department) {
        if (!Array.isArray(updateData.department)) {
            throw new ApiError(400, "Department must be an array");
        }

        let departmentIds = [];
        let departmentNames = [];
        
        // Process each department name
        for (const deptName of updateData.department) {
            const businessEntity = await BusinessEntity.findOne({ 
                businessEntity: deptName 
            });
            
            if (!businessEntity) {
                throw new ApiError(404, `Department "${deptName}" not found`);
            }
            
            departmentIds.push(businessEntity._id);
            departmentNames.push(businessEntity.businessEntity);
        }

        // Update the department fields
        updateData.department = departmentIds;
        updateData.departmentNames = departmentNames;
    }

    // Handle subordinates update if present
    if (updateData.subordinates) {
        if (!Array.isArray(updateData.subordinates)) {
            throw new ApiError(400, "Subordinates must be an array");
        }

        const subordinateIds = [];
        for (const subEmployeeID of updateData.subordinates) {
            const subordinate = await Employee.findOne({ employeeID: subEmployeeID });
            if (!subordinate) {
                throw new ApiError(404, `Subordinate with ID ${subEmployeeID} not found`);
            }
            subordinateIds.push(subordinate._id);
        }
        updateData.subordinates = subordinateIds;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    )
    .populate('manager', 'firstName lastName employeeID')
    .populate('subordinates', 'firstName lastName employeeID')
    .populate('department', 'businessEntity businessEntityType businessEntityId')
    .populate('location', 'locationName locationId')
    .populate('updatedBy', 'fullName email');

    return res.status(200).json(
        new ApiResponse(200, updatedEmployee, "Employee Updated Successfully!")
    );
});

// Delete an employee by ID
const deleteEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const employeeToDelete = await Employee.findById(id);
    if (!employeeToDelete) {
        throw new ApiError(404, "Employee not found");
    }

    await Employee.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Employee Deleted Successfully!")
    );
});

export {
    createEmployee,
    getEmployee,
    getAllEmployees,
    updateEmployee,
    deleteEmployee
};
