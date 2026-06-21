const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsameusername = users.filter(
    (user) => user.username === username
  );
  return userswithsameusername.length > 0;
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter(
    (user) => user.username === username && user.password === password
  );
  return validusers.length > 0;
}

// Login
regd_users.post("/login", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({
      message: "Error logging in"
    });
  }

  if (authenticatedUser(username, password)) {

    let accessToken = jwt.sign(
      {
        data: password
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({
      message: "Login successful"
    });
  }

  return res.status(208).json({
    message: "Invalid Login. Check username and password"
  });
});

// Add / Modify Review
regd_users.put("/auth/review/:isbn", (req, res) => {

  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization.username;

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});

// Delete Review
regd_users.delete("/auth/review/:isbn", (req, res) => {

  let isbn = req.params.isbn;
  let username = req.session.authorization.username;

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];

    return res.status(200).json({
      message: "Review deleted successfully"
    });
  }

  return res.status(404).json({
    message: "Review not found"
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
