$(function(){
	$(".comment").click(function(e){
		var target = $(this);
		var tId = target.data("tid");
		var commentId = target.data("cid");

		if($("#toId").length > 0){
			$("#toId").val(tId)
		} else {
			$("<input>").attr({
				id: "toId",
				type: "hidden",
				name: "tid",
				value: tId
			}).appendTo("#commmentForm")
		}
		
		if($("#commentId").length > 0){
			$("#commentId").val(commentId)
		} else {
			$("<input>").attr({
				id: "commentId",
				type: "hidden",
				name: "cid",
				value: commentId
			}).appendTo("#commmentForm")
		}
	});
});
