const express = require('express');
const { MongoClient } = require("mongodb");
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
var cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cexwu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
      await client.connect();
      console.log("database connected successfully");
      const database = client.db('volunteerdb');

/* services collection */
      const serviceCollection = database.collection('services'); 

/* volunteer collection */
      const volunteersCollection = database.collection('volunteers'); 

/* events collection */
      const eventsCollection = database.collection('events'); 

    // get services api //
    app.get('/services', async (req, res) => {
        const cursor = serviceCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
    })





    //post volunteer Register data api //
    app.post('/volunteers', async(req, res) =>{
      const volunteer = req.body;

      const result = await volunteersCollection.insertOne(volunteer);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result)
    })
    // get volunteers api //
    app.get('/volunteers', async (req, res) => {
        const cursor = volunteersCollection.find({});
        const volunteers = await cursor.toArray();
        res.send(volunteers);
    })





    /* post events data to the server */
    app.post('/events', async(req, res) =>{
        const event = req.body;
    
        const result = await eventsCollection.insertOne(event);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        res.json(result)
    })
    // get events data //
    app.get('/events', async (req, res) => {
        const cursor = eventsCollection.find({});
        const events = await cursor.toArray();
        res.send(events);
    })

    /* ::::::::::::::::::::::::::::::::::::::::::::
            delete event data from server
    ::::::::::::::::::::::::::::::::::::::::::::::*/
    app.delete('/events/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const events = await eventsCollection.deleteOne(query);
        res.json(events);
    });






    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Server is running!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})