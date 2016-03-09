/* GET 'about' page */
module.exports.about = function(req, res) {
  res.render('generic-text',
      {
        title: 'About',
        content: 'wifiPlz was created to help people find places to sit down and get a bit of work done.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum cursus, metus vel aliquet suscipit, diam odio condimentum quam, eget tristique est risus vel risus. Vestibulum varius leo at nibh finibus, sodales molestie dui aliquet. Sed maximus ut tortor quis sagittis. Ut pellentesque faucibus nibh sed consectetur. Aliquam sit amet nulla at nulla consectetur pellentesque. Ut dignissim orci non cursus gravida. Fusce mattis maximus tellus, sit amet malesuada ligula gravida in. Sed sagittis mollis ultrices. Morbi nisl leo, laoreet sit amet ornare a, luctus ultrices odio. Phasellus laoreet arcu enim, nec commodo tortor aliquet a. Nulla mauris nisl, laoreet ac ornare vitae, porttitor at nunc. Sed tempor libero sed pulvinar porta. Nullam sagittis fringilla nulla nec euismod.\n\nProin quis libero facilisis, dignissim lacus a, feugiat quam. Ut laoreet ex diam, non malesuada leo ullamcorper at. Donec sit amet neque consequat, convallis augue nec, fermentum lectus. Praesent quis erat ac libero cursus tempor. Vivamus non mauris augue. Vivamus eget nibh non ex cursus mattis. Vivamus scelerisque venenatis tellus mattis cursus. Etiam at risus ac quam dignissim porta et eget mauris. Nam sollicitudin pharetra maximus. Fusce et ipsum a nibh facilisis dignissim quis a nisi.'
      });
}
