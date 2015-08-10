// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function (req, res, next) {
  if (req.session.user) {
    next();
  }
  else {
    res.redirect('/login');
  }
};

// MW de comprobación de timeout de sesión
exports.sessionTimeout = function (req, res, next) {
  var TIMEOUT = 2 * 60 * 1000;
  if (req.session.user) {
    var ahora = new Date();
    var ultimaTransacción = new Date(req.session.user.time);
    var tiempoTranscurrido = ahora.getTime() - ultimaTransacción.getTime();
    console.log('tiempo transcurrido ' + tiempoTranscurrido);
    if ( tiempoTranscurrido > TIMEOUT ) {
      console.log('LOGOUT');
      res.redirect('/logout');
    }
    else{
      next();
    }
  }
  else{
    //res.redirect('/login');
    next();
  }
};

// GET /login    - Formulario de login
exports.new = function(req, res) {
  var errors = req.session.errors || {};
  req.session.errors = {};
  res.render('sessions/new', { errors: errors });  
};

// POST /login   - Crear la sesión
exports.create = function(req, res) {
  var login    = req.body.login;
  var password = req.body.password;
  
  var userController = require('./user_controller');
  userController.autenticar(login, password, function(error, user) {
    if (error) {	// si hay error retornamos mensajes de error de sesión
      //req.session.errors = [{"message": 'Se ha producido un error: ' + error}];
      req.session.errors = [{"message": "" + error}];
      res.redirect("/login");
      return;
    }
  
    // Crear req.session.user y guardar campos id y username
    // La sesión se define por la existencia de: req.session.user
    req.session.user = { id: user.id, username: user.username, time: new Date() };
    // redirección a path anterior a login
    res.redirect(req.session.redir.toString());
  }); 
};



// DELETE (GET) /logout   - Destruir sesión
exports.destroy = function (req, res) {
  delete req.session.user;
  // redirección a path anterior a login
  res.redirect(req.session.redir.toString());
};