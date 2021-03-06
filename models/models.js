var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/DATABASE_URL
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(
  DB_name,
  user,
  pwd,
  { dialect:	protocol,
    protocol:	protocol,
    port: 	port,
    host:	host,
    storage: 	storage, //solo SQLite (.env)
    omitNull:	true //solo Postgres
  }
);

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Importar la definición de la tabla Comment en comment.js
var Comment = sequelize.import(path.join(__dirname, 'comment'));
// Definimos relación 1 a N
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Exportamos tablas
exports.Quiz = Quiz;	//exportar definición de tabla Quiz
exports.Comment = Comment;	//exportar definición de tabla Comment

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // then(...) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function(count) {
    if (count === 0) { // la tabla se inicializa solo si está vacía
      Quiz.create({
		    tema: 'humanidades',
		    pregunta: 'Capital de Italia',
		    respuesta: 'Roma'
		  })
	  .success(function() {console.log('Base de datos inicializada')});
    }
  });
});