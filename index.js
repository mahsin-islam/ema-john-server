const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.knazp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = 5000;

app.get('/', (req, res) =>{
  res.send("Hellow from db it's working");
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, useNewUrlParser: true, keepAlive: 1 });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

  app.post('/addProduct', (req,res) => {
      const products = req.body;
      productsCollection.insertMany(products)
      .then(result =>{
          console.log(result.insertedCount);
          res.status(200).send(result.insertedCount);
      })
  })
  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: { $in: productKeys}})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addOrder', (req,res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result =>{
        res.status(200).send(result.insertedCount > 0);
    })
})
});



app.listen(process.env.PORT || port)