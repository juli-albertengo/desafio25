const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

app.use(session({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true
}))

app.get('/', (req, res) => {
    //Si no tiene la cookie se manda el index solo
    if(!req.cookies.user){
        res.sendFile(path.join(__dirname + '/index.html'))
    } else {
        //Si sí tiene la cookie, quiere decir que es un refresh, entonces la "revivo" y le seteo una nueva max age
        //(No pude resolver bien lo de max-age, me sale cualquier fecha y hora :(  )
        var date = new Date();
        date.setTime(date.getTime()+(30*1000));
        res.cookie('user', req.cookies.user, {expires: date}).sendFile(path.join(__dirname + '/index.html'))
    }
    
})

app.post('/', (req, res) => {
    var date = new Date();
    date.setTime(date.getTime()+(30*1000));
    res.cookie('user', req.body.nombre, {expires: date}).sendFile(path.join(__dirname + '/index.html'))
})

app.get('/logout', (req, res) => {
    let nombre = req.cookies.user
    res.clearCookie('user').send('Hasta Luego ' + nombre);
})

app.listen(8080, () => {
    console.log('App is running on port 8080');
})