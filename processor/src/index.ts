import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const client = new PrismaClient();

const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:9092"],
});

const TOPIC_NAME = "zap-events";
const main = async () => {
  const producer = kafka.producer();
  await producer.connect();

  while (1) {
    const pendingRows = await client.zapRunOutbox.findMany({
      where: {},
      take: 10,
    });

    await producer.send({
      topic: TOPIC_NAME,
      messages: pendingRows.map((r) => {
        return { value: r.zapRunId}
      }),
    });

    await client.zapRunOutbox.deleteMany({
        where:{
            id: {
                in : pendingRows.map(r =>  r.id)
            }
        }
    })
  } 
};

main()
