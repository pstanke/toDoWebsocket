import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [socket, setSocket] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    // local WebSocket server running on port 8000 The second argument is options,  it is specifying that only the 'websocket' transport should be used (not long polling or other fallbacks).
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);

    socket.on('updateData', (tasks) => {
      updateData(tasks);
    });

    socket.on('addTask', (task) => {
      addTask(task);
    });

    socket.on('removeTask', (taskId) => {
      removeTask(taskId);
    });
  }, []);

  const updateData = (tasksData) => {
    setTasks(tasksData);
  };

  const removeTask = (taskId, onClient) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== taskId));
    if (onClient) {
      socket.emit('removeTask', taskId);
    }
  };

  const addTask = (task) => {
    setTasks((tasks) => [...tasks, task]);
    setTaskName('');
  };

  const submitForm = (e) => {
    e.preventDefault();
    const task = { name: taskName, id: uuidv4() };
    addTask(task);
    socket.emit('addTask', task);
  };

  return (
    <div className='App'>
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className='tasks-section' id='tasks-section'>
        <h2>Tasks</h2>

        <ul className='tasks-section__list' id='tasks-list'>
          {tasks.map((task) => (
            <li key={task.id} className='task'>
              {task.name}
              <button
                className='btn btn--red'
                onClick={() => removeTask(task.id, true)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <form id='add-task-form' onSubmit={(e) => submitForm(e)}>
          <input
            className='text-input'
            type='text'
            placeholder='Type your description'
            id='task-name'
            onChange={(e) => setTaskName(e.target.value)}
            value={taskName}
          />
          <button className='btn' type='submit'>
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
