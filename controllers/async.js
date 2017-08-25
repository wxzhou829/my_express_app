async.parallel({
	author1: function(callback){
		.exec(callback);
	},
	author2: function(callback){
		.exec(callback);
	},
},function(err,results){
	if (err) { return next(err); }
	//Successful, so render
	res.render('',{});
});