const Post = require('./models/post');
const User = require("./models/user");
const Comment = require("./models/comment");
const async = require("async");
const mongoose = require("mongoose");
const { findById } = require('./models/post');

const mongoDb = 'mongodb+srv://moonsol124:wunansthf12@cluster0.zrfhwyl.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const comments = [];
const user = [];

function findUser(cb) {
    async.parallel({
        function(callback) {
            Post.findById('634c112051aaf92a5eba690a', callback);
        }
    },
    (err, result) => {
        if (err) {
            cb(err, null);
        }
        user.push(result);
    })
}

function createComment(post, username, password, title, content, cb) {
    const comment = new Comment({
        post: post,
        username: username,
        password: password,
        title: title,
        content: content,
    })
    comment.save((err) => {
        if (err) {
            cb(err, null);
            return
        }
        console.log (post);
        const updatedPost = new Post({
            post: post.author,
            title: post.title,
            content: post.content,
            comments: comment,
            _id: post.id,
        })
        Post.findByIdAndUpdate(post.id, updatedPost, {}, (err, result) => {
            if (err) {
                cb(err, null);
            }
            console.log("comment added to "+updatedPost);
        })
        comments.push(comment);
        cb(null, comment);
    })
}

function createComments(cb) {
    async.parallel([
        function(callback) {
            createComment(user[0], 'user1', 'user1', 'comment1', 'comment1 content', callback);
        },
        function(callback) {
            createComment(user[0], 'user2', 'user2', 'comment2', 'comment2 content', callback);
        }
    ], cb)
}

async.series({
    findUser,
    createComments,
})
// function createComment(post, username, password, title, content, cb) {
//     const comment = new Comment({
//         post: post,
//         username: username,
//         password: password,
//         title: title,
//         content: content,
//     })
//     comment.save((err) => {
//         if (err) {
//             cb(err, null);
//             return
//         }
//         // console.log ("new comment created: "+comment);
//         console.log (post.id);
//         const updatedPost = new Post({
//             post: post.author,
//             title: post.title,
//             content: post.content,
//             comments: comment,
//             _id: post.id,
//         })
//         Post.findByIdAndUpdate(post.id, updatedPost, {}, (err, result) => {
//             if (err) {
//                 cb(err, null);
//             }
//             console.log("comment added to "+updatedPost);
//         })
//         comments.push(comment);
//         cb(null, comment);
//     })
// }

// function createComments(cb) {
//     async.parallel([
//         function(callback) {
//             createComment(posts[0], 'user1', 'user1', 'comment1', 'comment1 content', callback);
//         },
//         function(callback) {
//             createComment(posts[1], 'user2', 'user2', 'comment2', 'comment2 content', callback);
//         }
//     ], cb)
// }