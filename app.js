const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require("socket.io");

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const chatRoomRoutes = require('./routes/chatRoomRoutes');
const webRoutes = require('./routes/webRoutes'); // Import web routes
const connectDB = require('./config/db'); // Corrected import
const { swaggerUi, swaggerDocs } = require('./swagger'); // Import Swagger
const bodyParser = require('body-parser'); // Ensure this is imported
const path = require('path'); // Ensure this is imported
const expressLayouts = require('express-ejs-layouts'); // Import express-ejs-layouts

require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

// Connect to MongoDB
connectDB();
// Set the view engine to EJS
 

// Set views directory

// Define the default layout
app.set('layout', 'layout'); // Specify the layout file to use

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/rooms', chatRoomRoutes);

// Add web routes
app.use('/', webRoutes); // This mounts the webRoutes at the root URL

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Initialize Socket.IO 
const io = socketIO(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/chat', async (req, res) => {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.render('chat', { messages });
});

// Socket.IO logic
io.on('connection', (socket) => {
    console.log('New user connected');

    // Send chat history to newly connected user
    Message.find().sort({ timestamp: 1 }).then((messages) => {
        socket.emit('chatHistory', messages);
    });

    // Listen for new messages
    socket.on('sendMessage', (data) => {
        const newMessage = new Message(data);
        newMessage.save().then(() => {
            io.emit('newMessage', newMessage); // Broadcast to all users
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
