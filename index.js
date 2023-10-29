var express = require('express');
var cors = require('cors');
require('dotenv').config();
const multer  = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

var app = express();

const uploadSchema = new mongoose.Schema({
name: String,
data: Buffer,
type: String,
size: Number,
});

const Upload = mongoose.model('Upload', uploadSchema);

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {

  const upload = new Upload();
  upload.name = req.file.originalname;
  upload.data = req.file.buffer;
  upload.type = req.file.mimetype;
  upload.size = req.file.size;

  upload.save();

  res.json({name: upload.name, type: upload.type, size: upload.size})
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
