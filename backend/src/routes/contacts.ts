import express from 'express';
import * as ContactsController from '../controllers/contacts.controller';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/api/contacts', ContactsController.addContact);

export default router;
