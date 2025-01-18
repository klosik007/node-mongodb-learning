import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { Todo } from './../../models/todo';
import { User } from './../../models/user';

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
    _id : userOneId,
    email : 'kkl@gmail.com',
    password : 'passssss33',
    tokens : [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET ?? "")
    }]
}, {
    _id: userTwoId,
    email: 'user2@wp.pl',
    password: 'wtwjnb765',
    tokens:[{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET ?? "")
    }]
}];

const todos = [
    {
        _id: new ObjectId(), 
        text: 'First to do', 
        _creator: userOneId
    },
    {
        _id: new ObjectId(), 
        text: 'Second to do', 
        completed: true, 
        completedAt: 333, 
        _creator: userTwoId
    }
];

const populateTodos = function (done: () => {}) {
    Todo.deleteMany({})
        .then(() => Todo.insertMany(todos))
        .then(() => done());
};

const populateUsers = function (done: () => {}) {
    User.deleteMany({})
        .then(() => {
            const userOne = new User(users[0]).save();
            const userTwo = new User(users[1]).save();

            return Promise.all([userOne, userTwo]);
        })
        .then(() => done());
};

export { todos, populateTodos, users, populateUsers };