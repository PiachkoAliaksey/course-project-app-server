import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

import { registerValidation, loginValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import { collectionValidation } from './validations/collection.js';
import { signUp, login, getMe, getAllUsers, deleteOne, update, updateAccess } from './controllers/userController.js';
import { createCollection, deleteOneCollection, getAllCollections, updateOneCollection, createItemCollection, getAllCollectionItems, deleteOneItem, updateOneItem, getOneItem, getLastItems, getCloudTags, getFiveLargestCollection, updateOneCollectionCountItems,addUserLike,getLikesOfItem } from './controllers/itemsController.js';
import { addComment, getAllComments } from './controllers/commentsController.js';
dotenv.config()
//process.env.MONGO_URL

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('DB OK'))
    .catch((error) => console.log('DB error', error));

const app = express();

app.use(cors());
app.use(express.json());



app.post('/auth/login', loginValidation, login);
app.post('/auth/signup', registerValidation, signUp);
app.post('/collection', checkAuth, createCollection);
app.post('/collection/items', checkAuth, createItemCollection);
app.post('/collection/items/item/addComment', addComment);
app.post('/collection/items/item/getAllComments', getAllComments);

app.get('/auth/me', checkAuth, getMe);
app.get('/table', getAllUsers);
app.get('/collections/:id', checkAuth, getAllCollections);
app.get('/collection/items/:id', checkAuth, getAllCollectionItems);
app.get('/collection/items/item/:id', getOneItem);
app.get('/collection/items/item/likes/:id',getLikesOfItem );
app.get('/lastFive', getLastItems);
app.get('/largestFiveCollection', getFiveLargestCollection);
app.get('/tags', getCloudTags);

app.delete('/table/delete/:id', checkAuth, deleteOne);
app.delete('/collections/delete/:id', checkAuth, deleteOneCollection);
app.delete('/collection/items/delete/:id', checkAuth, deleteOneItem);

app.patch('/table/update/:id', update);
app.patch('/table/updateAccess/:id', updateAccess);
app.patch('/collections/update/:id', updateOneCollection);
app.patch('/collections/updateCount/:id', updateOneCollectionCountItems);
app.patch('/collection/items/update/:id', updateOneItem);
app.patch('/collection/items/item/like/:id',addUserLike );


// app.listen(process.env.PORT || 4444, () => {
//     return console.log('Server OK');
// })

const server = app.listen(process.env.PORT || 4444, () => {
    return console.log('Server OK');
})
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
})

io.on('connection', (socket) => {
    global.chatSocket = socket;
    socket.on('send-comment', (data) => {
        socket.broadcast.emit('comment-receive', data);
    })
})