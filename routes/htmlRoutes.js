const db = require('../models');
const moment = require('moment');

module.exports = function(app) {
  app.get('/nytimes', function(req, res) {
    db.Articles
      .find({source: 'nytimes'})
      .sort({'createdAt': -1})
      .populate('comments')
      .then(function(articles) {
        res.json(articles);
      });
    });

  app.get('/foxnews', function(req, res) {
    db.Articles
      .find({source: 'foxnews'})
      .sort({'createdAt': -1})
      .populate('comments')
      .then(function(articles) {
      res.json(articles);
    });
  });

  app.get('/wsj', function(req, res) {
    db.Articles
      .find({source: 'wsj'})
      .sort({'createdAt': -1})
      .populate('comments')
      .then(function(articles) {
      res.json(articles);
    });
  });
};

