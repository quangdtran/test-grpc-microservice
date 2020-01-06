var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3001, () => console.log('Server run on port ', 3001));

// GRPC server
const notes = [
  { id: '1', title: 'Note List 1', content: 'Content 1' },
  { id: '2', title: 'Note List 2', content: 'Content 2' }
];

const books = [
  { id: '1', title: 'Book 1', content: 'Content 1' },
  { id: '2', title: 'Book 2', content: 'Content 2' }
];

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}
const PROTO_PATH = path.resolve(__dirname + '/protos/index.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const noteProto = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();
server.addService(
  noteProto.ApiService.service,
  {
    list: (req, callback) => {
      // console.log('from api: ', notes);
      callback(null, { notes });
    },
    list2: (req, callback) => {
      callback(null, { books });
    },
  }
);

server.bind('api:4001', grpc.ServerCredentials.createInsecure());
// server.bind('https://172.22.0.1/grpc/api', grpc.ServerCredentials.createInsecure());
server.start();
console.log('Server running at http://localhost:4001');
