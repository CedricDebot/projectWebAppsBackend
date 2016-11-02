var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	author: String,
	body: String, 
	upvotes: {type: Number, default: 0},
	dj: { type: mongoose.Schema.Types.ObjectId, ref: 'Dj' }
});

mongoose.model('Comment', CommentSchema);
