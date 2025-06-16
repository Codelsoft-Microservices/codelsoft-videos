import { config } from 'dotenv';
import { ServerCredentials, Server } from '@grpc/grpc-js';
import { loadProto } from './src/utils/loadProto.js';
import videoService from './src/services/videosService.js';
import { connectMongoose } from './src/database/connect.js';
import initializeQueueConsumer from './src/database/queue/index.js';

config({path: './.env'});

const server = new Server();

await connectMongoose()

const videoProto = loadProto('video');
server.addService(videoProto.VideoService.service, videoService)

initializeQueueConsumer()
    .then(() => console.log('[Queue] Consumidores iniciados correctamente'))
    .catch(error => console.error('[Queue] Error al iniciar consumidores:', error));


server.bindAsync(
    `${process.env.SERVER_URL}:${process.env.PORT}`,
    ServerCredentials.createInsecure(),
    (error, port) => {
        if (error) {
            console.error(`Error al iniciar el servidor: ${error.message}`);
            return;
        } else {
            console.log(`- Entorno:     ${process.env.NODE_ENV}`);
            console.log(`- Puerto:      ${port}`);
            console.log(`- URL:         ${process.env.SERVER_URL}:${port}`);
        }
    }
);