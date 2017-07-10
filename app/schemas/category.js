var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var MovieSchema = new mongoose.Schema({
	name: String,
	movies: [
		{
			type: ObjectId,
			ref: "Movie"
		}
	],
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

MovieSchema.pre("save", function(next){
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	next();
});

MovieSchema.statics = {
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

module.exports = MovieSchema;


