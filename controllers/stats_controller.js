var models = require('../models/models.js');
var async = require('async');
var stats = {
	totalQuizes: 'ND',
	totalComments: 'ND',
	mediaComments: 'ND',
	quizesSinComments: 'ND',
	quizesConComments: 'ND'
};

// GET /quizes/statistics
exports.statistics = function(req, res, next) {
  models.Quiz.count().then(function(totalQuizes) {
    stats.totalQuizes = totalQuizes;
    console.log('quizes '+stats.totalQuizes);
  }).then(
  models.Comment.count().then(function(totalComments) {
    stats.totalComments = totalComments;
    console.log('comments '+stats.totalComments);
  }).then(
  models.Quiz.count({ 
		      include: [{ model: models.Comment, required: true }],
		      distinct: true
		    }).then(function(quizesConComments) {
    stats.quizesConComments = quizesConComments;
    console.log('quizesConComments '+stats.quizesConComments);
    // Cálculo de estadísticas restantes
    stats.mediaComments = (stats.totalComments / stats.totalQuizes).toFixed(2);
    console.log('mediaComments '+stats.mediaComments);
    stats.quizesSinComments = stats.totalQuizes - stats.quizesConComments;
    console.log('quizesSinComments '+stats.quizesSinComments);
    // renderización de la página
    res.render('quizes/statistics', { stats: stats, errors: [] });
  }))).catch(function(error) { next(error); });
};
