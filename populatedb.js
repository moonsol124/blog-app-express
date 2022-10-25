const Post = require('./models/post');
const User = require("./models/user");
const Comment = require("./models/comment");
const async = require("async");
const mongoose = require("mongoose");

const mongoDb = 'mongodb+srv://moonsol124:wunansthf12@cluster0.zrfhwyl.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const users = [];
const posts = [];
const comments = [];

function createUser(username, password, cb) {
    const user = new User({
        username: username,
        password: password,
    })
    user.save((err) => {
        if (err) {
            cb(err, null);
            return;
        }
        // console.log ("new user created:"+user);
        users.push(user);
        cb(null, user)
    })
}

function createPost(author, title, content, cb) {
    const post = new Post({
        author: author,
        title: title,
        content: content,
    })
    post.save((err) => {
        if (err) {
            cb(err, null);
            return;
        }
        // console.log ("new post created: "+post);
        posts.push(post);
        cb(null, post);
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
        cb(null, comment);
    })
}

function createUsers(cb) {
    async.parallel([
        function(callback) {
            createUser('admin', 'admin', callback);
        }
    ], cb)
}

function createPosts(cb) {
    async.parallel([
        function(callback) {
            createPost(users[0], 'post 1', 'post 1 content', callback);
        },
        function(callback) {
            createPost(users[0], 'post 2', 'post 2 content', callback);
        }
    ], cb)
}

// function createComment(post, username, password, title, content) {
function createFirstComment(cb) {
    async.series([
        function(callback) {
            createComment(posts[0], 'user1', 'user1', 'comment1', 'comment1 content', callback);
        },
        function(callback) {
            createComment(posts[1], 'user2', 'user2', 'comment2', 'comment2 content', callback);
        }
    ], cb)
}

async.series([
    createUsers,
    createPosts,
    createFirstComment,
])