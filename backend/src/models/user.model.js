import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
        },
        username: {
            type: String,
            lowercase: true,
            trim: true,
            unique: [true, 'Username already exists'],
            required: [true, 'Username is required'],
            index: true,
        },
        email: {
            type: String,
            unique: [true, 'Email already exists'],
            lowercase: true,
            trim: true,
            required: true,
        },
        avatar: {
            type: String,
        },
        password: {
            type: String,
            unique: true,
            required: [true, 'Password is required'],
        },
        role: {
            type: String,
            enum: ['no access', 'administrator'],
            default: 'user'
        },
        workflowStatus: {
            type: String,
            enum: ['active', 'pending', 'suspended', 'inactive'],
            default: 'inactive'
        },
        lastLoginAt: {
            type: Date,
            default: null
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
        // refreshToken:{
        //     type: String,
        // }
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema);