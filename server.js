const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const app = express();

const tasks = [];

// app.use(cors());

// app.use(express.static(path.join(__dirname, '/client/build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/client/build/index.html'));
// });

const server = app.listen(8000, () => {
  console.log('Server running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log(socket.id);
  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (taskId) => {
    const taskIndex = tasks.findIndex((elem) => elem.id === taskId);
    tasks.splice(taskIndex, 1);
    socket.broadcast.emit('removeTask', taskId);
  });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
