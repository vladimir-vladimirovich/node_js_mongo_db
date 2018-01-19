var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//Mongo
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/test";
//Mongo

var port = 4000;

app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, function () {
   console.log('Server is up and running!');
});

// app.get('/', function (req, res) {
//     res.send("Nothing to display at '/' ");
// });

app.post('/setUser', function (req, res) {
   console.log(req.body.username);
   res.sendFile(__dirname + '/routes/index.html');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/routes/index.html');
});

//-----------------------Mongo-------------------------------------

// app.post('/insert', function (req, res) {
//    res.sendFile(__dirname + '/routes/index.html');
// });

var collectionName = 'usersList';

app.post('/create', function (req, res, next) {
    var item = {
        username: req.body.username,
        password: req.body.password
    };

    MongoClient.connect(url, function (err, db) {
        if(err) throw err;
        console.log("DB conenction istablished");
        dbase = db.db('test');
        dbase.collection(collectionName).insertOne(item, function (err, res) {
            if(err) throw err;
            console.log('User inserted: ' + item.username);
            db.close();
        })
    });

});

app.post('/delete', function (req, res) {
   var item = {
       username: req.body.username
   };

   MongoClient.connect(url, function (err, db) {
       if(err) throw err;
       dbase = db.db('test');
       dbase.collection(collectionName).deleteOne(item, function (err, res) {
           if(err) throw err;
           console.log('Entry ' + item.username + ' has been deleted');
           db.close();
       })
   })
});

app.post('/update', function (req, res) {
    var oldUser = {
        username: req.body.oldusername
    };
    var newUser = {
        $set: {
            username: req.body.newusername,
            password: req.body.newpassword
        }
    };

    MongoClient.connect(url, function (err, db) {
        if(err) throw err;
        dbase = db.db('test');
        dbase.collection(collectionName).updateOne(oldUser, newUser, function (err, res) {
            if(err) throw err;
            console.log('User: ' + oldUser.username + ' has been updated to: ' + newUser.$set.username);
            db.close();
        })
    })
});


