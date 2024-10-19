import express from 'express';
import { isAdmin } from '../middleware/verifyToken.js';
import { admin, delet, updateUser } from '../controllers/Admin.js';

const AdminRoutes = express.Router();

AdminRoutes.get('/admin', isAdmin, admin);
AdminRoutes.delete('/deletuser/:id', isAdmin, delet);
AdminRoutes.put('/updateuser/:id', isAdmin, updateUser);

export default AdminRoutes;