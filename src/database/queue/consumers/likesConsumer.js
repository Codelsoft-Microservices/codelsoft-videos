import { getChannel } from '../config/connection.js';
import { Video } from '../../../database/models/video/videoModel.js';

const VIDEO_LIKE_QUEUE = 'video-liked-queue';

export const startVideoLikeConsumer = async () => {
  const channel = await getChannel();

  await channel.assertQueue(VIDEO_LIKE_QUEUE, { durable: true });

  console.log(`[VideoConsumer] Esperando mensajes en ${VIDEO_LIKE_QUEUE}...`);

  channel.consume(VIDEO_LIKE_QUEUE, async (msg) => {
    if (!msg) return;

    const content = JSON.parse(msg.content.toString());
    const { uuid } = content;

    try {
      const video = await Video.findOneAndUpdate(
        { uuid },
        { $inc: { likes: 1 } },
        { new: true }
      );

      if (video) {
        console.log(`[VideoConsumer] Like agregado al video ${uuid}. Total: ${video.likes}`);
      } else {
        console.warn(`[VideoConsumer] Video con UUID ${uuid} no encontrado.`);
      }

      channel.ack(msg);
    } catch (error) {
      console.error('[VideoConsumer] Error al procesar mensaje:', error);
    }
  });
};
