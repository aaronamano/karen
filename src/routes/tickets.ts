
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

// GET /tickets - Getting ids of tickets filtered based on certain tags or properties
router.get('/', async (req: Request, res: Response) => {
    try {
        const { tags, status, priority } = req.query;
        const filter: any = {};

        if (tags) {
            filter.tags = { $in: (tags as string).split(',') };
        }
        if (status) {
            filter.status = status;
        }
        if (priority) {
            filter.priority = priority;
        }

        const tickets = await ticketsCollection.find(filter).project({ _id: 1 }).toArray();
        res.status(200).json(tickets.map(t => t._id));
    } catch (error) {
        res.status(500).json({ message: 'Error getting tickets', error });
    }
});

// POST /tickets/{ids}/distribute/{server_id} - Transferring tickets to a different mock server
router.post('/:ids/distribute/:server_id', async (req: Request, res: Response) => {
    try {
        const ids = (req.params.ids as string).split(',').map(id => new ObjectId(id));
        const server_id = new ObjectId(req.params.server_id);

        const result = await ticketsCollection.updateMany(
            { _id: { $in: ids } },
            { $set: { server: server_id, updated_at: new Date() } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'No tickets found with the given ids' });
        }

        res.status(200).json({ message: `${result.modifiedCount} tickets distributed successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error distributing tickets', error });
    }
});

export default router;
