import { Video } from "../database/models/videoModel.js";
import { status } from "@grpc/grpc-js";
import  catchAsync from "../utils/catchAsync.js";

/*Metodo de prueba*/
const VideoCheck = catchAsync(async (call, callback) => {
    return callback(null, {
        message: "El servicio de videos está funcionando",
    });
});

const UploadVideo = catchAsync(async (call, callback) => {
    const { title, description, genre } = call.request;
    // Verifica si se han proporcionado todos los datos necesarios
    if (!title || !description || !genre) {
        return callback({
            code: status.INVALID_ARGUMENT,
            message: "Faltan datos necesarios para crear el video",
        });
    }
    const newVideo = await Video.create({
            title,
            description,
            genre
    });

    await videoCretionEvent({
        uuid: newVideo.uuid,
        title: newVideo.title,
        description: newVideo.description,
        likes: newVideo.likes,
    });

    return callback(null, { 
        message: "Video creado", 
        video: {
            uuid: newVideo.uuid,
            title: newVideo.title,
            description: newVideo.description,
            genre: newVideo.genre,
            likes: newVideo.likes,
            deleted: newVideo.deleted
        }
    });
});

const GetVideoByID = catchAsync(async (call, callback) => {
    const { uuid } = call.request;
    const video = await Video.findOne({ uuid });
    if (!video || video.deleted) {
        return callback({
            code: status.NOT_FOUND,
            message: "Video no encontrado o eliminado",
        });
    }
    return callback(null, {
        message: "Video encontrado",
        video: {
            uuid: video.uuid,
            title: video.title,
            description: video.description,
            genre: video.genre,
            likes: video.likes,
            deleted: video.deleted
        }
    });
});

const UpdateVideo = catchAsync(async (call, callback) => {
    const { uuid, title, description, genre } = call.request;
    // Verifica si se ingresó el ID de la factura
    if (!uuid) {
        return callback({
            code: status.INVALID_ARGUMENT,
            message: "Falta el UUID del video",
        });
    }
    // Verifica si se han proporcionado todos los datos necesarios
    if (!title || !description || !genre) {
        return callback({
            code: status.INVALID_ARGUMENT,
            message: "Faltan datos necesarios para actualizar el video",
        });
    }
    const video = await Video.findOneAndUpdate (
        { uuid },
        {
          title,
          description,
          genre,
        },
        { new: true }
      );
    if (!video || video.deleted) {
        return callback({
            code: status.NOT_FOUND,
            message: "Video no encontrado o eliminado",
        });
    }
    return callback(null, {
        message: "Video actualizado",
        video: {
            uuid: video.uuid,
            title: video.title,
            description: video.description,
            genre: video.genre,
            likes: video.likes,
            deleted: video.deleted
        }
    });
});

const DeleteVideo = catchAsync(async (call, callback) => {
    const { uuid } = call.request;
    // Verifica si se ingresó el ID de la factura
    if (!uuid) {
        return callback({
            code: status.INVALID_ARGUMENT,
            message: "Falta el ID del video",
        });
    }

    const video = await Video.findOne({ uuid });
    if (!video || video.deleted) {
        return callback({
            code: status.NOT_FOUND,
            message: "Video no encontrado o ya eliminado",
        });
    }
    
    await Video.findOneAndUpdate (
        { uuid },
        { deleted: true },
    );
    return callback(null, {});
});

const ListVideos = catchAsync(async (call, callback) => {
    
    const { title, genre } = call.request;
    
    // Construir el filtro de búsqueda
    const filter = { deleted: false };
    
    if (title) {
        filter.title = { $regex: title, $options: 'i' };
    }
    
    if (genre) {
        filter.genre = { $regex: genre, $options: 'i' };
    }
    
    const videos = await Video.find(filter);

    if (videos.length === 0) {
        return callback({
            code: status.NOT_FOUND,
            message: "No se encontraron videos",
        });
    }

    return callback(null, {
        message: "Videos encontrados",
        videos: videos.map(v => ({
            uuid: v.uuid,
            title: v.title,
            description: v.description,
            likes: v.likes,
            genre: v.genre,
            deleted: v.deleted,
        }))
    });

});

/*Exporte de todos los metodos correspondientes al controlador para ser usados en nuestro Router.*/
export default{ 
    UploadVideo, 
    GetVideoByID, 
    UpdateVideo,
    DeleteVideo,
    ListVideos, 
    VideoCheck
};