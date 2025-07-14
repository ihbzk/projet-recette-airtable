import { Request, Response } from 'express';
import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
);

export const addContact = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            message,
            agreed,
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !message ||
            typeof agreed !== 'boolean'
        ) {
            res.status(400).json({ error: 'Les champs obligatoires sont manquants.' });
            return;
        }

        const createdRecord = await base('Contacts').create({
            Firstname: firstName,
            Lastname: lastName,
            Email: email,
            Phone: phone || '',
            Message: message,
            AcceptOurPrivacyPolicy: agreed,
        });

        res.status(201).json({
            id: createdRecord.id,
            fields: createdRecord.fields,
        });
        return;
    } catch (error) {
        console.error('Error adding contact:', error);
        res
            .status(500)
            .json({
                error: 'Erreur interne du serveur lors de l’ajout du contact.',
            });
        return;
    }
};
