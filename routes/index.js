var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

// Página de entrada (home page)
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload de rutas con :quizId
router.param('quizId', quizController.load); // autoload :quizId
// Autoload de rutas con :commentId
router.param('commentId', commentController.load); // autoload :commentId

// Definición de rutas de sesión
router.get('/login',  sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);

// Definición de rutas de quizes
router.get('/quizes',                      sessionController.sessionTimeout, quizController.index);
router.get('/quizes/:quizId(\\d+)',        sessionController.sessionTimeout, quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', sessionController.sessionTimeout, quizController.answer);
router.get('/quizes/new',                  sessionController.sessionTimeout, sessionController.loginRequired, quizController.new);
router.post('/quizes/create',              sessionController.sessionTimeout, sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.sessionTimeout, sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',        sessionController.sessionTimeout, sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',     sessionController.sessionTimeout, sessionController.loginRequired, quizController.destroy);

// Definición de rutas de comments
router.get('/quizes/:quizId(\\d+)/comments/new', sessionController.sessionTimeout, commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',    sessionController.sessionTimeout, commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.sessionTimeout, sessionController.loginRequired, commentController.publish);
//router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', commentController.publish);

// Otras rutas
router.get('/author', sessionController.sessionTimeout, quizController.author);

module.exports = router;
