var models = require('../models/models.js');
var async = require('async');
var stats = {
	totalQuizes: 'ND',
	totalComments: 'ND',
	mediaComments: 'ND',
	quizesSinComments: 'ND',
	quizesConComments: 'ND'
};
// Cargar modelo ORM
var Sequelize = require('sequelize');

// GET /quizes/statistics
exports.statistics = function(req, res) {
  // obtenemos estadísticas en modo asíncrono
  async.parallel([
    function(callback) { //número de quizes
  	models.Quiz.count().then(
  	  function(total) {
  	    stats.totalQuizes = total;
  	    console.log('quizes '+stats.totalQuizes+' '+total);
  	  }
        ).catch(function(error) { next(error); });
        callback();        
    },
    function(callback) { //número de comentarios
  	models.Comment.count().then(
  	  function(total) {
  	    stats.totalComments = total;
  	    console.log('comments '+stats.totalComments+' '+total);
  	  }
        ).catch(function(error) { next(error); });
        callback();        
    },
    function(callback) { //número de preguntas con comentarios
  	models.Quiz.findAll({
		include: [{
	            model: models.Comment,
	            where: { QuizId: Sequelize.col('quiz.id') }
  		}]
	}).then(
  	  function(total) {
		console.log(JSON.stringify(total));
		
  	    stats.quizesConComments = total.length;
  	    console.log('quizesConComments '+stats.quizesConComments+' '+total);
  	  }
        ).catch(function(error) { next(error); });
        callback();        
    }
  ],
  function(err) {
    // Cálculo de estadísticas restantes
    stats.mediaComments = (stats.totalComments / stats.totalQuizes).toFixed(2);
    stats.quizesSinComments = stats.totalQuizes - stats.quizesConComments;
    // renderización de la página
    res.render('quizes/statistics', { stats: stats, errors: [] });
  });
};
