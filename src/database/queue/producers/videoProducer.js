import { getChannel } from "../config/connection.js";


const EXCHANGE_NAME = "video-create-queue";

const videoCretionEvent = async (createdVideo) => {
    const channel = await getChannel();
    const msgBuffer = Buffer.from(JSON.stringify(createdVideo));

    channel.publish(EXCHANGE_NAME, "", msgBuffer, {
        persistent: true,
        contentType: "application/json",
    });
};
export default videoCretionEvent;

