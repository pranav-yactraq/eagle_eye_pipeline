const fse = require('fs-extra');
const ffmpeg = require('ffmpeg');
const fs = require('fs');

const date = new Date();

var s = `${date.getDate()}_${date.getMonth()+1}_${date.getYear()}`;

var fileNames = [];

fs.readdirSync(`./${s}_files/`).forEach(fileName => {
  fileNames.push(fileName);
});

console.log(fileNames);
var len = fileNames.length;
console.log(len);


 try {
  for (let i = 0 ; i < len ; i++){
	var process = new ffmpeg(`./${s}_files/${fileNames[i]}`);
	process.then(function (video) {
		video.fnExtractSoundToMP3(`./${s}_files/${fileNames[i]}_audio.mp3`, function (error, file) {
			if (!error)
			console.log('Audio file: ' + file);
			const renamedFile = file.replace('.mp4', '_');
			fs.renameSync(file, renamedFile);
			console.log('Renamed file to: ' + renamedFile);
			});
	}, function (err) {
		console.log('Error: ' + err);
	});}}
  catch (e) {
	console.error(e);
  }

 
