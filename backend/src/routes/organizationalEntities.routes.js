import { Router } from 'express';
import { createOrganizationalEntity, updateOrganizationalEntity, deleteOrganizationalEntity, getOrganizationalEntityDetails } from '../controllers/organizationalEntity.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';


const router = Router();

router.route("/")
    .post(verifyJWT, createOrganizationalEntity);

router.route("/:id")
    .get(verifyJWT, getOrganizationalEntityDetails)
    .patch(verifyJWT, updateOrganizationalEntity)
    .delete(verifyJWT, deleteOrganizationalEntity);

export default router;

