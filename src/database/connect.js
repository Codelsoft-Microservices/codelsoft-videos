import { connect } from "mongoose";
import { config } from "dotenv";

config({path: './.env'});

const connectMongoose = async () => {
    const DB = process.env.DATABASE_URL
    .replace("<PASSWORD>",process.env.DATABASE_PASSWORD)
    .replace("<USER>", process.env.DATABASE_USER);

    connect(DB).then(() => console.log("✓ Conexión a base de datos exitosa"));
}

export{
    connectMongoose
} 