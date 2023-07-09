import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import userModel from '../userModel.js'
import itemsModel from '../itemsModel.js';


export const signUp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const isUserExist = await userModel.findOne({ email: req.body.email });
        if (isUserExist) {
            return res.status(400).json({ message: 'user already exist' })
        }
        // const isAdmin = process.env.PASSWORD_ADMIN===req.body.password;

        const passwordPass = req.body.password;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(passwordPass, salt);

        const doc = new userModel({
            email: req.body.email,
            fullName: req.body.fullName,
            status: 'active',
            password: hash,
            position: 'user'
        });
        //isAdmin?'admin':'user'

        const user = await doc.save();
        const token = jwt.sign({
            _id: user._id
        }, 'secretPass', { expiresIn: '30d' });

        const { password, ...userData } = user._doc;

        res.json({ ...userData, token })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to register'
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (user._doc.status === 'blocked') {
            const { status, ...userData } = user._doc;
            return res.json({ status })
        }
        if (!user) {
            return res.status(404).json({
                message: 'Not found'
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.password);
        if (!isValidPass) {
            return res.status(403).json({
                message: 'Else login or password'
            })
        }
        const token = jwt.sign({
            _id: user._id
        }, 'secretPass', { expiresIn: '30d' });

        const { password, ...userData } = user._doc;

        res.json({ ...userData, token })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to login'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'not found'
            })
        }
        const { password, ...userData } = user._doc;
        res.json({ ...userData })
    } catch (err) {
        res.status(500).json({
            message: "not access"
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.json(users)
    } catch (err) {
        res.status(500).json({
            message: 'wrong'
        })

    }
}

export const deleteOne = async (req, res) => {
    try {
        const postId = req.params.id;
        let doc = await userModel.findOneAndDelete({ _id: postId });
        if (!doc) {
            return res.status(404).json({
                message: 'user not found'
            })
        }

        res.json({
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong request'
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        let doc = await userModel.updateOne({ _id: postId }, {
            status: req.body.status
        });
        if (!doc) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        res.json({
            success: true
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong request'
        })

    }
}

export const updateAccess = async (req, res) => {
    try {
        const postId = req.params.id;
        let doc = await userModel.updateOne({ _id: postId }, {
            position: req.body.position
        });
        if (!doc) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        res.json({
            success: true
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong request'
        })

    }
}
