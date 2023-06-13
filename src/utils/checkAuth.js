import jwt from 'jsonwebtoken';
import express from 'express';


export default (req , res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secretPass');
            req.userId = decoded._id;
            next();
        } catch (err) {
            return res.status(403).json({
            })
        }
    } else {
        return res.status(403).json({
            message: 'not access'
        })
    }

}