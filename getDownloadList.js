const axios = require('axios');
const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config({ path: "./.env" });


const date = new Date()
var s = `${date.getDate()}_${date.getMonth()+1}_${date.getYear()}`
 
//dates for expiry and create_time
let expiry_date = new Date();
expiry_date = expiry_date.toISOString().replace('Z', '+00:00')
const expireTimeStamp_gte = expiry_date;

let create_date = new Date();
create_date.setDate(create_date.getDate() - 1); // Subtract one day
create_date = create_date.toISOString().replace('Z', '+00:00');// Convert to ISO string and adjust timezone
const createTimeStamp_gte = create_date;

//type
const mimeType = 'video/mp4';


//AT EXECUTION UNCOMMENT THE DESIRED URL. FIRST URL GIVES YOU ALL THE VALID FILES THAT CAN BE DOWNLOADED TILL THAT TIMEPOINT. SECOND URL GIVES YOU ALL VALID FILES LIST CREATED AFTER THE GIVEN TIMESTAMP

// const url = `https://api.c005.eagleeyenetworks.com/api/v3.0/downloads?sort=%2BexpireTimestamp&mimeType=video%2Fmp4&expireTimestamp__gte=${encodeURIComponent(expireTimeStamp_gte)}&include=details,notes,metadata,md5,size,accountId,&pageSize=500`;

const url =  `https://api.c005.eagleeyenetworks.com/api/v3.0/downloads?sort=%2BexpireTimestamp&mimeType=video%2Fmp4&createTimestamp__gte=${encodeURIComponent(createTimeStamp_gte)}&include=details,notes,metadata,md5,size,accountId,&pageSize=500`; 


const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    authorization: `Bearer ${process.env.ACCESS_TOKEN}`
  }
};

async function fetchDownloadables ()  {
try { 
let res = await fetch(url, options)
let data = await res.json();
console.log(data);
await fs.writeFileSync(`${s}_downloads.json`,JSON.stringify(data,null,2),'utf-8')
} catch (e) {
	console.log(e);
}
console.log(expireTimeStamp_gte);
}

fetchDownloadables();
