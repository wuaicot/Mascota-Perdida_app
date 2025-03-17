// server/src/utils/storage.js
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Configuración única del cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Función para determinar el tipo MIME
const getContentType = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  const types = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp'
  };
  return types[extension] || 'application/octet-stream';
};

exports.uploadToS3 = async (filePath, fileName) => {
  try {
    const fileContent = fs.readFileSync(filePath);
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: fileContent,
      ContentType: getContentType(fileName)
    };

    await s3Client.send(new PutObjectCommand(params));
    return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    
  } catch (error) {
    console.error('Error en uploadToS3:', error);
    throw new Error('Error al subir el archivo a S3');
  }
};