//* if running on development mode (not run on production mode) 
//* include dotenv module to access a env file
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const $port = process.env.PORT || 2500;
const path = require('path');
const mongoose = require('mongoose');
const EJSengine = require('ejs-mate')
const methodOverride = require('method-override')
const ErrorStatus = require('./err/ErrHandler')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')

const MongoDBStore = require('connect-mongo')(session);

const userRoutes = require('./routers/userRouters')
const campgroundRoutes = require('./routers/campRouters')
const reviewRoutes = require('./routers/reviewRouters')
const otherRoutes = require('./routers/otherRouters');
const dbUrl = 'mongodb://localhost:27017/CampGround';
// const dbUrl = 'mongodb://localhost:27017/CampGround';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const secret = process.env.SECRET_CODE || 'rty1245';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 3600 //* update every 1 day
})

store.on("error", function(e) {
    console.log("SESSION STORE ERROR HAVE BEEN OCCURRING!", e );
})

//- Session
//* Setting session to no longer sign Cookies for 1 week
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        name: 'session',
        httpOnly: true,
        secure: false,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(mongoSanitize());
app.use(helmet({contentSecurityPolicy: true}));

//- Helmet config
const scriptSrcUrls = [
    "https://code.jquery.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://getbootstrap.com/",
    "https://cdn.jsdelivr.net",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dg03o1tta/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://www.publicdomainpictures.net/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//- Passport library (make sure to set after session setting)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//* Store/Un-store session id when id have logged in/ logged out
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//- Middleware Module Setting
app.engine('ejs', EJSengine);
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//- views engine
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

//- static files
app.use(express.static(path.resolve(__dirname, 'public')))

//- Define Local Middleware
app.use((req,res,next) => {
    //* Flash Middleware
    res.locals.success = req.flash('success');
    res.locals.successReview = req.flash('successReview')
    res.locals.error = req.flash('error');
    res.locals.warning = req.flash('warning');

    //* Passport middleware
    res.locals.currentUser =  req.user;
    next();
})


//! User Routes
app.use('/', userRoutes)
app.use('/help', otherRoutes);
//! Campground Routes
app.get('/', (req,res) => {
    res.render('home', {title: 'Phakh Campers'})
})
app.use('/campgrounds', campgroundRoutes)

//! Reviews section
app.use('/campgrounds/:id/reviews', reviewRoutes)


//- Error Handler
app.all('*', (req,res, next) => {
    next(new ErrorStatus('404', 'Page Not Found!'))
})

app.use((err,req,res,next) => {
    const { statusCode = 500} = err
    if(!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('err-showPage', {title: 'ErrorHandler', err, statusCode})
})

app.listen($port, () => console.log(`Server running on port ${$port}`))