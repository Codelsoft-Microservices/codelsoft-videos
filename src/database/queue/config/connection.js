import amqplib from 'amqplib';

let channel;

const QUEUE_NAME = "video-liked-queue";

async function connectToRabbitMQ() {
  try {
    const RABBITMQ = process.env.RABBITMQ_URL 
      .replace("<PASSWORD>",process.env.RABBITMQ_PASSWORD)
      .replace("<USER>", process.env.RABBITMQ_USER);
    const connection = await amqplib.connect(RABBITMQ);
    channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    return channel;
  } catch (err) {
    console.error("Error connecting to RabbitMQ:", err.message);
    process.exit(1);
  }
}

async function getChannel() {
  if (!channel) {
    channel = await connectToRabbitMQ();
  }
  return channel;
}

export { connectToRabbitMQ, getChannel };
