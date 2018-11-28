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

    //deleteMany
    db.collection('Users').deleteMany({name: 'Andrew'}).then((result) =>{
        console.log(result);
    });
    //deleteOne
    db.collection('Users').deleteOne({_id: 123}).then((result)=>{
        console.log(result);
    });
    //findOneAndDelete
    db.collection('Users').findOneAndDelete({name: 'Przemek'}).then((result)=>{
        console.log(result);
    });

    client.close();

    //db.close();
});