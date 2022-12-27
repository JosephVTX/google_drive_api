
const gDrive = require('./libs/gdrive.libs')

const drive = new gDrive('./creds.json')

drive.uploadFile("./your_file.jpg", "YOUR_FOLDER_ID").then(res => {

    console.log(res);
})


