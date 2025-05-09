import { Storage } from '@google-cloud/storage';
import { format } from 'util';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

config(); // carga las variables de entorno (Archivo .env)

const storage = new Storage({
  projectId: process.env.FIREBASE_PROJECT_ID,
  keyFilename: process.env.FIREBASE_KEY_FILENAME, //Cuidar esta URL (credenciales para acceder a FirebaseServices)
});

const bucketName = process.env.FIREBASE_BUCKET_NAME!;
const bucket = storage.bucket(bucketName);

export default async function cloud_storage(
  file: Express.Multer.File,
  pathImage: string,
) {
  let url = '';
  try {
    if (!pathImage) {
      throw new Error('No path image provided');
    }

    const uuid = uuidv4(); // Genera el UUID
    const fileUpload = bucket.file(pathImage);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: '.(png|jpg|jpeg)',
        metadata: {
          firebaseStorageDownloadTokens: uuid,
        },
      },
      resumable: false,
    });

    // Usamos promesas para esperar la finalización de la carga
    await new Promise((resolve, reject) => {
      blobStream.on('error', (error) => {
        reject(
          new Error('Error al subir archivo a Firebase: ' + error.message),
        );
      });

      blobStream.on('finish', () => {
        resolve('Carga completa de archivo');
      });

      blobStream.end(file.buffer);
    });

    // Una vez cargado el archivo, generamos la URL
    url = format(
      `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media&token=${uuid}`,
    );
  } catch (error) {
    console.error(error);
    url = '';
  }
  return url; // Devolvemos el objeto con la URL
}
