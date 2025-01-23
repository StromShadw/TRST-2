import { Router } from 'express';
import { 
    createEmployee, 
    getEmployee, 
    getAllEmployees, 
    updateEmployee, 
    deleteEmployee 
} from '../controllers/employees.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Create new employee
router.route("/").post(verifyJWT, createEmployee)

router.route("/all").get(verifyJWT, getAllEmployees); // Get all employees with filtering and pagination

// Handle operations on specific employee by ID
router.route("/:id")
    .get(verifyJWT, getEmployee)      // Get single employee
    .patch(verifyJWT, updateEmployee) // Update employee
    .delete(verifyJWT, deleteEmployee); // Delete employee

export default router;
