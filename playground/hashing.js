const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

var data = {
    id: 10
};

var token = jwt.sign(data, 'fewf');
console.log(token);

var decoded = jwt.verify(token, 'fewf');
console.log(decoded);

var password = '1124ffg';

bcryptjs.genSalt(10, (err, salt) =>{
    bcryptjs.hash(password, salt, (err, hash) =>{
        console.log(hash);
    });
});

var hashedPassword = '$2a$10$WVvMYsiU/nUWK6rVWdPL/u2n7NBlOi3SBZLaMYHDwuU3BSn8WRuti';
bcryptjs.compare(password, hashedPassword, (err, res) =>{
    console.log(res);
});
// var message = "fswffwwgwgwg";
// var hash = SHA256(message).toString();

// console.log(message, hash);

// var data = {
//     id: 4
// };

// var token ={
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash){
//     console.log('Data not changed');
// }
// else{
//     console.log("Data changed");
// }
