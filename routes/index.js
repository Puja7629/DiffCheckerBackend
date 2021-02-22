var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var upload = multer();
var path = require('path');

const exec = require('child_process').exec;


function createDiff(timestamp, res){

  let data = '';

  exec("git diff --no-index --word-diff=porcelain diffFileUpload/"+timestamp+"_file1 diffFileUpload/"+timestamp+"_file2>diffFileUpload/"+timestamp+"_compare",(error, stdout, stderr)=>{
    const comparePath = "../diffFileUpload/"+timestamp+"_compare";
    var readStream = fs.createReadStream(path.join(__dirname, comparePath), 'utf-8');
    readStream.on('data', function(chunk){
      data += chunk;
    }).on('end', function(){
      data = data.split("\n");
      res.send(data.splice(5, data.length));
    });
  });
}

/* Post home page. */
router.post('/', upload.none(), function(req, res) {
  const timestamp = Date.now().toString();
  const filePath = "diffFileUpload/"+timestamp;
  fs.writeFile(filePath+"_file1", req.body["file1"], function(err){
    if(err){
      return console.error(err);
    }
  });

  fs.writeFile(filePath+"_file2", req.body["file2"], function(err){
    if(err){
      return console.error(err);
    }
  });

  createDiff(timestamp, res);
});

module.exports = router;
