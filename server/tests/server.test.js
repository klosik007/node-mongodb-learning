const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
    {text: 'First to do'},
    {text: 'Second to do'}
];

beforeEach((done) =>{
    Todo.remove({}).then(() =>{
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todo2', () =>{
    it('should create a new to do', (done) =>{
        var text = 'TEst test';

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