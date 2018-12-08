const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const todos = [
    {_id: new ObjectID(), text: 'First to do'},
    {_id: new ObjectID(), text: 'Second to do'}
];

// const users = [
//     {_id: new ObjectID(), name: 'Przemek'},
//     {_id: new ObjectID(), name: 'Stewart'}
// ];

beforeEach((done) =>{
    Todo.remove({}).then(() =>{
        return Todo.insertMany(todos);
    }).then(() => done());
});

// beforeEach((done) =>{
//     User.remove({}).then(() =>{
//         return User.insertMany(users);
//     }).then(() => done());
// });

describe('POST /todo2', () =>{
    it('should create a new to do', (done) =>{
        var text = 'First to do';

        request(app)
            .post('/todo2')
            .send({text})
            .expect(200)
            .expect((res) =>{
                expect(res.body.text).toBe(text);
            })
            .end((err, res) =>{
                if (err){
                    return done(err);
                }

                Todo.find().then((todo2) =>{
                    expect(todo2.length).toBe(3);
                    expect(todo2[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });        
        });

    it('should not create todo with invalid body data', (done) =>{
        request(app)
            .post('/todo2')
            .send({})
            .expect(400)
            .end((err, res) =>{
                if (err){
                    return done(err);
                }

                Todo.find().then((todo2)=>{
                    expect(todo2.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () =>{
    it('should get all todos', (done) =>{
        request(app)
            .get('/todo2')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo2.length).toBe(2);
            })
            .end(done);
    });
});

// describe('GET /user/:id', () =>{
//     it('should return user doc', (done)=>{
//         console.log(users[0]._id);
//         request(app)
//             .get(`/user/${users[0]._id}`)
//             .expect(200)
//             .expect((res) =>{
//                 expect(res.body.user.name).toBe(users[0].name);
//             })
//             .end(done);

//     });
// });

describe('GET /todo2/:id', () =>{
    it('should return todo doc', (done)=>{
        //console.log(todos[0]._id);
        request(app)
            .get(`/todo2/${todos[0]._id}`)
            .expect(200)
            .expect((res) =>{
                expect(res.body.todo2.name).toBe(todos[0].name);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) =>{
        // 404 back
        request(app)
            .get(`/todo2/${new ObjectID()}`)
            .expect(404)
            // .expect((res) =>{
            //     expect(res.status).toBe(404);
            // })
            .end(done);
    });

    it('should return 404 for non-objects ids', (done) =>{
        //todo2/123
        request(app)
            .get('/todo2/1234')
            .expect(404)
            // .expect((res) =>{
            //     expect(res.status).toBe(404);
            // })
            .end(done);
    });
});