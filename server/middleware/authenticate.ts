import { User } from './../models/user';

const authenticate = (req, res, next) => {
    //var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzM2M2Q5YmM5MzFjMjI5ZTRjN2RiZGIiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTQ3MDU4NTg3fQ.IIzDCv_sgkZamR02q9PQ5icYZ193poIEfZL7V2BLeQo';
    const token = req.header('x-auth');//still dont know why is this undefined when calling
                                            //fixed - instead of header tab in postman, I tried to send params...
    console.log(token); 
    
    User.findByToken(token)
        .then((user: string | null) =>{
            if (! user){
                return Promise.reject();
            }

            req.user = user; //by this we have specified user saved in req.user call, 
                            //it provides us to use right user in app.get /users/me 
            req.token = token;//and as above with token
            next(); //need it cause otherwise in app.get /users/me the res.send will not execute 
        })
        .catch((e: any) =>{
            res.status(401).send();
        }
    );
};

export { authenticate };