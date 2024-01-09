// server.js

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Replace with your MySQL password
  database: 'vinay',
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

// SQL Injection Prevention: Use parameterized queries
app.post('/add', (req, res) => {
  const { task, completed } = req.body;

  pool.query('INSERT INTO application (task, completed) VALUES (?, ?)', [task, completed], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('Inserted new record:', results);
    res.json({ success: true, message: 'Todo added successfully' });
  });
});


app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM application WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
      return;
    }

    console.log('Deleted record:', results);
    res.json({ success: true, message: 'Todo deleted successfully' });
  });
});

app.get('/', (req, res) => {
  pool.query('SELECT * FROM application', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const todos = results;
    res.json(todos); // Return JSON data for API endpoint
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
