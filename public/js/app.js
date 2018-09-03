
$('#get-times').on('click', function() {
  $('#results').empty();
  //get ny times articles
  $.ajax({
    method: 'GET',
    url: '/nytimes'
  }).then(function(articles) {
    //create a new entry and append it to results for each article
    $(articles).each(function(i, article) {
      var entry = createEntry(article);
      $('#results').append(entry);
    });
    //set event listener for comment toggle
    $('.comment').on('click', function() {
      commentToggle(this);
    });
  });
});

$('#get-fox').on('click', function() {
  $('#results').empty();
  //get fox news articles
  $.ajax({
    method: 'GET',
    url: '/foxnews'
  }).then(function(articles){
    //create a new entry and append it to results for each article
    $(articles).each(function(i, article) {
      const entry = createEntry(article);
      $('#results').append(entry);
    });
    //set event listener for comment toggle
    $('.comment').on('click', function() {
      commentToggle(this);
    });
  });
});

$("#get-wsj").on('click', function() {
  // get wall street journal articles
  $('#results').empty();
  $.ajax({
    method: 'GET',
    url: '/wsj'
  }).then(function(articles) {
    //create a new entry and append it to the results for each article
    $(articles).each(function(i, article) {
      const entry = createEntry(article);
      $('#results').append(entry)
    });
    //set event listener for comment toggle
    $('.comment').on('click', function() {
      commentToggle(this);
    });
  });
});

//creates a new article entry
const createEntry = function(article) {
  //select colors based on the source
  const colors = setColors(article.source);
  let row = $('<div>').addClass('row animated fadeInDown');
  //create comments input element
  let input = createInput(colors);
  //set article.source to be full source name
  if(article.source === 'nytimes'){
    article.source = 'The New York Times';
  }else if(article.source === 'foxnews'){
    article.source = 'Fox News';
  }else if(article.source === 'wsj') {
    article.source = 'The Wall Street Journal'
  }

  let card = $('<div>').addClass('card z-depth-4')
    .attr('id', article._id)
    .append(
      $('<div>').addClass('card-content').append(
        $('<p>').addClass(colors.textColor).text(article.source),
        $('<span>').addClass('card-title').text(article.title),
        $('<p>').text(article.summary),
        $('<button>').addClass('btn-floating right hoverable medium comment').html(
          `<i class="material-icons ${colors.color}">mode_comment</i>`
        )
      ),
    $('<div>').addClass('card-action').append(
      $('<a>')
        .addClass(colors.textColor)
        .attr('href', article.link)
        .attr('target', '_blank')
        .text('Click here to read the full Article')
    ),
    $('<div>').addClass('card-content hidden animated fadeInDown comment-div').append(
      $('<span>').addClass('card-title').text('Comments'),
      $('<div>').addClass('container comment-form').append(input),
      $('<div>').addClass('container user-comments')
      
    )
  );
  //creates a comment element for each comment and prepends it to the comments div
  article.comments.forEach(function(c) {
    let commentEl = createComment(c);
    card.find('.user-comments').prepend(commentEl);
  });

  row.append(card);
  return row;
}
//sets event listener to toggle the comments by clicking the comment icon
const commentToggle = function(elem) {
  const card = $(elem).closest('.card');
  const comments = card.find('.comment-div');
  if(comments.hasClass('hidden')){
    comments.removeClass('hidden');
    submitListener();
  }else{
    comments.addClass('hidden');
  }

}
//event listener for submitting a comment
const submitListener = function(){
  $('.submit-comment').on('click', function() {
    const form = $(this).parents('#commentForm');
    const name = form.find('#displayName').val().trim();
    const comment = form.find('#newComment').val().trim();
    const articleId = $(this).parents('.card').attr('id');
    
    const data = {
      userName: name,
      comment: comment,
      articleId: articleId
    }
    //post request to create a new comment, prepends new comment to the comments section
    $.post('/api/comment', data, function(data) {
      //create new card with data
      console.log(data)
      const newComment = createComment(data);
      form.closest('.card').find('.user-comments').prepend(newComment)
    });
  });
}

//creates elements for new comment form
const createInput = function(colors) {
  const form = $('<div>').attr('id', 'commentForm');
  const row1 = $('<div>').addClass('row marginless');
  const inputField = $('<div>').addClass('input-field col s-6').append(
    $('<span>').text('Name: '),
    $('<input>')
      .addClass(colors.textColor)
      .attr('placeholder', 'enter a name')
      .attr('type', 'text')
      .attr('id', 'displayName'),
  );

  const row2 = $('<div>').addClass('row marginless');
  const textareaField = $('<div>').addClass('input-field col s8').append(
      $('<span>').text('Comment: '),
      $('<textarea>')
        .addClass('materialize-textarea')
        .attr('id', 'newComment')
        .attr('placeholder', 'Enter your comment here'),
      $('<button>')
        .text('submit')
        .addClass('btn submit-comment hoverable')
        .addClass(colors.color)
  );


  row1.append(inputField);
  row2.append(textareaField);
  form.append(row1, row2);
  return form;
}
//creates comment element
const createComment = function(comment) {
  const section = $('<div>').addClass('section p-md').append(
    $('<h5>').addClass('p-sm-bottom').html(`<strong>${comment.userName}</strong> wrote: `),
    $('<p>').addClass('p-md-left p-sm-bottom').text(comment.comment),
    $('<p>').addClass('p-sm-bottom').text(`-at ${comment.createdAt}`),
    $('<div>').addClass('divider')
  );
  return section;
}
//selecs theme color based on the source of the article
const setColors = function(source) {
  let colors = {};
  switch (source) {
    case 'wsj':
      colors.color = 'deep-purple lighten-1';
      colors.textColor = 'deep-purple-text lighten-1';
      break;
    case 'foxnews':
      colors.color = 'red darken-1';
      colors.textColor = 'red-text darken-1';
      break;
    case 'nytimes':
      colors.color = 'blue darken-1';
      colors.textColor = 'blue-text darken-1';
  }
  return colors;
}