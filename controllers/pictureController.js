const async = require('async');
// const { findById } = require('../models/post');
const Picture = require("../models/picture");
const Heart = require('../models/heart');
var today = new Date();   

exports.album = function(req, res, next) {
    async.parallel({
        album(callback) {
            Picture.find()
            .exec(callback)
        }
    }, (err, result) => {
        if (err) {
            return res.status(400).json({message: "album not found", status: 400});
        }
        return res.status(200).json({message: "album loaded", status:200, album: result.album});
    })
}

exports.create_picture_post = function(req, res, next) {
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const picture = new Picture({
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        date: date,
    })

    picture.save((err) => {
        if (err) {
            return res.status(400).json({message:"failed to save picture"});
        }

        const heart = new Heart({
            picture: picture,
            pictureId: picture.id,
            likes: 0,    
        })

        heart.save((err) => {
            if (err) {
                return res.status(400).json({message:"failed to save picture"});
            }
        })
    })

    return res.status(200).json({message: "photo successfully saved", picture: picture});
}

exports.picture_detail = function(req, res, next) {
    async.parallel({
        picture(callback) {
            Picture.findById(req.params.id)
            .exec(callback)
        }
    }, (err, result) => {
        if (err) {
            return res.status(400).json({message: 'picture not found', status: 400});
        }
        return res.status(200).json({message: "picture successfully loaded", status: 200, picture: result.picture});
    })
}

exports.get_heart = function(req, res, next) {
    console.log (req.body);
    async.parallel({
        heart(callback) {
            Heart.find({pictureId: req.body.id})
            .exec(callback)
        }
    }, (err, result) => {
        if (err) {
            return res.status(400).json({message: "heart not loaded", status:400});
        }
        return res.status(200).json({message: "heart loaded", status:200, heart: result.heart});
    })
}

exports.update_heart = function(req, res, next) {
    async.parallel({
        heart(callback) {
            Heart.find({pictureId: req.body.id})
            .exec(callback)
        }
    }, (err, result) => {
        if (err) {
            return res.status(400).json({message: "heart not updated", status:400});
        }

        let likesCalculation = 0;

        if (req.body.calculation === 'up') {
            likesCalculation = result.heart[0].likes+=1;
        }

        if (req.body.calculation === 'down') {
            likesCalculation = result.heart[0].likes-=1;
        }

        const heart = new Heart({
            _id: result.heart[0]['_id'],
            pictureId: result.heart[0].pictureId,
            likes: likesCalculation,
        })

        console.log(heart);
        Heart.findByIdAndUpdate(result.heart[0].id, heart, {}, (err, result) => {
            if (err) {
                return res.status(400).json({message: "heart not updated", status:400});
            }
        })
        return res.status(200).json({message:"heart updated", status:200, heart:result});
    })
}