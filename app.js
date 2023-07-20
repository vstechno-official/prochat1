const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('posts.db');

// Create a table for storing posts
db.run(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    message TEXT NOT NULL
  )
`);

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// API endpoint for posting messages
app.post('/post', (req, res) => {
  const { username, message } = req.body;

  // Insert the post into the database
  db.run('INSERT INTO posts (username, message) VALUES (?, ?)', [username, message], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error posting the message');
    }
    return res.send('Message posted successfully');
  });
});

// API endpoint for fetching all posts
app.get('/posts', (req, res) => {
  db.all('SELECT * FROM posts', (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching posts');
    }
    return res.json(rows);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
