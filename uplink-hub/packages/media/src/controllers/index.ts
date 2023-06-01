import busboy from 'busboy';
import dotenv from 'dotenv';
import FormData from 'form-data';
import axios from 'axios';
import { validationResult } from 'express-validator';
import crypto, { randomUUID } from 'crypto';
import { AuthorizationController } from 'lib';
const logger = console
dotenv.config();


const authController = new AuthorizationController(process.env.REDIS_URL);


export const preUpload = async (req, res) => {

    const { filesize } = req.query;



    // 1. authenticate the user
    // 2. generate an upload ID
    // 3. save the upload ID and file size in the database


    // 1. authenticate the user

    const user = await authController.getUser({ token: req.token });
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    // 2. generate an upload ID
    const uploadId = randomUUID().slice(0, 8);
    res.send({ uploadId, filesize }).status(200)


}

export const upload = async (req, res) => {
    // 1. Extract the upload ID from the request
    const { filesize } = req.query;

    // 2. Retrieve the file size from the database using the upload ID
    // If the upload ID is not in the database, send a 400 Bad Request response
    // If there's an error, send a 500 Internal Server Error response
    // 3. Initialize the uploaded bytes counter
    let uploadedBytes = 0;

    const bb = busboy({ headers: req.headers });

    bb.on('file', async (name, file, info) => {
        const { filename, encoding, mimeType } = info;
        console.log(`File [${name}]: filename: %j, encoding: %j, mimeType: %j`, filename, encoding, mimeType);

        const formData = new FormData();
        formData.append('file', file, { filename, contentType: mimeType });

        // Listen for data events on the file stream to update the uploaded bytes counter
        file.on('data', (data) => {
            uploadedBytes += data.length;
            // Update the upload progress in the database
        });

        try {
            const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                headers: {
                    'Authorization': `Bearer ${process.env.PINATA_JWT}`,
                    ...formData.getHeaders()
                },
                onUploadProgress: (progressEvent) => {
                    // Calculate the upload progress based on the uploaded bytes and total file size
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / filesize);
                    console.log('Upload progress:', percentCompleted);

                    // Update the upload progress in the database
                }
            });

            console.log(`File [${filename}] done`);
            console.log(response.data);
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    req.pipe(bb);
};
