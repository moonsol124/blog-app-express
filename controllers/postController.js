const async = require('async');
const { findById } = require('../models/post');
const Post = require("../models/post");
const Comment = require("../models/comment");
var today = new Date();   

exports.posts = function(req, res, next) {
    async.parallel({
        posts(callback) {
            Post.find().exec(callback);
        }
    },
    (err, result) => {
        if (err) {
            return res.status(404).json({message: "Resource not found", status: 404});
        }
        res.status(200).json({result: result, status: 200, message:"posts successfully loaded"});
    })
}
exports.post_detail = function(req, res, next) {
    async.parallel({
        post(callback) {
            Post.findById(req.params.id).exec(callback);
        }
    }, (err, result) => {
        if (err) {
            return res.status(404).json({message: "Resource not found", status: 404});
        }
        res.status(200).json({result: result, status: 200, message: "post successfully loaded"});
    })
}
exports.create_post_get = function(req, res, next) {
    res.send('post_create_get');
}
exports.create_post_post = function(req, res, next) {
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        picture: req.body.picture,
        date: date,
        description: req.body.description,
    })
    post.save((err) => {
        if (err) {
            return next(err);
        }
        const response = {
            message: "Post successfully created",
            status: 200,
            post: post,
        }
        res.status(200).json(response);
    })
}
exports.update_post_get = function(req, res, next) {
    res.send('post_update_get');
}

exports.update_post_post = function(req, res, next) {
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    const post = new Post({
        _id: req.body.id,
        content: req.body.content,
        picture: req.body.picture,
        date: date,
        description: req.body.description,
    })

    Post.findByIdAndUpdate(req.body.id, post, {}, (err, result) => {
        if (err) {
            return res.status(400).json({message: "post update failed", status: 400});
        }
        return res.status(200).json({message: "post successfully updated", status: 200, post:post});
    })
}

exports.delete_post_get = function(req, res, next) {
    res.send('post_delete_get');
}
exports.delete_post_post = function(req, res, next) {
    async.parallel({
        post(callback) {
            Post.findById(req.params.id)
            .populate('comments')
            .exec(callback);
        }
    }, (err, result) => {
        console.log (result.post);
        if (err) {
            return next(err);
        }
        for (let i = 0; i < result.post.comments.length; i++) {
            Comment.findByIdAndRemove(result.post.comments[i].id, (err) => {
                if (err) {
                    return res.status(400).json({message: "something went wrong"});
                }
            })
        }

        Post.findByIdAndRemove(result.post.id, (err, result) => {
            if (err) {
                return res.status(400).json({message: "Something went wrong", status: 400});
            }
            res.status(200).json({message: "Post successfully deleted", status: 200});
        })
    })
}
