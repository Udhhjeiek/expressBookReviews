const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({
      message: "Unable to register user."
    });
  }

  if (!isValid(username)) {
    users.push({ username, password });

    return res.status(200).json({
      message: "User successfully registered. Now you can login"
    });
  }

  return res.status(404).json({
    message: "User already exists!"
  });
});

// Task 1 - Get all books
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2 - Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
});

// Task 3 - Get books by author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;

  let filteredBooks = Object.keys(books)
    .filter(key => books[key].author === author)
    .reduce((obj, key) => {
      obj[key] = books[key];
      return obj;
    }, {});

  return res.status(200).json(filteredBooks);
});

// Task 4 - Get books by title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;

  let filteredBooks = Object.keys(books)
    .filter(key => books[key].title === title)
    .reduce((obj, key) => {
      obj[key] = books[key];
      return obj;
    }, {});

  return res.status(200).json(filteredBooks);
});

// Task 5 - Get book reviews
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

/* ===========================
   TASKS 10-13 (ASYNC/AWAIT)
   =========================== */

// Task 10 - Get all books using async/await + axios
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Task 11 - Get book by ISBN using async/await + axios
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;

    const response = await axios.get(
      `http://localhost:5000/isbn/${isbn}`
    );

    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Task 12 - Get books by author using async/await + axios
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;

    const response = await axios.get(
      `http://localhost:5000/author/${author}`
    );

    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Task 13 - Get books by title using async/await + axios
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title;

    const response = await axios.get(
      `http://localhost:5000/title/${title}`
    );

    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports.general = public_users;