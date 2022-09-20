const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

// for scss
const nodeSassMiddleware = require('node-sass-middleware');

// middleware for using scss
app.use(nodeSassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));



// using static files
app.use(express.static('./assets'));


// setting up the views for ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res){
    return res.render('home');
});


// server is listening on port 8000
app.listen(process.env.PORT || port, function(err){
    if(err){
        console.log('Error in connecting the express server', err);
        return;
    }
    console.log('Express server is up and running on port:', port);
    return;
});



