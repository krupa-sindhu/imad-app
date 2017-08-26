var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto=require('crypto');
var bodyParser=require('body-parser');
var Pool = require('pg').Pool;
var session=require('express-session');


var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session(
    {
    secret : 'someRandomSecretValue',
    cookie :{maxAge: 1000*60*60*24*30},
     resave: true,
    saveUninitialized: true

}));


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var counter=0;
app.get('/counter', function (req, res) {
  counter++;
  res.send(counter.toString());
});
var config={
    user:	'krps123450',
database:	'krps123450',
host:'db.imad.hasura-app.io',
port:'5432',
password: process.env.DB_PASSWORD
};

var pool=new Pool(config);
app.get('/test-db',function(req,res){
    pool.query('SELECT * FROM article',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.send(JSON.stringify(result.rows));
        }
    });
});

function hash(input,salt)
{
    var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkdf2",'10000',salt,hashed.toString('hex')].join('$');
}

app.get('/hash/:input',function(req,res){
    var hashedString=hash(req.params.input,'this-is-random');
    res.send(hashedString);
});

app.post('/create-user',function(req,res){

var username=req.body.username;
var password=req.body.password;
var salt=crypto.randomBytes(128).toString('hex');
var dbString=hash(password,salt);
pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.send('User successfully created :'+username);
        }
    });
});

/*app.post('/login',function(req,res){

var username=req.body.username;
var password=req.body.password;
pool.query('SELECT * from "user" WHERE username=$1',[username],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            if(result.rows.length===0)
            {
               res.send(403).send('Invalid Username/Password');
            }
            else{
                var dbstring=result.rows[0].password;
                var salt=dbstring.split('$')[2];
                var hashedpassword=hash(password,salt);
                if(hashedpassword===dbstring)
                {
                    req.session.auth={userId:result.rows[0].id};
                  res.send('Credentials Correct :');
                }
                else{
                res.send(403).send('Invalid Password!');
            }
            } 
        }
    });
});

app.get('/check-login',function(req,res){
    if(req.session && req.session.auth && req.session.auth.userId)
       res.send('Logged in :'+ req.session.auth.userId.toString());
     else
     res.send('Not Logged in');
});

app.get('/logout',function(req,res){
    delete req.session.auth;
    res.send('Logged out');
});
*/

var names=[];
app.get('/submit-name',function(req,res){
    var name=req.query.name;
    names.push(name);
    res.send(JSON.stringify(names));
});

app.get('/article/:articleName', function (req, res) {
        pool.query("SELECT * FROM article WHERE title = $1",[req.params.articleName],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            if(result.rows.length===0){
                res.status(404).send('Article Not Found');
            }
            else{
                var articleData=result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
  
});
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/:articleName', function (req, res) {
    var articleName=req.params.articleName;
  res.send(createTemplate(articles[articleName]));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80
var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
