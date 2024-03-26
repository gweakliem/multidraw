const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongodb = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// MongoDB connection URL
const mongoURL = 'mongodb://localhost:27017';

// Serve static files from the "public" directory
app.use(express.static('public'));

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// WebSocket connection
io.on('connection', (socket) => {
  // Handle WebSocket events
  socket.on('login', (userData) => {
    // Save user data to MongoDB
    mongodb.MongoClient.connect(mongoURL, (err, client) => {
      if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
      }
      const db = client.db('drawing_app');
      const usersCollection = db.collection('users');
      usersCollection.insertOne(userData, (err, result) => {
        client.close();
      });
    });

    // Broadcast user login to all clients
    io.emit('userLogin', userData);
  });

  socket.on('draw', (strokeData) => {
    // Broadcast stroke data to all clients
    io.emit('stroke', strokeData);
  });

  // Handle other WebSocket events as needed
});