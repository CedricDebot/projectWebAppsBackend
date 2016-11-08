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

router.param('region', function(req, res, next, region) {
	var query = Dj.find({region: region});

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

router.param('genre', function(req, res, next, genre){
	var query = Dj.find({genres: genre});

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

router.param('price', function(req, res, next, price){
	var query = Dj.find({price: {$lte:price}});

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

/*router.param('region&price', function(req, res, next, region, price){
	var query = Dj.find({$and: [{region : region}, {price: {$lte: price}}]});

	query.exec(function(err, dj){
		if(err) {
			return next(err);
		}
		if(!dj) {
			return next(new Error('Can\'t find any dj'));
		}

		req.dj = dj;
		return next();
	});
});

router.param('region&genre', function(req, res, next, region, genre) {
	var query = Dj.find({$and: [{region : region}, {genres : genre}]});

	query.exec(function(err, dj){
		if(err) {
			return next(err);
		}
		if(!dj) {
			return next(new Error('Can\'t find any dj'));
		}

		req.dj = dj;
		return next();
	});
});

router.param('genre&price', function(req, res, next, genre, price){
	var query = Dj.find({$and: [{genres: genre}, {price: {$lte: price}}]});

	query.exec(function(err, dj){
		if(err) {
			return next(err);
		}
		if(!dj) {
			return next(new Error('Can\'t find any dj'));
		}

		req.dj = dj;
		return next();
	});
});

router.param('region&genre&price', function(req, res, next, region, genre, price){
	var query = Dj.find({$and: [{region : region},{genres: genre},{price: {$lte: price}}]});

	query.exec(function(err, dj){
		if(err) {
			return next(err);
		}
		if(!dj) {
			return next(new Error('Can\'t find any dj'));
		}

		req.dj = dj;
		return next();
	});
});
*/

router.get('/djs', function(req, res, next){
	Dj.find(function(err, djs){
		if(err) {
			return next(err);
		}

		res.json(djs);
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

router.get('/djs/region/:region', function(req, res){
	res.json(req.dj);
});

router.get('/djs/genres/:genre', function(req, res) {
	res.json(req.dj);
});

router.get('/djs/price/:price', function(req, res) {
	res.json(req.dj);
});

router.get('/djs/region/:region&/price/:price', function(req, res){
	res.json(req.dj);
});

router.get('/djs/region/:region&/genres/:genre', function(req, res){
	res.json(req.dj);
});

router.get('/djs/genre/:genre&/price/:price', function(req, res){
	res.json(req.dj);
})

router.get('/djs/region/:region&/genre/:genre&/price/:price', function(req, res){
	res.json(req.dj);
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
