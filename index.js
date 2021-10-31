const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// DB Connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.weui7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db('tourManagement');
        const tourCollection = database.collection('tourCollection');
        const bookingCollection = database.collection('bookingCollection');

        // GET all tour API
        app.get('/allTour', async (req, res) => {
            const result = await tourCollection.find({}).toArray();
            res.send(result);
        });
        // GET single tour API
        app.get('/allTour/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tourCollection.findOne(query);
            res.send(result);
        });

        // GET all booking API
        app.get('/booking', async (req, res) => {
            const result = await bookingCollection.find({}).toArray();
            res.send(result);
        });

        // GET booking by email API
        app.get('/booking/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email }
            const result = await bookingCollection.find(query).toArray()
            res.send(result);
        })

        // POST add new tour API
        app.post('/allTour', async (req, res) => {
            const data = req.body;
            const result = await tourCollection.insertOne(data);
            res.json(result);
        })
        // POST booking API
        app.post('/booking', async (req, res) => {
            const data = req.body;
            const result = await bookingCollection.insertOne(data);
            res.json(result);
        });

        // UPDATE booking status API
        app.put('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    tourStatus: updateStatus.tourStatus
                },
            };
            const result = await bookingCollection.updateOne(filter, updateDoc, options);
            res.json(result);

        });

        // DELETE booking API

        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result)
        });



    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello I am Okay!');
});

app.listen(port, () => {
    console.log('Starting Port: ', port);
});