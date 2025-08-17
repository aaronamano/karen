# Overview
A backend platform for handling customer complaints by managing tickets. This acts as a virtual data farm of tickets, which are dealt with and distributed to various teams on other virtual servers so that they can resolve it.
- <b>Why: </b> To practice backend development, managing databases, and possibly handling cloud-related stuff.
- <b>Who: </b> For teams working on a large scale project, big companies, etc.
- <b>Uniqueness: </b> Implementing AI-based features such as automatically distributing tickets, handling complaints resolved with FAQ, sending notifications to 3rd party services, prioritizing urgency/severity, etc.

# Use Cases
## Account management
- create account
- create account (admin)
- log in
- sign in
- delete account
- reset password

## Ticket operations
- creating ticket
- submitting ticket to central database
- deleting tickets (admin)
- change and track ticket status (admin)
- send notification of ticket to other teams or 3rd party services (admin)

## Ticket management
- storing tickets on central database
- distribute and transfer tickets from central database

# API Routes
## Account management
### User
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
## `Accounts` collections
```
{
    _id: ObjectId(),
    name: string, // e.g. Tim Cheese
    username: string, // e.g. timcheese67
    password: string,
    type: string = "personal" | "work",
    role: string = "customer" | "employee",
    company: string // e.g. McDonalds or University of Michigan

}
```

## `Tickets` collections
```
{
    _id: ObjectId(),
    title: string,
    description: string,
    tags: [string], // keywords to add related to issue
    created_at: ISODate(), // date the ticket was submitted
    status: string = “not started” | “in progress” | “complete”,
    server: ObjectId() // default to the central server id, change servers to assign the ticket there

}
```

## `Servers` collection
### Central Server
```
{
    _id: ObjectId(),
    name: string, // e.g. Iowa McDonalds Server
    region: string, // e.g. us-east-1
    teams: None // no teams assigned for central server
}
```
### Other Servers
```
{
    _id: ObjectId(),
    name: string, // e.g. Detroit McDonalds server
    region: string, // e.g. us-east-1
    teams: [ObjectId()] // get id of each team
}
```

## `Teams` collection
```
{
    _id: ObjectId(),
    company: string, // e.g. McDonalds
    category: string, // e.g. Search Team
    members: [ObjectId()] // get id of accounts from company

}
```

# Tech Stack
## Framework
- Javascript/Typescript (Express.js)
- ~~Python (FastAPI)~~
## Database
- MongoDB (NoSQL)
- ~~Supabase (SQL)~~
- ~~Firebase (NoSQL, GCP)~~

# Diagrams
<img width="664" height="719" alt="Screenshot 2025-08-16 at 12 45 47 AM" src="https://github.com/user-attachments/assets/ddfa6a88-6b13-46bb-863f-165d5fc2d67b" />
<img width="1250" height="802" alt="Screenshot 2025-08-16 at 12 44 51 AM" src="https://github.com/user-attachments/assets/06ae10d4-bcae-456f-9dac-b3b67b7ac23d" />

