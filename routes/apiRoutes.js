//scraping
const request = require('request');
const cheerio = require('cheerio');
const db = require('../models');


/**
 * https://www.nytimes.com/section/politics
 * http://www.foxnews.com/politics.html
 * https://www.thedailybeast.com/category/politics
 */

 module.exports = function(app) {
  //get nytimes articles
  app.get('/api/nytimes', function(req, res) {
    request("https://www.nytimes.com/section/politics", function(err, response, html) {
      const $ = cheerio.load(html);
      $("article.story").each(function(i, val) {
        let title = $(val).find(".headline").text().trim();
        let link = $(val).children('.story-body').find('a').attr('href');
        let summary = $(val).find('.summary').text().trim();

        let article = {
          title: title,
          link: link,
          summary: summary,
          source: 'nytimes'
        }

        db.Articles.create(article)
          .then(function(article) {
            return article;
          })
          .catch(function(err) {
            res.send(err);
        });
      });
    });
    res.send('scrape complete');
  });
  

  //Post foxnews articles
  app.get('/api/foxnews', function(req, res) {
    request('http://www.foxnews.com/politics.html', function(err, response, html) {
      const $ = cheerio.load(html);

      $('.info').each(function(i, val){
        let title = $(val).find('.title').text().trim();
        //if the article has a title then save to db
        if(title) {
          let link = $(val).find('.dek').children('a').attr('href') ||
          $(val).find('.title').children('a').attr('href');
          let summary = $(val).find('.content').text().trim();

          let article = {
            title: title,
            link: link,
            summary: summary,
            source: 'foxnews'
          }

          db.Articles.create(article)
            .then(function(article) {
              return article;
            })
            .catch(function(err) {
              res.send(err);
          });
        }
      });
    });
    res.send("scrape complete");
  });

  //post dailybeast articles

  app.get('/api/wsj', function(req, res) {
    request('https://www.wsj.com/news/politics', function(err, response, html) {
      const $ = cheerio.load(html);

      $('.wsj-card-body').each(function(i, val){
        const title = $(val).find('.wsj-headline').text().trim();

        if (title) {
          const summary = $(val).find('.wsj-summary').text().trim();
          const link = $(val).find('.wsj-headline-link').attr('href');
          
          const article = {
            title: title,
            link: link,
            summary: summary,
            source: 'wsj'
          }
          console.log(article);
  
          db.Articles.create(article)
            .then(function(article) {
              return article;
            })
            .catch(function(err) {
              res.send(err);
          });
        }
        
      });
      res.send('scrape complete');
    });

  });

  //put comment
  // app.post('/api/comment', function(req, res) {
  //   //add db code here
    
  //   return db.Comments.create(req.body)
  //     .then(function(dbComment) {
  //       console.log(dbComment)
  //       return db.Articles.findOneAndUpdate(
  //         { _id: dbComment.articleId }, 
  //         { $push: { comments: dbComment._id } }
  //       );
  //     }).then(function(dbComment) {
  //       res.json(dbComment);
  //     });
  // });

  app.post('/api/comment', function(req, res) {
    //add db code here
    
    db.Comments.create(req.body, function(err, dbComment){
      res.json(dbComment);
  
      return db.Articles.findOneAndUpdate(
        { _id: dbComment.articleId },
        { $push: { comments: dbComment._id } }
      ).then(function(){
        console.log('id should be inserted');
      });
      
    });
  });
  //get comments
  }  

 
 