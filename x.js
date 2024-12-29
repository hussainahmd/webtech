const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
const PORT_NUMBER = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "this is secret key. dont disclose it" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/home", (req, res) => {
    let model = {};
    if ("message" in req.session) {
        model.message = req.session.message;
        req.session.message = undefined;
    }
    res.render("users/home", model);
});

app.get("/login", (req, res) => {
    let model = {};
    console.log("/login request received.");

    if ("message" in req.session) {
        model.message = req.session.message;
    }
    if ("message" in req.query) {
        model.message = req.query.message;
    }

    model.session_id = "asdfadsfads";
    res.render("users/login", model);
});

app.post("/login", (req, res) => {
    let model = {};
    console.log("Post request received at /login URL pattern.");

    if ("username" in req.body && "password" in req.body) {
        console.log("username and password received.");

        let username = req.body.username;
        let password = req.body.password;

        if (username == 'test' && password == 'test') {
            console.log("username and passwod are valid.");

            req.session.userLoggedIn = true;
            req.session.message = undefined;
            res.redirect("/home");

        } else {
            //req.session.message = "Incorrect username or password.";
            //model.message = "Incorrect username or password";
            res.redirect("login?message=Incorrect username or password");
        }
    } else {
        res.send("invalid request... username and password are required to login.")
    }
});

app.get('/dashboard', (req, res) => {
    if (req.session.userLoggedIn) {
        res.render("users/dashboard");
    } else {
        req.session.message = "User must be login to access Dashboard."
        res.redirect("/login");
    }
})

app.get("/logout", (req, res) => {
    req.session.userLoggedIn = undefined;
    req.session.message = "Logout successfully."
    res.redirect("/home");
})

// Start server to listen for request at some port.
app.listen(PORT_NUMBER, () => {
    console.log(`Server is listening at ${PORT_NUMBER}`);
})