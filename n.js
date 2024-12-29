const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
const PORT_NUMBER = 3000;

app.use(cookieParser());
app.use(session({ secret: "this is secret key. dont disclose it" }));

// Session Management

app.get("/session-test", function (req, res) {

    if (req.session.pageViews) {
        req.session.pageViews++;
        res.send("You visited this page " + req.session.pageViews + " times. ");
    } else {
        req.session.pageViews = 1;

        res.send("Welcome to this page for the first time!");
    }
});


app.get("/session-test2", function (req, res) {

    // You can send custom headers to browser like this:
    // here we are setting, so that browser treat the response payload as html and parse it

    //res.setHeader("Content-type", "text/html");

    if (req.session.userLoggedIn) {
        res.write(`<br >User is logged in ... Welcome ${req.session.userName} <br> `);
    } else {
        res.write('<br> User is not logged in ... ');
    }

    if (!req.session.userLoggedIn) {
        req.session.userLoggedIn = true;
        req.session.userName = "Asif";
        res.write("Welcome to this page for the first time!");
    }
    res.send();
});



// Start server to listen for request at some port.
app.listen(PORT_NUMBER, () => {
    console.log(`Server is listening at ${PORT_NUMBER}`);
});