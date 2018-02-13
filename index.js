const express = require('express')
, session = require('express-session')
, MySQLStore = require('express-mysql-session')(session)
, cors = require('cors')
, bodyParser = require('body-parser')
, app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'dev_mycity',
    checkExpirationInterval: 65000,
    connectionLimit: 1,
    endConnectionOnClose: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

var sessionStore = new MySQLStore(options);

app.use(session({
    key: 'qlue',
    secret: 'qlue',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { path: '/', secure: false, maxAge: 65000 }
}));

function checkSession(req, res, next) {
    if (req.session.login) {
        next()
    } else {
        res.status(401).send("access denied")
        return
    }
}

// domain: 'localhost'

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

app.get('/login', function (req, res) {
    req.session.view = 1
    req.session.login = 1
    req.session.username = req.headers.username
    res.send(`"welcome ${req.session.username}"`)
})

app.get('/user', checkSession, function(req, res) {
    ++req.session.views;
    res.send( `${req.session.username} Viewed ${req.session.views} times.`);
});


app.listen(3000)
