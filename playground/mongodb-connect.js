//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// Console.log(obj);

// var person = {name: 'Przemek', age: 26};
// var {name} = person;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) =>{
    if (err){
        return console.log('Unable to connect to MongoDb server');
    }
    console.log('Connected to MongoDb server');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Somth to do',
    //     completed : false
    // }, (err, result) => {
    //     if (err){
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    //Users {name, age, location}

    db.collection('Users').insertOne({
        name: 'Przemek',
        age: 26,
        location: 'Gdańsk'
    }, (err, result) => {
        if (err){
            return console.log('Nie polaczono z mongolem', err);
        }
        console.log(JSON.stringify(result.ops[0]._id, undefined, 2));
    });

    client.close();

    //db.close();
});