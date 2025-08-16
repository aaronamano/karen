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
### Admin
- [ ] POST /account/admin
- [ ] GET /account/admin/{id}/login
- [ ] PUT /account/admin/{id}/reset-password
- [ ] DELETE /account/admin/{id}

## Ticket operations
### User
- [ ] POST /ticket/{central_server_id}

### Admin
- [ ] DELETE /ticket/{id}
- [ ] PUT /ticket/{id}/status
- [ ] POST /ticket/{id}/notification

## Ticket management
- [ ] GET /tickets/{central_server_id}/{ids}
- [ ] POST /tickets/{central_server_id}/{ids}/distribute/{server_id}

# Database Schema
## Accounts
- user_id: uuid
- name: string
- username: string
- password: string
- admin: boolean

## Ticket Creation
- ticket_id: uuid
- title: string
- description: string
- tags: [string]

## Ticket handling
- ticket_id: uuid
- tags: [string]
- status: string = “not started” | “in progress” | “complete”

# Tech Stack
## Framework
- Javascript/Typescript (Express.js)
- ~~Python (FastAPI)~~
## Database
- MongoDB (NoSQL)
- ~~Supabase (SQL)~~
- ~~Firebase (NoSQL, GCP)~~

<img width="664" height="719" alt="Screenshot 2025-08-16 at 12 45 47 AM" src="https://github.com/user-attachments/assets/ddfa6a88-6b13-46bb-863f-165d5fc2d67b" />
<img width="1250" height="802" alt="Screenshot 2025-08-16 at 12 44 51 AM" src="https://github.com/user-attachments/assets/06ae10d4-bcae-456f-9dac-b3b67b7ac23d" />

