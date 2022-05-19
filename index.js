const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

/* middleWare */
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3zjl8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const todoCollection = client.db("Todo_db").collection("todos");

    /* post a Todo */
    app.post("/todo", async (req, res) => {
      const todo = req.body;
      const result = await todoCollection.insertOne(todo);
      res.send(result);
    });

    /* get all todo */
    app.get("/todo", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const todo = await todoCollection.find(query).toArray();
      res.send(todo);
    });

    /* delete a todo data */
    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await todoCollection.deleteOne(query);
      res.send(result);
    });

    /* update a todo data */
    app.put("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const complete = req.body;
      console.log(complete);
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: complete,
      };
      const result = await todoCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
  } finally {
    // client.close()
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
