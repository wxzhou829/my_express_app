var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
var async = require('async');

//Display list of all BookInstances
exports.bookinstance_list = function(req, res, next){
  BookInstance.find()
  .populate('book')
  .exec(function(err, list_bookinstance){
    if (err){return next(err);}
	//Sucessful, so render
	res.render('bookinstance_list', {title:'Book Instance List', bookinstance_list: list_bookinstance});
  });
};

//Display detail page for a specific BookInstance
exports.bookinstance_detail = function(req, res, next){
	BookInstance.findById(req.params.id)
	.populate('book')
	.exec(function(err, bookinstance){
		if (err){return next(err);}
		//Sucessful, so render
		res.render('bookinstance_detail' , { title: 'Book:', bookinstance: bookinstance});
	});
};

//Display BookInstance create form on GET
exports.bookinstance_create_get = function(req, res, next){
	Book.find({},'title')
	.exec(function(err, books){
		if (err){return next(err);}
		//Sucessful, so render
		res.render('bookinstance_form', {title:'Create BookInstance', book_list: books});
	});
};

//Handle BookInstance create on POST
exports.bookinstance_create_post = function(req, res,next){
	req.checkBody('book', 'Boot must be specified').notEmpty();
	req.checkBody('imprint', 'Imprint must be specified').notEmpty();
	req.checkBody('due_back', 'Invalid date').optional({checkFalsy: true}).isDate();
	
	req.sanitize('book').escape();
	req.sanitize('book').trim();
	req.sanitize('imprint').escape();
	req.sanitize('imprint').trim();
	req.sanitize('status').escape();
	req.sanitize('status').trim();
	req.sanitize('due_back').toDate();
	
	var bookinstance = new BookInstance({
		book: req.body.book,
		imprint: req.body.imprint,
		status: req.body.status,
		due_back: req.body.due_back,
	});
	
	var errors = req.validationErrors();
	if (errors){
		Book.find({},'title')
		.exec(function(err, books){
			if (err){return next(err);}
			//Sucessful, so render
			res.render('bookinstance_form', {title:'Create BookInstance', book_list: books,
				 errors : errors, bookinstance : bookinstance});
		});
	}else{
		//Data from form is valid
		
		bookinstance.save(function(err){
			if (err){return next(err);}
			//Successful - redirect to new bookinstance record.
			res.redirect(bookinstance.url);
		});
	}
	
};

//Display BookInstance delete form on GET
exports.bookinstance_delete_get = function(req, res, next){
	BookInstance.findById(req.params.id).populate('book').exec(function(err, results){
		if (err){return next(err);}
		res.render('bookinstance_delete',{title: 'Delete Copies ID', bookinstance : results});
	});	
};

//Handle BookInstance delete on POST
exports.bookinstance_delete_post = function(req, res){
	BookInstance.findByIdAndRemove(req.body.bookinstanceid, function (err){
		if (err){return next(err);}
			//Success - got to book list
			res.redirect('/catalog//bookinstances');
	});
};

//Display BookInstance update form on GET
exports.bookinstance_update_get = function(req, res, next){
	
	async.parallel({
		bookinstance: function(callback){
			BookInstance.findById(req.params.id).exec(callback);
		},
		books: function(callback){
			 Book.find({},'title').exec(callback);
		},
	},function(err, results){
		if (err){return next(err)}
		//Successful, so render
		res.render('bookinstance_form', {title:'Update BookInstance', book_list: results.books, 
			bookinstance : results.bookinstance});
		
	});
};

//Handle BookInstance update form on POST
exports.bookinstance_update_post = function(req, res, next){
	req.checkBody('book', 'Boot must be specified').notEmpty();
	req.checkBody('imprint', 'Imprint must be specified').notEmpty();
	req.checkBody('due_back', 'Invalid date').optional({checkFalsy: true}).isDate();
	
	req.sanitize('book').escape();
	req.sanitize('book').trim();
	req.sanitize('imprint').escape();
	req.sanitize('imprint').trim();
	req.sanitize('status').escape();
	req.sanitize('status').trim();
	req.sanitize('due_back').toDate();
	
	var bookinstance = new BookInstance({
		book: req.body.book,
		imprint: req.body.imprint,
		status: req.body.status,
		due_back: req.body.due_back,
		_id: req.params.id
	});
	
	var errors = req.validationErrors();
	if (errors){
		Book.find({},'title')
		.exec(function(err, books){
			if (err){return next(err);}
			//Sucessful, so render
			res.render('bookinstance_form', {title:'Update BookInstance', book_list: books,
				 errors : errors, bookinstance : bookinstance});
		});
	}else{
		//Data from form is valid		
		BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function(err, bookinstance){
			if (err) {return next(err);}
			res.redirect(bookinstance.url)
		})
	}
};
