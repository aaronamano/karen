
import express, { Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const router = express.Router();

// Connection URI
const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

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
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, username, password, type, role, company } = req.body;

        if (!name || !username || !password || !type || !role || !company) {
            return res.status(400).json({ message: 'All fields are required' });
        }

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
        res.status(500).json({ message: 'Error creating account', error });
    }
});

// GET /account/{id}/login - Login to an account
router.get('/:id/login', async (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: 'Password is required for login' });
        }

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
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// PUT /account/{id}/reset-password - Reset password
router.put('/:id/reset-password', async (req: Request, res: Response) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

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
        res.status(500).json({ message: 'Error resetting password', error });
    }
});

// DELETE /account/{id} - Delete an account
router.delete('/:id', async (req: Request, res: Response) => {
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
