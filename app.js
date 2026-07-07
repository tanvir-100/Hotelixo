require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const PORT = process.env.PORT || 8080;
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const dns = require('dns');//solving mongo errorr

const listingRouter = require('./routes/listing');
const reviewRouter = require('./routes/review');
const userRouter = require('./routes/user');

// //changing dns settings to solve mongo error
dns.setServers(['1.1.1.1', '8.8.8.8']);

const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

// MongoDB session store configuration
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {secret: process.env.SESSION_SECRET},
    touchAfter: 24 * 60 * 60 // time period in seconds
});

store.on("error", function(e){
    console.log("MongoDB Session store error", e);
});

// Session configuration
const sessionOptions = {
    store: store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}; 

// app.get('/', (req, res) => {
//     res.send("Hello World");
// });



app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware to set flash messages in response locals
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user; // Make the authenticated user available in all templates
    res.locals.currentPath = req.path;
    next();
});
 
// //demo user creation route
// app.get('/demouser', async (req, res) => {
//     let fakeUser = new User({ 
//         email: 'demo@example.com', 
//         username: 'demoUser' 
//     });
//     let registeredUser = await User.register(fakeUser, 'demopassword');
//       res.send(registeredUser);
// });


//listings routes
app.use('/listings', listingRouter);
//reviews routes
app.use('/listings/:id/reviews', reviewRouter);
//user routes
app.use('/', userRouter);


// Error handling middleware for 404 - catch all unknown routes
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render('error.ejs',{message});
    // res.status(statusCode).send(message);
});

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});