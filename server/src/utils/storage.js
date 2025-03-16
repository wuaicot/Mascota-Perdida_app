// server/src/utils/storage.js
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { fromIni } = require('@aws-sdk/credential-provider-ini');
const path = require('path');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

exports.uploadToS3 = async (filePath, fileName) => {
  const fileContent = require('fs').readFileSync(filePath);
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
    Body: fileContent,    
    ContentType: getContentType(fileName)
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
  } catch (err) {
    console.error('Error S3 upload:', err);
    throw err;
  }
};

// ... mantener getContentType

// Función auxiliar para determinar el tipo de contenido
const getContentType = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  const types = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif'
  };
  return types[extension] || 'application/octet-stream';
};