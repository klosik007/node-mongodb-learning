const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

const users = [{
    _id : userOneId,
    email : 'kkl@gmail.com',
    password : 'passssss33',
    tokens : [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'user2@wp.pl',
    password: 'wtwjnb765',
    tokens:[{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const todos = [
    {_id: new ObjectID(), text: 'First to do', _creator: userOneId},
    {_id: new ObjectID(), text: 'Second to do', completed: true, completedAt: 333, _creator: userTwoId}
];

const populateTodos = ((done) =>{
    Todo.remove({}).then(() =>{
        Todo.insertMany(todos);
    }).then(() => done());
});

const populateUsers = ((done) =>{
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(()=> done());
});

module.exports = {todos, populateTodos, users, populateUsers};