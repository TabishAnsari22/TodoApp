const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 8000; 
app.use(cors());
app.use(express.json());

const mongodbUrl = 'mongodb+srv://tabishansari183:tZDIegXn2yxQN663@todo.6sx33vz.mongodb.net';

mongoose.connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const todoSchema = new mongoose.Schema({
    text: String,
    textId: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  });

const Todo = mongoose.model('Todo', todoSchema);

// Get all todo items
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find({});
    console.log('Todos', todos); 
    res.json(todos);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new todo item
app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    console.log(req.body,'text');
    const newTodo = new Todo({ text });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a todo item by ID
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    console.log();
    const updatedTodo = await Todo.findByIdAndUpdate(id, { text }, { new: true });
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/todos/:textId', async (req, res) => {
  try {
      const { textId } = req.params;
      console.log(textId, 'text===id');
      const deletedTodo = await Todo.deleteOne({ _id: textId });
      if (deletedTodo.deletedCount === 0) {
          return res.status(404).json({ error: 'Todo not found' });
      }
      res.sendStatus(204);
  } catch (err) {
      console.log('delete error:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// delete all
app.delete('/api/todos', async (req, res) => {
  try {
    await Todo.deleteMany({});
    res.json({ message: 'All todos deleted successfully' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});