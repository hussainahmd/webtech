const express = require('express');
const router = express.Router();

// Remove all visited pages
router.get('/remove-all', (req, res) => {
    req.session.recentPages = [];
    res.redirect('/'); // Redirect to home page
});

// Remove a specific page
router.get('/remove/:url', (req, res) => {
    const urlToRemove = decodeURIComponent(req.params.url);
    req.session.recentPages = req.session.recentPages.filter(page => page.url !== urlToRemove);
    res.redirect('/'); // Redirect to home page
});

module.exports = router;
