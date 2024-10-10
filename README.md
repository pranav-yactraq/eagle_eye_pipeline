# Eagle Eye Pipeline


## Setting up the pipeline
Do npm -i to download relevant packages.
For any instance have a .env file with ACCESS_TOKEN, REFRESH_TOKEN , CLIENT_ID , CLIENT_SECRET



## Executing the pipeline
### The following pipeline has two parts to execute.
#### getDownloadList.js
This file is responsible for fetching us all the items that are needed to be downloaded.On successful execution it will store the metadata infile name with nomenclature todays_date_downloads.json [9_10_24_downloads.json] 

#### getFiles.js
This script is responsible for actually downloading files based on datafetched in above step. Currently its configured to read todays_date_downloads.json to fetch metadata and list of items to download , curating this list a bit and then using the data to call download APIS. The downloaded files will be stored in directory todays_date_files.json. 

Both the above are automated to large extent one just needs to execute them in order and ensure that no error has occured while execution.




## Authentication
The primary authentication token is ACCESS_TOKEN. ACCESS_TOKEN expires periodically and can be reissued using REFRESH_TOKEN. 

REFRESH_TOKEN too tend to periodically expire , but one can issue a nonrotating / non expiring token. This allows us to automate the reissuing of new ACCESS_TOKEN.


