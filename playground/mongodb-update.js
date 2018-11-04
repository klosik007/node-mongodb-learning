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

    //findOneAndUpdate
    db.collection('Users').findOneAndUpdate({_id: new ObjectID('5bddeedd193bf22500239e8e')}, {
        $set:{
            name: 'Przemek'
        },
        $inc: {
            age: 1
        }
    },
    {
        returnOriginal: false
    }).then((result) =>{
        console.log(result);
    });

    client.close();

    //db.close();
});