var express = require('express');
var router = express.Router();

const path = require('path');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}
const PROTO_PATH = path.resolve(__dirname + '/../protos/index.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const ApiService = grpc.loadPackageDefinition(packageDefinition).ApiService;

const apiService = new ApiService(
  'api:4001',
  grpc.credentials.createInsecure(),
);

/* GET home page. */
router.get('/', async (req, res) => {
  res.locals.title = 'GRPC';
  res.render('index');
});

router.get('/notes', async (req, res) => {
  apiService.list({}, (err, notes) => {
    if (err) return res.json({
      status: false,
      error: err,
    });
    res.json({
      status: true,
      data: notes,
    });
  });
});

router.get('/books', async (req, res) => {
  apiService.list2({}, (err, books) => {
    if (err) return res.json({
      status: false,
      error: err,
    });
    res.json({
      status: true,
      data: books,
    });
  });
});

module.exports = router;
