var Comment = require("../models/comment");
var _ = require("underscore");

// admin post movie
exports.save = function(req, res){
	var data = req.body;
	var comment = data.comment;
	var movieid = data.movie;
	var from = data.from;
	console.log(data)
	if(data.cid){
		Comment.findById(data.cid, function(err, comment){
			var reply = {
				from: data.from,
				to: data.tid,
				comment: data.comment
			}

			comment.reply.push(reply)

			comment.save(function(err, comment){
				if(err) console.log(err);
				res.redirect("/movie/" + movieid);
			});
		})
	} else {
		_comment = new Comment({
			movie: movieid,
			comment: comment,
			from: from
		});

		_comment.save(function(err, comment){
			if(err) console.log(err);
			res.redirect("/movie/" + movieid);
		});
	}
};
