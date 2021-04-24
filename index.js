const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const redis = require('redis');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

const RedisStore = require('connect-redis')(session)

const client = redis.createClient(13282,'redis-13282.c262.us-east-1-3.ec2.cloud.redislabs.com');
client.auth('K7hvdHtzSrDQ1F3BOVSLc9rRsOVI8XGG', (err) => {
    if (err) throw err;
});

app.use(session({
    store: new RedisStore({
        client,
        ttl: 20
    }),

    secret: 'sth',
    resave: false,
    saveUninitialized: false
}))

//Agrego el post
app.post('/', (req, res) => {
    req.session.user = req.body.nombre,
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/', (req, res) => {
    console.log(req.sessionID)
    console.log(req.session.user);
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/logout', (req, res) => {
    req.session.destroy( err => {
        if(!err){
            res.send('Adios')
        } else {
            console.log(err);
        }
    })
})

app.listen(8080, () => {
    console.log('App is running on port 8080');
})