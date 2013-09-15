exports.addRoutes = function(app, config) {
  // Basic Restful Routes
  // app.get('/blogs', function (req, res) {
  //   res.send({route: 'index'});
  // });
  // app.get('/blogs/add', function (req, res) {
  //   res.send({route: 'add'});
  // });
  // app.get('/blogs/:id', function (req, res) {
  //   res.send({route: 'show'});
  // });
  // app.get('/blogs/:id/edit', function (req, res) {
  //   res.send({route: 'edit'});
  // });
  // app.post('/blogs', function (req, res) {
  //   res.send({route: 'create'});
  // });
  // app.put('/blogs/:id', function (req, res) {
  //   res.send({route: 'update'});
  // });
  // app.del('/blogs/:id', function (req, res) {
  //   res.send({route: 'delete'});
  // });


  // This route enables HTML5Mode by sending missing files an error
  app.all('/*', function(req, res) {
    res.status(404).send({error: 'route not found'});
  });
};
