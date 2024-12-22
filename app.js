const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');
const booksRoutes = require('./routes/books.js');
const operationsRoutes = require('./routes/operations.js');
const cookiesRoutes = require('./routes/cookies.js');
const recentPagesRoutes = require('./routes/recentPages.js');
const session = require('express-session');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: 'secretKey',
        resave: false,
        saveUninitialized: true,
    })
);

// Middleware to track visited pages
app.use((req, res, next) => {
    if (!req.session.recentPages) {
        req.session.recentPages = [];
    }

    const currentPage = { name: req.path === '/' ? 'Home' : req.path.slice(1), url: req.originalUrl };

    // Avoid duplicates and move to the top
    req.session.recentPages = req.session.recentPages.filter(page => page.url !== currentPage.url);
    req.session.recentPages.unshift(currentPage);

    // Limit to 10 pages
    if (req.session.recentPages.length > 10) {
        req.session.recentPages.pop();
    }

    next();
});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', booksRoutes);
app.use('/', operationsRoutes);
app.use('/', cookiesRoutes);
app.use('/', recentPagesRoutes);

// Home Page
app.get('/', (req, res) => {
    res.render('home');
});

// Server Start
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
