const fs = require('fs')
const { google } = require('googleapis')

class GoogleDrive {

    /**
     * @param {string} credsPath 
     * @example new GoogleDrive('./creds.json')
     */
    constructor(credsPath) {

        this.creds = credsPath

        const auth = new google.auth.GoogleAuth({
            keyFile: this.creds,
            scopes: ['https://www.googleapis.com/auth/drive.file']
        })

        this.drive = google.drive({
            version: 'v3',
            auth
        })
    }

    /**
     * @param {string} filePath 
     * @param {string} parentFolderId
     * @returns {Promise<google.drive_v3.Schema$File>}
     */

    async uploadFile(filePath, parentFolderId) {

        const fileName = filePath.split('/').pop()
        const resource = {

            name: fileName,
            parents: [parentFolderId]
        }

        const media = {
            body: fs.createReadStream(filePath)
        }

        const response = await this.drive.files.create({
            resource,
            media,
            field: 'id',
            supportsTeamDrives: true
        })

        return response.data

    }
    /**
     * @param {string} name
     * @param {string} parentFolderId
     * @returns {Promise<google.drive_v3.Schema$File>}
     */
    async createFolder(name, parentFolderId) {

        const resource = {

            name,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentFolderId]
        }

        const response = await this.drive.files.create({
            resource,
            fields: 'id',
            supportsTeamDrives: true
        })

        return response.data


    }

    /**
     * @param {string} fileId 
     * @returns {Promise<google.drive_v3.Schema$File>}
     */

    async deleteFile(fileId) {

        const response = await this.drive.files.delete({

            fileId,
            supportsTeamDrives: true
        })

        return response
    }


    /**
     * @param {string} fileId 
     * @param {string} newName
     * @returns {Promise<google.drive_v3.Schema$File>}
     */
    async renameFile(fileId, newName) {

        const response = await this.drive.files.update({

            fileId,
            resource: {
                name: newName
            },
            supportsTeamDrives: true
        })

        return response.data
    }
}

module.exports = GoogleDrive