require('dotenv').config();
const path = require('path');
const fse = require('fs-extra')
const fs = require('fs');
const fetch = require('node-fetch');
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
  // console.log(downloads);
}


const directory = `${s}_files`;

async function downloadFiles(id,name) {
    const url = `https://api.c005.eagleeyenetworks.com/api/v3.0/downloads/${id}:download`;

    const options = {
      method: 'GET',
      headers: {
      authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }};
   try {
    const res = await fetch(url, options);

    if (!res.ok) {
      console.log(`Failed to download file ${name}. Status code: ${res.status}`);
      return;
    }

    // Extract filename from 'content-disposition' header
    const contentDisposition = res.headers.get('content-disposition');
    let filename = name; // Default to provided name if filename not found

    if (contentDisposition) {
      const matches = contentDisposition.match(/filename\*?=['"]?UTF-8['"]?(.*)/);
      if (matches && matches[1]) {
        filename = decodeURIComponent(matches[1]); // Decode and use the filename from the header
      }
    }

    console.log(`File ${filename} starting...`);

    // Ensure the directory exists
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    // Create a writable stream to save the file
    const fileStream = fs.createWriteStream(`${directory}/${filename}`);

    // Pipe the response stream to the file stream
    res.body.pipe(fileStream);

    fileStream.on('finish', () => {
      console.log(`File downloaded successfully: ${directory}/${filename}`);
    });

    fileStream.on('error', (err) => {
      console.error(`Error writing file: ${err.message}`);
    });

  } catch (e) {
    console.error(`Error downloading file ${name}:`, e.message);
  }
  //  try {
  //   const res = await fetch(url, options);
  //
  //   // Ensure the response is valid and the status code is 2xx
  //   if (!res.ok) {
  //     console.log(`Failed to download file ${name}. Status code: ${res.status}`);
  //     return;
  //   }
  //
  //   console.log('file', name, 'starting....');
  //   console.log('Response Headers:', res.headers.raw());
  //
  //   // Create a writable stream for the file
  //   const fileStream = fs.createWriteStream(`${s}_files/${name}`);
  //
  //   // Pipe the response body (which is a readable stream) into the writable file stream
  //   res.body.pipe(fileStream);
  //
  //   console.log('file', name, 'piping stream....');
  //
  //   // Handle stream events
  //   fileStream.on('finish', () => {
  //     console.log(`File downloaded successfully: ${s}_files/${name}`);
  //   });
  //
  //   fileStream.on('error', (err) => {
  //     console.error(`Error writing file: ${err.message}`);
  //   });
  //
  //   // Closing file stream properly when done
  //   fileStream.on('close', () => {
  //     console.log(`File stream closed for ${name}`);
  //   });
  // } catch (e) {
  //   console.error(`Error downloading file ${name}:`, e.message);
  // }

 //
 // try {
 //  const res = await fetch(url,options);
 //  if(!res) {console.log('no response for id',id)}
 //  console.log('file',name,'starting....');
 //  console.log(await res );
 //  console.log(res.headers.raw());
 //  const fileStream = fs.createWriteStream(`${s}_files/${name}`);
 //  res.body.pipe(fileStream);
 //  console.log('file',name,'piping stream....');
 //  fileStream.on('finish', () => {
 //      console.log(`File downloaded successfully: ${s}_files/${name}`);
 //  });
 //
 //  fileStream.on('error', (err) => {
 //      console.error(`Error writing file: ${err.message}`);
 //    });
 //  } catch (e) {console.log(e)}
}


//function to execute download curl command
// async function downloadFiles (id,name) {
// let downloadId = id;
// const url = `https://api.c005.eagleeyenetworks.com/api/v3.0/downloads/${downloadId}:download`;
//
// const options = {
//   method: 'GET',
//   headers: {
//     authorization: `Bearer ${process.env.ACCESS_TOKEN}`
//   }
// };
//
//
// const curlCommand = `curl --request GET \
//   --url https://api.c005.eagleeyenetworks.com/api/v3.0/downloads/${downloadId}:download \
//   --header 'authorization: Bearer ${process.env.ACCESS_TOKEN}' --output ${s}_files/${name}`;
//
//
// console.log(curlCommand);
//
// exec(curlCommand, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error executing cURL: ${error.message}`);
//     return;
//   }
//   if (stderr) {
//     console.error(`cURL stderr: ${stderr}`);
//     return;
//   }
//   console.log(`cURL response: ${stdout}`);
// });}
//

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


