var mongoose = require('mongoose');

var DjSchema = new mongoose.Schema({
	djName: String,
	email: String,
	region: String,
	price: Number,
	genres: [{type: String, ref:'Genre'}],
	biography: String,
	references: [{type: String, ref: 'Reference'}],
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

mongoose.model('Dj', DjSchema);
