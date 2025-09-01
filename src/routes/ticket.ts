
import express, { Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
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

const ticketsCollection = client.db('karen').collection('tickets');
const serversCollection = client.db('karen').collection('servers');

// POST /ticket - Create a new ticket
router.post('/', async (req: Request, res: Response) => {
    try {
        const { title, description, tags } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const centralServer = await serversCollection.findOne({ server_type: 'central' });

        if (!centralServer) {
            return res.status(500).json({ message: 'Central server not found' });
        }

        const newTicket = {
            title,
            description,
            tags: tags || [],
            created_at: new Date(),
            updated_at: new Date(),
            status: 'not started',
            priority: 'low',
            assigned_to: [], // teams aren't assigned to this ticket yet
            server: centralServer._id, // default to central server id
            history: [],
        };

        const result = await ticketsCollection.insertOne(newTicket);
        res.status(201).json({ message: 'Ticket created successfully', ticketId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating ticket', error });
    }
});

// DELETE /ticket/{id} - Delete a ticket
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const result = await ticketsCollection.deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ticket', error });
    }
});

// PUT /ticket/{id}/status - Change the status of a ticket
router.put('/:id/status', async (req: Request, res: Response) => {
    try {
        const { status, userId } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const historyEntry = {
            event: 'status_change',
            changed_by: ObjectId.createFromHexString(userId),
            timestamp: new Date(),
            details: `Status changed to ${status}`,
        };

        const result = await ticketsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { 
                $set: { status: status, updated_at: new Date() },
                $addToSet: { history: historyEntry }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket status', error });
    }
});

// PUT /ticket/{id}/priority - Change the priority of a ticket
router.put('/:id/priority', async (req: Request, res: Response) => {
    try {
        const { priority, userId } = req.body;

        if (!priority) {
            return res.status(400).json({ message: 'Priority is required' });
        }

        if (!['low', 'medium', 'high'].includes(priority)) {
            return res.status(400).json({ message: 'Invalid priority level. Must be one of "low", "medium", or "high".' });
        }

        const historyEntry = {
            event: 'priority_change',
            changed_by: ObjectId.createFromHexString(userId),
            timestamp: new Date(),
            details: `Priority changed to ${priority}`,
        };

        const result = await ticketsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { 
                $set: { priority: priority, updated_at: new Date() },
                $addToSet: { history: historyEntry }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket priority updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket priority', error });
    }
});

// POST /ticket/{id}/notification - Send a notification of a ticket
router.post('/:id/notification', async (req: Request, res: Response) => {
    // This is a placeholder for a future implementation
    res.status(501).json({ message: 'Not implemented' });
});

export default router;
