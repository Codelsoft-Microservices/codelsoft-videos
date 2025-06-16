import { seedVideos } from "../seeders/videosSeeder.js";


const mainSeedingFunction = async () => {
    console.log("Iniciando proceso de siembra de datos...");

    const num = 350;
    try {
        const videos = await seedVideos(num);
        if (!videos) {
            console.log("Error al crear los videos en la base de datos local");
            return false;
        }
        console.log("Videos creados correctamente:", videos.length, " videos creados.");
    } catch (error) {
        console.error("Error detallado en la creación de videos:", error);
        return false;
    }
};

mainSeedingFunction()
    .then(() => {
        console.log("Proceso de seeding completado.");
        process.exit(0); // Finaliza el proceso
    })
    .catch((error) => {
        console.error("Error en el proceso de seeding:", error);
        process.exit(1); // Finaliza el proceso con error
    });