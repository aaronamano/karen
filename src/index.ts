import express, { Request, Response } from "express";
import accountRoutes from './routes/account';
import ticketRoutes from './routes/ticket';
import ticketsRoutes from './routes/tickets';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/account', accountRoutes);
app.use('/ticket', ticketRoutes);
app.use('/tickets', ticketsRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
