const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Import Discord automation
const discordAutomation = require('./discord-automation');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory task store (in production, use a database)
let tasks = {
  active: [],
  upcoming: [],
  completed: []
};

// Initialize with sample tasks
const initializeTasks = () => {
  tasks = {
    active: [
      {
        id: uuidv4(),
        title: 'Setup Discord Bot',
        description: 'Configure bot for Elite Finds rep spreadsheet automation',
        status: 'in-progress',
        priority: 1,
        createdAt: new Date(Date.now() - 30 * 60000),
        startedAt: new Date(Date.now() - 20 * 60000),
        estimatedDuration: 45,
        progress: 60
      }
    ],
    upcoming: [
      {
        id: uuidv4(),
        title: 'Build Notion Dashboard',
        description: 'Create organization system for trading, gym, tasks',
        status: 'scheduled',
        priority: 2,
        createdAt: new Date(),
        scheduledFor: new Date(Date.now() + 2 * 60 * 60000),
        estimatedDuration: 90,
        progress: 0
      },
      {
        id: uuidv4(),
        title: 'Configure Email Monitoring',
        description: 'Set up Gmail integration with OpenClaw',
        status: 'scheduled',
        priority: 3,
        createdAt: new Date(),
        scheduledFor: new Date(Date.now() + 4 * 60 * 60000),
        estimatedDuration: 30,
        progress: 0
      }
    ],
    completed: [
      {
        id: uuidv4(),
        title: 'Create USER.md',
        description: 'Document Jackson\'s profile and preferences',
        status: 'completed',
        priority: 1,
        createdAt: new Date(Date.now() - 2 * 60 * 60000),
        completedAt: new Date(Date.now() - 1.5 * 60 * 60000),
        duration: 30,
        progress: 100
      },
      {
        id: uuidv4(),
        title: 'Initial Setup',
        description: 'Configure workspace and memory files',
        status: 'completed',
        priority: 1,
        createdAt: new Date(Date.now() - 3 * 60 * 60000),
        completedAt: new Date(Date.now() - 2.5 * 60 * 60000),
        duration: 25,
        progress: 100
      }
    ]
  };
};

initializeTasks();

// Function to add a task externally
const addTask = (title, description, priority = 3, estimatedDuration = 30) => {
  const newTask = {
    id: uuidv4(),
    title,
    description,
    status: 'active',
    priority: Math.max(1, Math.min(5, priority)),
    createdAt: new Date(),
    startedAt: new Date(),
    estimatedDuration,
    progress: 0
  };
  tasks.active.push(newTask);
  return newTask;
};

// Routes

// API: Add task externally
app.post('/api/tasks/external', (req, res) => {
  const { title, description, priority, estimatedDuration } = req.body;
  const task = addTask(title, description, priority, estimatedDuration);
  res.status(201).json(task);
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  const stats = {
    totalActive: tasks.active.length,
    totalUpcoming: tasks.upcoming.length,
    totalCompleted: tasks.completed.length,
    completedToday: tasks.completed.filter(t => {
      const today = new Date().toDateString();
      return new Date(t.completedAt).toDateString() === today;
    }).length
  };

  res.json({
    tasks,
    stats
  });
});

// Create new task
app.post('/api/tasks', (req, res) => {
  const { title, description, priority = 3, estimatedDuration = 30, scheduledFor = null } = req.body;

  const newTask = {
    id: uuidv4(),
    title,
    description,
    status: scheduledFor ? 'scheduled' : 'active',
    priority: Math.max(1, Math.min(5, priority)),
    createdAt: new Date(),
    scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
    estimatedDuration,
    progress: 0,
    startedAt: scheduledFor ? null : new Date()
  };

  if (scheduledFor) {
    tasks.upcoming.push(newTask);
  } else {
    tasks.active.push(newTask);
  }

  res.status(201).json(newTask);
});

// Update task status
app.patch('/api/tasks/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  let task = tasks.active.find(t => t.id === id) ||
             tasks.upcoming.find(t => t.id === id) ||
             tasks.completed.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Move task between lists based on status
  if (status === 'completed') {
    const duration = Math.round((new Date() - new Date(task.startedAt)) / 60000);
    task.completedAt = new Date();
    task.duration = duration;
    task.progress = 100;

    tasks.active = tasks.active.filter(t => t.id !== id);
    tasks.upcoming = tasks.upcoming.filter(t => t.id !== id);
    tasks.completed.push(task);
  } else if (status === 'paused') {
    task.status = 'paused';
  } else if (status === 'cancelled') {
    tasks.active = tasks.active.filter(t => t.id !== id);
    tasks.upcoming = tasks.upcoming.filter(t => t.id !== id);
  }

  task.status = status;
  res.json(task);
});

// Update task progress
app.patch('/api/tasks/:id/progress', (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;

  let task = tasks.active.find(t => t.id === id) ||
             tasks.upcoming.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.progress = Math.max(0, Math.min(100, progress));
  res.json(task);
});

// Update task priority
app.patch('/api/tasks/:id/priority', (req, res) => {
  const { id } = req.params;
  const { priority } = req.body;

  let task = tasks.active.find(t => t.id === id) ||
             tasks.upcoming.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.priority = Math.max(1, Math.min(5, priority));
  res.json(task);
});

// Reorder tasks
app.post('/api/tasks/reorder', (req, res) => {
  const { activeOrder, upcomingOrder } = req.body;

  if (activeOrder) {
    const orderedActive = activeOrder.map(id =>
      tasks.active.find(t => t.id === id)
    ).filter(Boolean);
    tasks.active = orderedActive;
  }

  if (upcomingOrder) {
    const orderedUpcoming = upcomingOrder.map(id =>
      tasks.upcoming.find(t => t.id === id)
    ).filter(Boolean);
    tasks.upcoming = orderedUpcoming;
  }

  res.json({ success: true });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Test Discord connection
app.get('/api/discord/test', async (req, res) => {
  try {
    await discordAutomation.testDiscordConnection();
    res.json({ status: 'success', message: 'Discord bot connection verified' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  let localIP = 'localhost';
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIP = iface.address;
        break;
      }
    }
  }
  
  console.log(`📊 Task Dashboard running`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Network: http://${localIP}:${PORT}`);
});
