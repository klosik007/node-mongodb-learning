const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = "5c0980199e737d117c816172";

// if(!ObjectID.isValid(id)){
//     console.log('ID not valid');
// }
// Todo.find({
//     _id: id
// }).then((todo2) =>{
//     console.log('Todo2', todo2);
// });

// Todo.findOne({
//     _id: id
// }).then((todo2) =>{
//     console.log('Todo2', todo2);
// });

// Todo.findById(id).then((todo2) =>{
//     if (!todo2) return console.log('Id not found');
//     console.log('Todo2 by id', todo2);
// }).catch((e) =>console.log(e));

var id = '5be09787571e501468990633';

if(!ObjectID.isValid(id)){
    console.log('ID not valid');
}

User.findById(id).then((user) =>{
    if (!user) return console.log('Id not found');
    console.log('User by id', user);
}).catch((e) => console.log(e));


