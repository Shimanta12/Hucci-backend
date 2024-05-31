const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from server!");
});

const uri =
  "mongodb+srv://Shimanto:md1bHIvFknwsrkUh@cluster0.fhjxu7c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const strideDB = client.db("hucciDB");
    const shoes = strideDB.collection("shoes");

    app.get("/shoes", async (req, res) => {
      const result = await shoes.find();
      res.send(await result.toArray());
    });

    app.get("/shoes/:id", async (req, res) => {
      const id = req.params.id;
      const result = await shoes.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.post("/shoes", async (req, res) => {
      const shoe = req.body;
      const result = await shoes.insertOne(shoe);
      res.send(result);
    });

    app.patch("/shoes/:id", async (req, res) => {
      const id = req.params.id;
      const shoe = req.body;
      const result = shoes.updateOne({ _id: new ObjectId(id) }, { $set: shoe });
      res.send(result);
    });

    app.delete("/shoes/:id", async (req, res) => {
      const id = req.params.id;
      const result = shoes.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
