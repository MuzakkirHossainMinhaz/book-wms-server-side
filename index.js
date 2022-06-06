const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_secret}@cluster0.t91hx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const bookCollection = client.db('BookStore').collection('books');

        app.get('/books', async (req, res) => {
            const query = {};
            const cursor = bookCollection.find(query);
            const books = await cursor.toArray();
            res.send(books);
        })

        app.get('/book/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const book = await bookCollection.findOne(query);
            res.send(book);
        })

        app.post('/books', async (req, res) => {
            const newBook = req.body;
            const result = await bookCollection.insertOne(newBook);
            res.send(result);
        })

        app.put('/book/:id', async (req, res) => {
            const id = req.params.id;
            const updatedValue = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updateDoc = {
                $set: {
                    quantity: updatedValue.quantity,
                    sold: updatedValue.sold
                }
            };
            const result = await bookCollection. updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.delete('/book/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await bookCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Book Store');
})

app.listen(port, () => {
    console.log("Listening to port", port);
})