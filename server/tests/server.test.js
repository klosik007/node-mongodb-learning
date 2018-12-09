const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const todos = [
    {_id: new ObjectID(), text: 'First to do'},
    {_id: new ObjectID(), text: 'Second to do', completed: true, completedAt: 333}
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

describe('DELETE /todo2/:id', () =>{
    it('should remove a todo', (done) =>{
        var id = todos[1]._id.toHexString();

        request(app)
            .delete(`/todo2/${id}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo2._id).toBe(id);
            })
            .end((err, res) =>{
                if (err){
                    return done(err);
                }

                Todo.findById(id).then((todo2) =>{
                    expect(todo2).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) =>{
        var id = new ObjectID().toHexString();

        request(app)
        .delete(`/todo2/${id}`)
        .expect(404)
        // .expect((res) =>{
        //     expect(res.status).toBe(404);
        // })
        .end(done);
    });

    it('should return 404 if object id is invalid', (done) =>{
        request(app)
        .delete('/todo2/1234')
        .expect(404)
        // .expect((res) =>{
        //     expect(res.status).toBe(404);
        // })
        .end(done);
    });
});

describe('PATCH /todo2/:id', () =>{
    it('should update the todo2', (done) =>
    {
        //grab id of first item
        var id = todos[0]._id.toHexString();
        var oriText = todos[0].text;
        var oriStatus = todos[0].completed;

        request(app)
            .patch(`/todo2/${id}`)
            .send({text: "Updated text", completed: true})//update text, set completed true
            .expect(200) // 200
            .expect((res)=>{
                expect(res.body.todo2.text).toBe('Updated text');
                //...
            })
            .end(done);
            // .end((err, res) =>{
                // if (err){
                //     return done(err);
                // }

                // Todo.findById(id).then((todo2) =>{
                //     if(!todo2){
                //         return done(err);
                //     }
                // expect(res.text).toBe(oriText);
                // expect(res.completed).toBe(oriStatus);
                // expect(res.completedAt).toBeA('number');
                // done();
            // });
        // text is changed, completed is true, completedAt is a number .toBeA
        });
    });

    it('should clear completedAt when todo2 is not completed', (done) =>{
        var id = todos[1]._id.toHexString();
        var oriText = todos[1].text;
        var oriStatus = todos[1].completed;
        
        request(app)
            .patch(`/todo2/${id}`)
            .send({text: "Updated text 2", completed: false})//update text, set completed false
            .expect(200) // 200
            .end((err, res) =>{
                if (err){
                    return done(err);
                }

                Todo.findById(id).then((todo2) =>{
                    if(!todo2){
                        return done(err);
                    }
                    if(res.completed == false){
                        res.send({completedAt: null});
                    }

                expect(res.text).toNotBe(oriText);
                expect(res.completed).toNotBe(oriStatus);
                expect(res.completedAt).toNotExist();
                done();
                }).catch((e) => res.status(400).send());
            });
        });
});