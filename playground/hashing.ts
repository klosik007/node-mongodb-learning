import { SHA256 } from 'crypto-js'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

const data: Object = {
    id: 10
};

const token: string = jwt.sign(data, 'fewf');
console.log(token);

const decoded: string | JwtPayload= jwt.verify(token, 'fewf');
console.log(decoded);

const password: string = '1124ffg';

bcryptjs.genSalt(10, (err: Error | null, salt: string) =>{
    bcryptjs.hash(password, salt, (err: Error | null, hash: string) =>{
        console.log(hash);
    });
});

const hashedPassword: string = '$2a$10$WVvMYsiU/nUWK6rVWdPL/u2n7NBlOi3SBZLaMYHDwuU3BSn8WRuti';
bcryptjs.compare(password, hashedPassword, (err: Error | null, res: boolean) =>{
    console.log(res);
});
const message: string = "fswffwwgwgwg";
const hash = SHA256(message).toString();

console.log(message, hash);

const data2: { id: number } = {
    id: 4
};

const token2: {data2: { id: number }, hash: string} = {
    data2,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};

const resultHash: string = SHA256(JSON.stringify(token2.data2) + 'somesecret').toString();

if (resultHash === token2.hash){
    console.log('Data not changed');
}
else{
    console.log("Data changed");
}
