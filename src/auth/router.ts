import express from 'express';
import {keycloakConfig} from './utils/keycloak-config';

const router = express.Router();

router.use(keycloakConfig.protect('admin'));

// TODO: users

export default router;
