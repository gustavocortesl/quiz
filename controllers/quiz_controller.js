var models = require('../models/models.js');

// Autoload: factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
      where: { id: Number(quizId) },
      include: [{ model: models.Comment }]
    }).then(function(quiz) {
      if (quiz) {
	req.quiz = quiz;
	next();
      }
      else {
	next(new Error('No exixte quizId=' + quizId));
      }
    }
  ).catch(function(error) { next(error); });
};

// GET /quizes
exports.index = function(req, res) {
  var search = "%";
  var tema = "%";
  if (req.query.search) {
    search = "%" + req.query.search.replace(/\s/g, "%") + "%";
  }
  if (req.query.tema) {
    tema = "%" + req.query.tema.replace(/\s/g, "%") + "%";
  }
  models.Quiz.findAll({ where: ["tema like ? and pregunta like ?", tema, search], order: 'pregunta ASC' }).then(
    function(quizes) {
      res.render('quizes/index', { quizes: quizes, errors: [] });
    }
  ).catch(function(error) { next(error); });
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: [] });  
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: [] });  
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    { pregunta: "pregunta", respuesta: "respuesta" }
  );
  res.render('quizes/new', { quiz: quiz, errors: [] });  
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  quiz.validate().then(function(err) {
    if (err) {
      res.render('quizes/new', { quiz: quiz, errors: err.errors });
    }
    else {
      // guarda en BD los campos trma, pregunta y respuesta de quiz
      quiz.save({fields: ["tema", "pregunta", "respuesta"]}).then(function() {
	res.redirect('/quizes');
      }); // Redirección HTTP (URL relativo) lista de preguntas
    }
  });
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz; // autoload de instancia quiz
  res.render('quizes/edit', { quiz: quiz, errors: [] });  
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.tema = req.body.quiz.tema;
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  
  req.quiz.validate().then(function(err) {
    if (err) {
      res.render('quizes/edit', { quiz: req.quiz, errors: err.errors });
    }
    else {
      // save: guarda en BD los campos tema, pregunta y respuesta de quiz
      req.quiz.save({fields: ["tema", "pregunta", "respuesta"]}).then(function() {
	res.redirect('/quizes');
      }); // Redirección HTTP (URL relativo) lista de preguntas
    }
  });
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then(function() {
    res.redirect('/quizes');	 // Redirección HTTP a lista de preguntas
  }).catch(function(error) { next(error); });
};

// GET /author
exports.author = function(req, res) {
  res.render('author', { errors: [] });
};
