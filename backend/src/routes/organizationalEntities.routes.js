import { Router } from 'express';
import { createOrganizationalEntity, getAllOrganizationalEntities, updateOrganizationalEntity, deleteOrganizationalEntity, getOrganizationalEntityDetails } from '../controllers/organizationalEntity.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';


const router = Router();

router.route("/create")
    .post(verifyJWT, createOrganizationalEntity);

router.route("/all")
    .get(verifyJWT, getAllOrganizationalEntities);

router.route("/:id")
    .get(verifyJWT, getOrganizationalEntityDetails)
    .patch(verifyJWT, updateOrganizationalEntity)
    .delete(verifyJWT, deleteOrganizationalEntity);


export default router;

