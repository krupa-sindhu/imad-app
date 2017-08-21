var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool= require('pg').Pool;

var config = {
    user:'krps123450',
    database:'krps123450',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password: process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));

var articles = {
   'article-one' : {
  title: 'article-one|krupa',
  heading: 'article-one',
  date: 'september 5,2017',
  content:` <p>
            
            this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks 
        </p>
        <p>
            this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks 

        </p>
        <p>
            this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks this is the content that i am writing i am going to practice typing here i aguess i dont need any punctuation marks 
        </p>
`
},
   'article-two' : {
     title: 'article-one|krupa',
  heading: 'article-one',
  date: 'september 5,2017',
  content: `<p>
  2
  </p>`
 },
   'article-three' : {
     title: 'article-one|krupa',
  heading: 'article-one',
  date: 'september 5,2017',
  content:` <p>
  3
  </p>`
 }
    
};

function createTemplate(data){
    var title = data.title;
    var heading=data.heading;
    var date=data.date;
    var content=data.content;
    
var htmlTemplate = `
 <html>
    <head>
         <title>
         ${title}
         </title>
         <meta name="viewport" content="width=device-width, initial-case-1" />
            <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body>
        <div class="container">
        <div>
            <a href="/">Home</a>
        </div>
        <hr/>
        <h3>
            ${heading}
        </h3>
        <div>
           $(date)
        </div>
        ${content}
        </div>
    </body>
</html>
`;
return htmlTemplate;
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
var Pool=new Pool(config);
app.get('/test-db',function(req,res){
    Pool.query('SELECT * FROM test',function(err,result){
       if(err)
         res.status(500).send(err.toString());
       else
         res.send(JSON.stringify(result.rows));
    });
});
app.get('/article/:articleName',function(req,res){
      pool.query("SELECT * FROM TEST WHERE title '" + req.params.articleName+"'",function(err,result)
      {if(err)
         res.status(500).send(err.toString());
       else{
           if(result.rows.length===0){
               res.status(404).send('article not found');
            }
       else 
       var articleData=result.rows[0];
        res.send(createTemplate.articles[articleName]);
      }
      });
      
      
    
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
