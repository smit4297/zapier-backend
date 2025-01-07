import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const client = new PrismaClient()

app.use(express.json());
app.use(cors());

// https://hooks.zapier.com/hooks/catch/21210103/2zbdv3y/

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const userId = req.params.userId;
  const zapId = req.params.zapId;
  const body = req.body

  //TODO - password logic

  // store it in a DB
await client.$transaction( async tx => {
    const run = await client.zapRun.create({
        data : {
            zapId : zapId,
            metaData : body
        }
    })

    const runOutBox = await client.zapRunOutbox.create({
        data : {
            zapRunId : run.id
        }
    })


})

res.json({msg: "webhook received"})


  // push it in a queue (redis/kafka)
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
