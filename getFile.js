require('dotenv').config();
const fse = require('fs-extra')
const fs = require('fs');
const { exec } = require('child_process');

const date = new Date()
var s = `${date.getDate()}_${date.getMonth()+1}_${date.getYear()}`
var downloads;

async function fetchDownloadList() {
 const data = await fs.readFileSync(`${s}_downloads.json`)
 return JSON.parse(data.toString());
}

// adds a file name to metadata by removing the 'name' key value whitespaces .
async function curateDownloadList() {
  downloads  = await fetchDownloadList();
  // console.log(downloads)
  downloads = downloads.results;
  downloads.forEach((metaData) => {
    metaData.fileName = metaData.name.replace(/\s/g,'_').replace(/(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})/, '$1T$2').replace(/[()]/g, '');
  })
  console.log(downloads);
}


//function to execute download curl command
async function downloadFiles (id,name) {
let downloadId = id;
const url = `https://api.c005.eagleeyenetworks.com/api/v3.0/downloads/${downloadId}:download`;

const options = {
  method: 'GET',
  headers: {
    authorization: `Bearer ${process.env.ACCESS_TOKEN}`
  }
};


const curlCommand = `curl --request GET \
  --url https://api.c005.eagleeyenetworks.com/api/v3.0/downloads/${downloadId}:download \
  --header 'authorization: Bearer ${process.env.ACCESS_TOKEN}' --output ${s}_files/${name}`;


console.log(curlCommand);

exec(curlCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing cURL: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`cURL stderr: ${stderr}`);
    return;
  }
  console.log(`cURL response: ${stdout}`);
});}


// main execution
curateDownloadList().then(async () => {
  try { 
  let total_files = downloads.length;
  await fse.ensureDir(`./${s}_files`,err => {
    console.log(err)
  });
  console.log(total_files);
  for (let i = 0 ; i < total_files ; i++) {
    await downloadFiles(downloads[i].id,downloads[i].fileName);
  }} catch (e) {
    console.log(e);
  }
});


