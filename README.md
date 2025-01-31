# Event Management Backend

This is the backend for an event management application. It provides APIs for user authentication, event creation, and participant registration.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- bcrypt
- nodemailer

## Setup Instructions

1. Clone the repository:
    ```bash
    git clone https://github.com/the41monster/event-management-backend/
    cd event-management-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    MONGODB_URI=<your-mongodb-uri>
    SECRET_KEY=<your-secret-key>
    EMAIL_USER=<your-email>
    EMAIL_PASSWORD=<your-email-password>
    PORT=<your-port> # Optional, default is 3000
    ```

4. Start the server:
    ```bash
    npm start
    ```

## API Endpoints

### Authentication

- `POST /auth/register`: Register a new user
- `POST /auth/login`: Login a user

### Events

- `POST /events`: Create a new event (requires organizer role)
- `GET /events`: Get all events
- `GET /events/:id`: Get event by ID
- `PUT /events/:id`: Update event by ID (requires organizer role)
- `DELETE /events/:id`: Delete event by ID (requires organizer role)
- `POST /events/:id/register`: Register for an event

## Running Tests

To run tests, use the following command:
```bash
npm test
```
