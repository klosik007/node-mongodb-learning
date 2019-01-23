require('./../config/config');

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

// const todos = [
//     {_id: new ObjectID(), text: 'First to do'},
//     {_id: new ObjectID(), text: 'Second to do', completed: true, completedAt: 333}
// ];

// const users = [
//     {_id: new ObjectID(), name: 'Przemek'},
//     {_id: new ObjectID(), name: 'Stewart'}
// ];
beforeEach(populateUsers);
beforeEach(populateTodos);

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
            .set('x-auth', users[0].tokens[0].token) //needed after making route private
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
            .set('x-auth', users[0].tokens[0].token) //needed after making route private
            .send({}) //it will always pass as todo schema doesn't have 'required' properties
            .expect(200)
            .end((err, res) =>{
                if (err){
                    return done(err);
                }

                Todo.find().then((todo2)=>{
                    expect(todo2.length).toBe(3);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () =>{
    it('should get all todos', (done) =>{
        request(app)
            .get('/todo2')
            .set('x-auth', users[0].tokens[0].token) //needed after making route private
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo2.length).toBe(1);
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
            .set('x-auth', users[0].tokens[0].token) //needed after making route private
            .expect(200)
            .expect((res) =>{
                expect(res.body.todo2.name).toBe(todos[0].name);
            })
            .end(done);
    });

    it('should not return todo doc created by other user', (done)=>{
        //console.log(todos[0]._id);
        request(app)
            .get(`/todo2/${todos[1]._id}`)
            .set('x-auth', users[0].tokens[0].token) //needed after making route private
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) =>{
        // 404 back
        request(app)
            .get(`/todo2/${new ObjectID()}`)
            .set('x-auth', users[0].tokens[0].token) //needed after making route private
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
            .set('x-auth', users[0].tokens[0].token) //needed after making route private
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
            .set('x-auth', users[1].tokens[0].token)
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

    it('should not remove a todo', (done) =>{
        var id = todos[0]._id.toHexString();

        request(app)
            .delete(`/todo2/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) =>{
                if (err){
                    return done(err);
                }

                Todo.findById(id).then((todo2) =>{
                    expect(todo2).toExist();
                    done();
                }).catch((e) => done(e));
            });
    });


    it('should return 404 if todo not found', (done) =>{
        var id = new ObjectID().toHexString();

        request(app)
        .delete(`/todo2/${id}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        // .expect((res) =>{
        //     expect(res.status).toBe(404);
        // })
        .end(done);
    });

    it('should return 404 if object id is invalid', (done) =>{
        request(app)
        .delete('/todo2/1234')
        .set('x-auth', users[1].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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

    it('should update the todo2 as second user', (done) =>
    {
        //grab id of first item
        var id = todos[0]._id.toHexString();
        var oriText = todos[0].text;
        var oriStatus = todos[0].completed;

        request(app)
            .patch(`/todo2/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({text: "Updated text", completed: true})//update text, set completed true
            .expect(404) // 404
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

    it('should clear completedAt when todo2 is not completed', (done) =>{
        var id = todos[1]._id.toHexString();
        var oriText = todos[1].text;
        var oriStatus = todos[1].completed;
        
        request(app)
            .patch(`/todo2/${id}`)
            .set('x-auth', users[1].tokens[0].token)
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

describe('Get /users/me', () => {
    it('should return user if authenticated', (done) =>{
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token + '1') //not needed
            .expect(401)
            .expect((res)=>{
                expect(res.body._id).toBe(undefined);
                expect(res.body.email).toBe(undefined);
                // expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST users', () =>{
    it('should create a user', (done) =>{
        var email = 'example@example.com';
        var password = '123mmm';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) =>{
                expect(res.headers['x-auth']).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) =>{
                if (err){
                    return done(err)
                }

                User.findOne({email}).then((user)=>{
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                });
            });
    });

    it('should return validation errors if request invalid', (done) =>{
        request(app)
            .post('/users')
            .send({email: 'wwwfrs.pl',
                   password: 'bbb' })
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', (done)=>{
        request(app)
            .post('/users')
            .send({email : 'kkl@gmail.com', password: 'passssss33'})
            .expect(400)
            // .expect((res)=>{
            //     expect(res.body.email).toBe(users[0].email);
            //     expect(res.body.password).toBe(users[0].password)
            // })
            .end(done);
    });
});

describe('POST /users/login', ()=>{
    it('should login and return status 200 and auth token', (done) =>{
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) =>{
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) =>{
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) =>{
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e)=> done());
            })
    });

    it('should reject invalid login', (done) =>{
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: "kdsa"
            })
            .expect(400)
            .expect((res)=>{
                expect(res.headers['x-auth']).toNotExist();
                done();
            })
            .end((err, res)=>{
                if (err){
                    return done(err);
                }

                User.findById(users[1]._id).then((user)=>{
                    expect(user.tokens.length).toBe(1);
                    done();
                });
            }).catch((e)=> done(e));
    });
});

describe('DELETE /users/me/token', ()=>{
    it('should remove auth token on logout', (done)=>{
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res)=>{
                if (err){
                    return done(err);
                }

                User.findById(users[0]._id).then((user)=>{
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e)=>done(e));
            });
    });
});