import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

interface IUser {
    email: string,
    tokens: {
        access: string,
        token: string,
    }[],
    password: string
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (v) => v.isEmail,
            message: (v) => `${v.value} is not a valid email`
        } 
    },
    tokens: [{
        access:{
            type: String,
            required: true
        },
        token:{
            type: String,
            required: true
        }
    }],
    password: {
        type: String,
        require: true,
        minlength: 6
    },
});

UserSchema.methods.toJSON = function () {
    const userObject = this.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    const access: string = 'auth';
    const token: string = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET ?? "");
    
    user.tokens = user.tokens.concat([{ access, token }]);

    return user.save().then(() => { // TODO: simplify to await?
        return token;
    });
};

UserSchema.methods.removeToken = function (token: string){
    const user = this;

    return user.update({
        $pull: {
            tokens: { token }
        }
    });
};


UserSchema.statics.findByToken = function (token: string)  {
    const User = this;
    let decoded: jwt.JwtPayload | string;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET ?? "");
    } catch (e: any) {
        return Promise.reject();
    }

    return User.findOne({
        // @ts-ignore
        _id : decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email: string, password: string){
    const User = this;

    return User.findOne({email}).then((user: IUser)=>{
        if (! user){
            return Promise.reject();
        }

        return new Promise((resolve, reject) =>{
            bcrypt.compare(password, user.password, (err: Error | null, res: boolean) =>{
                if (! res) {
                    reject();
                }

                resolve(user);
            });
        });
    })
};


UserSchema.pre('save', function (next: mongoose.CallbackWithoutResultAndOptionalError){
    const user = this;

    if (user.isModified('password')) {
        const password: string = user.password;

        bcrypt.genSalt(10, (err: Error | null, salt: string) =>{
            bcrypt.hash(password, salt, (err: Error | null, hash: string) =>{
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('users', UserSchema);

export { User };