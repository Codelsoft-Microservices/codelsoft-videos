import startVideoLikeConsumer from './consumers/likesConsumer.js';

const initializeQueueConsumer = async () => {
    await startVideoLikeConsumer();
    console.log('[Queue] Consumidores iniciados correctamente');
}

export default initializeQueueConsumer