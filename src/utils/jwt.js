import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();

export function generateAccessToken(user) {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin, name: user.name, email: user.email, phone_nuber: user.phone_nuber, delivery_address: user.delivery_address }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });    
}

export function decodeAccessToken(token) {
    try{
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch(err){
        return null;
    }
}