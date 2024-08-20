const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get the book list using Promise callbacks
public_users.get('/books/promises', function (req, res) {
    axios.get('http://localhost:5000/')
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(500).json({ message: 'Error retrieving books', error: error.message });
        });
});

// Get the book list using async-await
public_users.get('/books/async', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving books', error: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
 });

 // Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/promises/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(404).json({ message: 'Book not found', error: error.message });
        });
});

// Get book details based on ISBN using async-await
public_users.get('/isbn/async/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: 'Book not found', error: error.message });
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();
    const matchingBooks = [];

    // Iterate through the books object to find matching authors
    Object.keys(books).forEach(key => {
        if (books[key].author.toLowerCase() === author) {
            matchingBooks.push(books[key]);
        }
    });

    // Check if there are any matching books
    if (matchingBooks.length > 0) {
        res.json(matchingBooks);
    } else {
        res.status(404).json({ message: 'No books found by this author' });
    }
});
// Get book details based on author using Promise callbacks
public_users.get('/author/promises/:author', function (req, res) {
    const author = req.params.author.toLowerCase();

    axios.get(`http://localhost:5000/author/${author}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(404).json({ message: 'Books not found by this author', error: error.message });
        });
});

// Get book details based on author using async-await
public_users.get('/author/async/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();

    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: 'Books not found by this author', error: error.message });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();
    let matchingBook = null;

    // Iterate through the books object to find the matching title
    Object.keys(books).forEach(key => {
        if (books[key].title.toLowerCase() === title) {
            matchingBook = books[key];
        }
    });

    // Check if there is a matching book
    if (matchingBook) {
        res.json(matchingBook);
    } else {
        res.status(404).json({ message: 'No book found with this title' });
    }
});

// Get book details based on title using Promise callbacks
public_users.get('/title/promises/:title', function (req, res) {
    const title = req.params.title.toLowerCase();

    axios.get(`http://localhost:5000/title/${title}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(404).json({ message: 'Book not found with this title', error: error.message });
        });
});

// Get book details based on title using async-await
public_users.get('/title/async/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();

    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: 'Book not found with this title', error: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    const book = books[isbn];

    // Check if the book with the given ISBN exists
    if (book) {
        res.json(book.reviews);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

module.exports.general = public_users;
