var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var CommentSchema = new mongoose.Schema({
	movie: {
		type: ObjectId,
		ref: "Movie"
	},
	from: {
		type: ObjectId,
		ref: "User"
	},
	reply:[
		{
			from: {
				type: ObjectId,
				ref: "User"
			},
			to: {
				type: ObjectId,
				ref: "User"		
			},
			comment: String
		}
	],
	comment: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},

		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

CommentSchema.pre("save", function(next){
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	next();
});

CommentSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort("meta.createAt")
			.exec(cb);
	},

	findById: function(id, cb){
		return this
			.findOne({_id: mongoose.Types.ObjectId(id)})
			.sort("meta.createAt")
			.exec(cb);
	}
};

module.exports = CommentSchema;


