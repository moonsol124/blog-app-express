const async = require('async');
const { findById } = require('../models/post');
const Post = require("../models/post");
const Comment = require("../models/comment");
var today = new Date();   

exports.comments = function(req, res, next) {
    async.parallel({
        post(callback) {
            Post.findById(req.params.id)
            .populate('comments')
            .exec(callback);
        },
        comments(callback) {
            Comment.find({
                postid: req.params.id,
            })
            .exec(callback);
        }
    }, (err, result) => {
        if (err) {
            return res.status(404).json({message: "Resource not found", status: 400});
        }
        res.status(200).json({message: "Comments successfully loaded", status:200, comments: result});
    })
}
exports.comment_detail = function(req, res, next) {
    async.parallel({
        post(callback) {
            Post.findById(req.params.postid).exec(callback);
        },
        comment(callback) {
            Comment.findById(req.params.commentid).exec(callback);
        }
    }, (err, result) => {
        if (err) {
            return next(err);
        }
        console.log (result.post);
        console.log (result.comment);
        res.send(result);
    })
}
exports.create_comment_get = function(req, res, next) {
    res.send('create comment get'+req.params.id);
}
exports.create_comment_post = function(req, res, next) {
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    async.parallel({
        post(callback) {
            Post.findById(req.params.id).exec(callback);
        }
    }, (err, result) => {
        if (err) {
            return next(err);
        }
        const comment = new Comment({
            post: result.post,
            username: req.body.username,
            password: req.body.password,
            title: req.body.title,
            content: req.body.content,
            postid: result.post.id,
            date: date,
        })

        comment.save((err) => {
            if (err) {
                return res.status(400).json({message:"something went wrong", status:'400'});
            }
        })
        const newPost = new Post({
            comments: [...result.post.comments, comment],
            _id: result.post.id,
            title: result.post.title,
            content: result.post.content,
        })

        Post.findByIdAndUpdate(result.post.id, newPost, {}, (err) => {
            if (err) {
                return res.status(400).json({message:"something went wrong", status:'400'});
            }
            res.status(200).json({message: 'comment successfully created', status: 200});
        })
    })
}

exports.update_comment_get = function(req, res, next) {
    res.send('update comment get');
}
exports.update_comment_put = function(req, res, next) {
    console.log (req.body);
    async.parallel({
        post(callback) {
            Post.findById(req.params.postid).exec(callback);
        },
        comment(callback) {
            Comment.findById(req.params.commentid).exec(callback);
        }
    }, (err, result) => {
        if (err) {
            return res.status(400).json({message: "Error occured", status: 200});
        }
        if (result.comment.password !== req.body.password) {
            return res.status(400).json({message: "Passwords do not match", status: 400});
        }

        const comment = new Comment({
            post: result.post,
            username: result.comment.username,
            password: result.comment.password,
            title: req.body.title,
            content: req.body.content,
            postid: result.comment.postid,
            _id: req.params.commentid,
        })

        console.log (result.comment);
        // console.log (comment);
        Comment.findByIdAndUpdate(comment.id, comment, {}, (err, result) => {
            if (err) {
                return res.status(400).json({message: 'comment not updated', status: 400});
            }
            return res.status(200).json({message: 'comment successfully updated', status: 200});
        })
    })
}
exports.delete_comment_get = function(req, res, next) {
    res.send('delete comment get');
}

exports.delete_comment_delete = function(req, res, next) {
    async.parallel({
        post(callback) {
            Post.findById(req.params.postid)
            .populate('comments')
            .exec(callback);
        },
        comment(callback) {
            Comment.findById(req.params.commentid).exec(callback);
        }
    }, (err, result) => {
        if (err) {
            return next(err);
        }

        console.log (req.body.password);
        console.log (result.comment.password);
        if (result.comment.password !== req.body.password) {
            return res.status(400).json({"message": "Passwords do not match", status: 400});
        }

        const commentsFiltered = (result.post.comments).filter((comment) => {
            if (comment.id !== req.params.commentid) {
                return true;
            }
            else {
                return false;
            }
        })

        const post = new Post({
            _id: req.params.postid,
            author: result.post.author,
            title: result.post.title,
            content: result.post.content,
            comments: commentsFiltered,
        })

        Post.findByIdAndUpdate(req.params.postid, post, {}, (err) => {
            if (err) {
                return res.status(400).json({message:'comment delete failed', status: 400})
            }
        })
        
        Comment.findByIdAndRemove(req.params.commentid, (err) => {
            if (err) {
                return res.status(400).json({message:'comment delete failed', status: 400})
            }
        })
        return res.status(200).json({message: 'comment deleted', status: 200})
    })
}
//     async.parallel({
//         post(callback) {
//             Post.findById(req.params.postid).exec(callback);
//         },
//         comment(callback) {
//             Comment.findById(req.params.commentid).exec(callback);
//         }
//     }, (err, result) => {
//         if (err) {
//             return next(err);
//         }
//         Comment.findByIdAndRemove(result.comment.id, (err, result) => {
//             if (err) {
//                 return next(err);
//             }
//             res.send('item deleted');
//         })
//     }
// }