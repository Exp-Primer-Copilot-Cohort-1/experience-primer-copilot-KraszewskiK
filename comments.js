// Create web server
// Load modules
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./models/comment');

// Connect to the database
mongoose.connect('mongodb://localhost/comments');

// Create the application
var app = express();

// Configure the application
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create the router
var router = express.Router();

// Create the routes
router.route('/comments')
  // Add a comment
  .post(function(request, response) {
    var comment = new Comment();
    comment.name = request.body.name;
    comment.text = request.body.text;
    comment.save(function(error) {
      if (error) {
        response.send(error);
      }
      response.json({ message: 'Comment added.' });
    });
  })
  // Get all comments
  .get(function(request, response) {
    Comment.find(function(error, comments) {
      if (error) {
        response.send(error);
      }
      response.json(comments);
    });
  });
router.route('/comments/:comment_id')
  // Get a comment
  .get(function(request, response) {
    Comment.findById(request.params.comment_id, function(error, comment) {
      if (error) {
        response.send(error);
      }
      response.json(comment);
    });
  })
  // Update a comment
  .put(function(request, response) {
    Comment.findById(request.params.comment_id, function(error, comment) {
      if (error) {
        response.send(error);
      }
      comment.name = request.body.name;
      comment.text = request.body.text;
      comment.save(function(error) {
        if (error) {
          response.send(error);
        }
        response.json({ message: 'Comment updated.' });
      });
    });
  })
  // Delete a comment
  .delete(function(request, response) {
    Comment.remove({ _id: request.params.comment_id }, function(error, comment) {
      if (error) {
        response.send(error);
      }
      response.json({ message: 'Comment deleted.' });
    });
  });

// Register the routes
app.use('/api', router);

// Start the server
app.listen(3000);
console.log('Listening on port 3000...');