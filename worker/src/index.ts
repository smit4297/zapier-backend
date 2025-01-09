import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const client = new PrismaClient();

const kafka = new Kafka({
  clientId: "outbox-processor", 
  brokers: ["localhost:9092"],
});

const TOPIC_NAME = "zap-events";
const main = async () => {
  const consumer = kafka.consumer({ groupId: 'test-group' }) // if you change this it willstart picking up from scratch
  //kafka will not delete data even after commiting you can replay events any time
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })

  while (1) {

    await consumer.run({
        autoCommit:false, //this is by default true but we will only commit once worker has done the task what is worker dies after consuming
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          partition,
          offset: message.offset,
          value: message?.value?.toString(),
        })

    //perform operations


    //commit offset
      await consumer.commitOffsets([{
        topic: TOPIC_NAME,
        partition: partition,
        offset: (parseInt(message.offset) + 1).toString()
      }])
    }
    })
  } 
};

main()

