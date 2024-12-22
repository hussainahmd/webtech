const express = require('express');
const router = express.Router();

router.get('/cookies-manager', (req, res) => {
    const cookies = req.cookies;
    res.render('cookies-manager', { cookies, recentPages: req.session.recentPages });
});

router.post('/cookies-manager', (req, res) => {
    const updatedCookies = req.body.cookies || [];
    Object.keys(updatedCookies).forEach((key) => {
        if (updatedCookies[key]) {
            res.cookie(key, updatedCookies[key]);
        } else {
            res.clearCookie(key);
        }
    });
    res.redirect('/cookies-manager');
});

router.post('/cookies-manager/add', (req, res) => {
    const { cookieName, cookieValue } = req.body;
    if (cookieName && cookieValue) {
        res.cookie(cookieName, cookieValue);
    }
    res.redirect('/cookies-manager');
});

router.delete('/cookies-manager', (req, res) => {
    const cookieName = req.query.name;
    if (cookieName) {
        res.clearCookie(cookieName);
    }
    res.sendStatus(200);
});

router.get('/cookie1', (req, res) => {
    const token = req.cookies.token || Math.random().toString(36).substring(2);
    const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
    const lastVisit = parseInt(req.cookies.last_visit_timestamp) || currentTimestamp;

    const timeSinceLastVisit = currentTimestamp - lastVisit;

    // Set cookies
    res.cookie('token', token, { httpOnly: true });
    res.cookie('last_visit_timestamp', currentTimestamp.toString(), { httpOnly: true });

    // Render the template with data
    res.render('cookie1', {
        token,
        lastVisit,
        timeSinceLastVisit,
        currentTimestamp,
        recentPages: req.session.recentPages
    });
});

module.exports = router;