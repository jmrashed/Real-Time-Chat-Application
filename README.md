# Real-Time Chat Application

This is a real-time chat application with file-sharing capabilities built using **Node.js**, **Express**, **Socket.IO**, and **MongoDB**. It allows users to join chat rooms, send and receive messages in real-time, and share files efficiently using Node.js streams and buffers. The chat history, user information, and file metadata are stored in MongoDB.

## Features

- **Real-time Communication:** Users can send and receive messages in real-time using Socket.IO.
- **File Sharing:** Efficient file uploads/downloads using streams and buffers.
- **Authentication:** Users can sign up, log in, and authenticate using JWT (JSON Web Tokens).
- **Chat History:** Chat messages and file metadata are stored in MongoDB and can be retrieved when users join chat rooms.
- **Scalability Considerations:** The application is designed to handle multiple concurrent users without performance degradation.
  
## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: Web framework for Node.js.
- **Socket.IO**: Library for real-time, bidirectional communication between web clients and servers.
- **MongoDB**: NoSQL database for storing chat history, user data, and file metadata.
- **JWT**: JSON Web Tokens for secure user authentication.
- **Streams & Buffers**: Used to handle file uploads/downloads without blocking the server.

## Project Structure

```bash
.
├── config/
│   └── db.js                # MongoDB connection configuration
├── controllers/
│   └── chatController.js     # Handles chat-related functionality
├── middlewares/
│   └── authMiddleware.js     # JWT authentication middleware
├── models/
│   ├── ChatMessage.js        # Mongoose schema for chat messages
│   └── User.js               # Mongoose schema for users
├── routes/
│   ├── authRoutes.js         # Routes for user authentication
│   └── chatRoutes.js         # Routes for chat functionality
├── services/
│   └── socketService.js      # Socket.IO setup and configuration
├── views/                    # EJS templates for rendering HTML
├── public/
│   ├── css/
│   │   └── styles.css        # Custom styles
├── tests/
│   ├── auth.test.js          # Unit tests for authentication
│   └── chat.test.js          # Unit tests for chat functionality
├── .env                      # Environment variables
├── Dockerfile                # Docker configuration
├── socket.js                 # Socket.IO server configuration
├── app.js                    # Main application entry point
└── package.json              # Project dependencies and scripts
```

## Installation

### Prerequisites

- **Node.js** (version >= 14)
- **MongoDB** (make sure it is running locally or in the cloud)
- **Docker** (if you want to use Docker)

### Step-by-Step Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/realtime-chat-app.git
    cd realtime-chat-app
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Create a `.env` file:** 

    Create a `.env` file in the root directory and add the following:

    ```
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/realtime-chat-app
    JWT_SECRET=your_secret_key
    ```

4. **Start the MongoDB server** (if it's not already running):

    ```bash
    mongod
    ```

5. **Start the application:**

    ```bash
    npm start
    ```

6. **Access the application:**

    Open your browser and navigate to `http://localhost:3000`.

## Running Tests

To run the tests, execute the following command:

```bash
npm test
```

## Docker Setup

To run the application using Docker, follow these steps:

1. **Build the Docker image:**

    ```bash
    docker build -t realtime-chat-app .
    ```

2. **Run the Docker container:**

    ```bash
    docker run -d -p 3000:3000 realtime-chat-app
    ```

3. **Access the application in your browser:**

    Navigate to `http://localhost:3000`.

## Postman Documentation

You can find the API documentation for authentication and chat routes [here](your-postman-documentation-link).

## Scalability Considerations

- **Horizontal Scaling:** Use clustering or deploy the app across multiple instances using a load balancer.
- **Redis:** Use Redis as a session store for scalability with Socket.IO to handle WebSocket sessions across multiple instances.
- **Database Optimization:** Ensure MongoDB is indexed properly for optimal query performance.
- **Rate Limiting:** Implement rate limiting and throttling to prevent abuse and control API access.

## Error Handling

The application includes basic error handling for:

- Invalid JWT tokens
- User authentication errors
- File upload errors
- Database connection issues

## Additional Features (Bonus)

- **Dockerization:** The application is Dockerized for easy deployment.
- **Deployment:** Easily deployable to cloud platforms like AWS, Heroku, or DigitalOcean.

## Future Improvements

- Implementing private messaging between users
- Enabling notifications for new messages or file uploads
- Adding features for group chat rooms with multiple users
- Adding real-time notifications via WebSockets
- Enhancing the authentication flow with OAuth or social login

## License

This project is licensed under the MIT License. 