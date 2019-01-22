require('./config/config');

var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
var bcrypt = require('bcryptjs');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todo2', authenticate, (req, res) =>{
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) =>{
        res.send(doc);
    }, (e)=>{
        res.status(400).send(e);
    });
});

// app.get('/todos', (req, res) =>{
//     console.log(res.body);
// });

app.get('/todo2', authenticate, (req, res) =>{
    Todo.find({
        _creator: req.user._id
    }).then((todo2) =>{
        res.send({todo2});
    }, (e) =>{
        res.status(400).send(e);
    });
});

app.get('/user/:id', (req, res) =>{
    var id = req.params.id;

    //valid id using isValid
    //404 -send back empty send
    if (!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    //findById
    User.findById(id).then((user)=>{
        if (!user) return res.status(404).send({});
        //console.log('User by id:', user);
        res.send({user});
    }).catch((e) => res.status(400).send(e));
    //success
        //if todo - send it back
        // if no todo - send back 404 with empty body
    //error
    //400
});

app.get('/todo2/:id', authenticate, (req, res) =>{
    var id = req.params.id;

    //valid id using isValid
    //404 -send back empty send
    if (!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    //findById
    Todo.findOne({
        _id: id,
        _creator: req.user.id
    }).then((todo2)=>{
        if (!todo2) return res.status(404).send({});
        //console.log('User by id:', user);
        res.send({todo2});
    }).catch((e) => res.status(400).send(e));
    //success
        //if todo - send it back
        // if no todo - send back 404 with empty body
    //error
    //400
});

app.delete('/todo2/:id', authenticate, (req, res) =>{
    //get the id
    var id = req.params.id;
    //validate id -> 404 if not
    if (!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    //remove todo by id
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo2) =>{
        if (!todo2){
            return res.status(404).send();
        }
        res.status(200).send({todo2});
    }).catch((e)=>res.status(400).send());
        //success
        //error
});

app.patch('/todo2/:id', authenticate, (req, res) =>{
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo2) =>{
        if(!todo2){
            return res.status(404).send();
        }
        
        res.send({todo2});
    }).catch((e) =>{res.status(400). send();});
});

// POST /users
app.post('/users', (req, res) =>{
    //console.log(req.body);
    // var user = new User({
    //     text: req.body.text
    // });
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    

    user.save().then(() =>{
        return user.generateAuthToken();
        //res.send(doc);
    }).then((token) =>{
        res.header('x-auth', token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    });    
});


app.get('/users/me', authenticate, (req, res) =>{
    res.send(req.user);
});

app.post('/users/login', (req, res)=>{
    var body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then((user) =>{
        return user.generateAuthToken().then((token) =>{
            res.header('x-auth', token).send(user);
        })
    }).catch((e) =>{
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) =>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    }, ()=>{
        res.status(400).send();
    });
});

app.listen(port, () =>{
    console.log('Started on port ', port);
});

module.exports = {app};