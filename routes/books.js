const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const booksFile = path.join(__dirname, '../data/books.json');

// Helper functions
const getBooks = () => JSON.parse(fs.readFileSync(booksFile, 'utf8') || '[]');
const saveBooks = (books) => fs.writeFileSync(booksFile, JSON.stringify(books, null, 2));

router.get('/add-book', (req, res) => {
    res.render('add-book', { recentPages: req.session.recentPages });
});

//from the form in add-book.ejs, the data is sent to this route
router.post('/add-book', (req, res) => {
    const { title, author, year, publisher } = req.body;
    const books = getBooks();

    let book = { id: Date.now(), title, author, year, publisher };

    if (req.files && req.files.image) {
        book.image = handleFileUpload(req.files.image);
    }

    books.push(book);
    saveBooks(books);
    res.render('show-book-info', { book, recentPages: req.session.recentPages });
});

// Get the add or update form for a specific book
router.get('/update-book/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const books = getBooks();
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).send('Book not found');
    }

    res.render('add-book', { book, recentPages: req.session.recentPages });  // Reusing the add-book view for update
});

// Handle the update submission
router.post('/update-book/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const { title, author, year, publisher } = req.body;
    const books = getBooks();
    let book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).send('Book not found');
    }

    // Update the book data
    book.title = title;
    book.author = author;
    book.year = year;
    book.publisher = publisher;

    // Handle image upload if a new image is selected
    if (req.files && req.files.image) {
        book.image = handleFileUpload(req.files.image);
    }

    // Save updated books list
    saveBooks(books);
    res.redirect('/dashboard');
});

router.get('/dashboard', (req, res) => {
    const books = getBooks();
    res.render('dashboard', { books, recentPages: req.session.recentPages });
});

router.delete('/dashboard/:id', (req, res) => {
    const books = getBooks().filter((book) => book.id != req.params.id);
    saveBooks(books);
    res.status(200).send({ message: 'Book removed' });
});

function handleFileUpload(file) {
    const imagePath = `/static/images/${file.name}`;
    file.mv(path.join(__dirname, '../public/images', file.name));
    return imagePath;
}

module.exports = router;
