# API Routes
## Account management
- [ ] POST /account
- [ ] GET /account/{id}/login
- [ ] PUT /account/{id}/reset-password
- [ ] DELETE /account/{id}

## Ticket operations
### User
- [ ] POST /ticket 
    - Defaults to submitting the ticket to the central server id

### Admin
refers to someone working for a company
- [ ] DELETE /ticket/{id} 
    - Delete a ticket once it is completed
- [ ] PUT /ticket/{id}/status 
    - Change the status of a ticket
- [ ] POST /ticket/{id}/notification 
    - Send a notification of a ticket via email or 3rd party app (will priortize later)

## Ticket management
core feature for distributing tickets
- [ ] GET /tickets 
    - Getting ids of tickets filtered based on certain tags or properties
- [ ] POST /tickets/{ids}/distribute/{server_id} 
    - Transferring tickets to a different mock server

# Database Schema
Note: we will be sharding eventually
## `Accounts` collections
```typescript
{
    _id: ObjectId(),
    name: string, // e.g. Tim Cheese
    username: string, // e.g. timcheese67
    password: string, // use bcrypt
    type: "personal" | "work",
    role: string, // e.g. student, swe, etc.
    company: string // e.g. McDonalds or University of Michigan

}
```

## `Tickets` collections
```typescript
{
    _id: ObjectId(),
    title: string,
    description: string,
    tags: [string], // keywords to add related to issue
    created_at: ISODate(), // date the ticket was submitted
    updated_at: ISODate(), // date the ticket was recently updated
    status: “not started” | “in progress” | “complete”,
    priority: "low" | "medium" | "high",
    assigned_to: ObjectId() // assign ticket to team
    server: ObjectId(), // default to the central server id, change servers to assign the ticket there
    history: [ // New field for audit logs
        {
            event: string, // e.g., "status_change", "assignment"
            changed_by: ObjectId(), // Reference to Accounts._id
            timestamp: ISODate(),
            details: string // Additional context
        }
    ]

}
```

## `Servers` collection
### Central Server
```typescript
{
    _id: ObjectId(),
    name: string, // e.g. Iowa McDonalds Server
    server_type: string, // e.g. central
    region: string, // e.g. us-east-1
    teams: [] // make sure no teams assigned for central server
}
```
### Other Servers
```typescript
{
    _id: ObjectId(),
    name: string, // e.g. Detroit McDonalds server
    server_type: string, // e.g. regional
    region: string, // e.g. us-east-1
    teams: [ObjectId()] // get id of each team
}
```

## `Teams` collection
```typescript
{
    _id: ObjectId(),
    company: string, // e.g. McDonalds
    category: string, // e.g. search, support, technical, etc.
    members: [ObjectId()] // get id of accounts from company

}
```

# Tech Stack
- Typescript + Express.js (Backend framework)
- MongoDB (NoSQL database)

# Setup
this is how to setup express.js environment with typescript using pnpm
1. `pnpm init` // creates package.json file
2. `pnpm add express` // installs express
3. `pnpm add -D typescript @types/node @types/express ts-node` // installs typescript + types for node and express
4. `npx tsc --init` // creates tsconfig.json file
5. replace code in `tsconfig.json` with this:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "skipLibCheck": true
  }
}
```
6. Create a `src` folder, then make a file like `src/index.ts`:
```typescript
import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```
7. add scripts in `package.json`:
```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "ts-node src/index.ts"
}
```
8. run app
for development: 
```
pnpm run dev
```
for production: 
```
pnpm run build
pnpm start
```