$('#addReview').submit(function(e) {
  $('.alert.alert-danger').hide();

  console.log(!$('input#name').val(), !$('select#rating').val() , !$('textarea#review').val())

  if (!$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val()) {
    if ($('.alert.alert-danger').length) {
      $('.alert.alert-danger').show();
    }
    else {
      $(this).prepend('<div role="alert" class="alert alert-danger">' +
                      'All fields are required, please try again' +
                      '</div>');
    }
    return false;
  }
});
