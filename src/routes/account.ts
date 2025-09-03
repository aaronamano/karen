
import express, { Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import 'dotenv/config';

const router = express.Router();

// Connection URI
const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

// Zod Schemas for type checking
const CreateAccountBodySchema = z.object({
    name: z.string(),
    username: z.string(),
    password: z.string(),
    type: z.string(),
    role: z.string(),
    company: z.string(),
});

const LoginBodySchema = z.object({
    password: z.string(),
});

const ResetPasswordBodySchema = z.object({
    newPassword: z.string(),
});

type CreateAccountBody = z.infer<typeof CreateAccountBodySchema>;
type LoginBody = z.infer<typeof LoginBodySchema>;
type ResetPasswordBody = z.infer<typeof ResetPasswordBodySchema>;

async function connectDb() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
    }
}

connectDb();

const accountsCollection = client.db('karen').collection('accounts');

// POST /account - Create a new account
router.post('/', async (req: Request<CreateAccountBody>, res: Response) => {
    try {
        const { name, username, password, type, role, company } = CreateAccountBodySchema.parse(req.body);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAccount = {
            name,
            username,
            password: hashedPassword,
            type,
            role,
            company,
        };

        const result = await accountsCollection.insertOne(newAccount);
        res.status(201).json({ message: 'Account created successfully', accountId: result.insertedId });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.issues });
        }
        res.status(500).json({ message: 'Error creating account', error });
    }
});

// GET /account/{id}/login - Login to an account
router.get('/:id/login', async (req: Request<{ id: string }, LoginBody>, res: Response) => {
    try {
        const { password } = LoginBodySchema.parse(req.body);

        const account = await accountsCollection.findOne({ _id: new ObjectId(req.params.id) });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, account.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.issues });
        }
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// PUT /account/{id}/reset-password - Reset password
router.put('/:id/reset-password', async (req: Request<{ id: string }, ResetPasswordBody>, res: Response) => {
    try {
        const { newPassword } = ResetPasswordBodySchema.parse(req.body);

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await accountsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { password: hashedPassword } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Account not found' });
        }

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.issues });
        }
        res.status(500).json({ message: 'Error resetting password', error });
    }
});

// DELETE /account/{id} - Delete an account
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        const result = await accountsCollection.deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Account not found' });
        }

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error });
    }
});

export default router;
