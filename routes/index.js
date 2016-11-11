var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
require('../models/Djs');
require('../models/Comments');

var Dj = mongoose.model('Dj');
var Comment = mongoose.model('Comment');

router.param('dj', function(req, res, next, id){
	var query = Dj.findById(id);

	query.exec(function(err, dj){
		if(err) {
			return next(err);
					}
		if(!dj) {
				return next(new Error('Can\'t find dj'));
		}

		req.dj = dj;
		return next();
	});
});

router.param('comment', function(req, res, next, id){
	var query = Comment.findById(id);

	query.exec(function(err, comment){
		if(err) {
			return next(err);
		}
		if(!comment) {
			return next(new Error('Can\'t find comment'));
		}

		req.comment = comment;
		return next();
	});
});

router.param('djName', function(req, res, next, djname){
	var query = Dj.find({djName: djname });

	query.exec(function(err, dj){
		if(err) {
			return next(err);
					}
		if(!dj) {
				return next(new Error('Can\'t find dj'));
					}

		req.dj = dj;
		return next();
	});
});

router.post('/djs', function(req, res, next){
	var dj = new Dj(req.body);

	dj.save(function(err, dj) {
		if(err) {
		       	return next(err);
		}

		res.json(dj);
	});
});

router.get('/djs/:dj', function(req, res, next) {
	req.dj.populate('comments', function (err, dj) {
		if (err) {
			return next(err);
		}
		res.json(dj);
	});
});

router.get('/djs/djName/:djName', function(req, res){
	res.json(req.dj);
});

//GET /djs?region=Antwerpen&genre=house&price=160
router.get('/djs', function(req, res, next){
	var mongoQuery;

	switch (true) {
		case !req.query.region && !req.query.genre && !req.query.price:
			mongoQuery = Dj.find();
			break;
		case !req.query.region && !req.query.genre:
			mongoQuery = Dj.find({ price: {$lte: req.query.price }});
			break;
		case !req.query.region && !req.query.price:
			mongoQuery = Dj.find({ genres: req.query.genre });
			break;
		case !req.query.region:
			mongoQuery = Dj.find({$and: [{ genres: req.query.genre }, { price: { $lte: req.query.price }}]});
			break;
		case !req.query.genre && !req.query.price:
			mongoQuery = Dj.find({ region: req.query.region });
			break;
		case !req.query.genre:
			mongoQuery = Dj.find({$and: [{ region: req.query.region }, { price: { $lte: req.query.price }}]});
			break;
		case !req.query.price:
			mongoQuery = Dj.find({$and: [{ region: req.query.region }, { genres: req.query.genre}]});
			break;
		default:
			mongoQuery = Dj.find({$and: [{ region: req.query.region }, { genres: req.query.genre }, { price: { $lte: req.query.price }}]});
			break;
	}

	mongoQuery.exec(function(err, dj){
		if(err) {
			return next(err);
		}
		if (!dj) {
			return next(new Error('Can\'t find any dj'));
		}

		res.json(dj);
	//	return next();
	});
});

router.put('/djs/:dj/upvote', function(req, res, next) {
	req.dj.upvote(function (err, dj ) {
		if (err) {
			return next(err);
		}

		res.json(dj);
	});
});

router.post('/djs/:dj/comments', function(req, res, next){
	var comment = new Comment(req.body);
	comment.dj = req.dj;

	comment.save(function(err, comment){
		if (err) {
			return next(err);
		}

		req.dj.commments.push(comment);
		req.dj.save(function(err, dj) {
			if (err) {
				return next(err);
			}

			res.json(comment);
		});
	});
});

router.put('/djs/:dj/comments/:comment/upvote', function(req, res, next) {
	req.comment.upvote(function (err, comment) {
		if (err) {
			return next(err);
		}

		res.json(comment);
	});
});

router.delete('/djs/:dj', function(req, res, next){
	req.dj.remove(function(err, dj){
		if (err) {
			return next(err);
		}
	});

	res.json("dj deleted succesfully");
});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {title: 'Express'});
});

module.exports = router;
