const MongoClient = require('mongodb').MongoClient;
const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()




const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tobhk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("services").collection("events");
    const reviewCollection = client.db("services").collection("reviews");
    const adminCollection = client.db("services").collection("admins");
    const orderDataCollection = client.db("services").collection("orderData");
    console.log('database connected succ')



    app.get('/service', (req, res) => {
        serviceCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.post('/addService', (req, res) => {
        const newService = req.body;
        console.log('adding new service', newService)
        serviceCollection.insertOne(newService)
            .then(result => {
                console.log('inserting data', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/review', (req, res) => {
        reviewCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.post('/addReview', (req, res) => {
        const newService = req.body;
        console.log('adding new service', newService)
        reviewCollection.insertOne(newService)
            .then(result => {
                console.log('inserting data', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })


    app.get('/admin', (req, res) => {
        adminCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.post('/addAdmin', (req, res) => {
        const newService = req.body;
        console.log('adding new service', newService)
        adminCollection.insertOne(newService)
            .then(result => {
                console.log('inserting data', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        console.log(email)
        adminCollection.find({ admin: email })
            .toArray((err, items) => {
                res.send(items.length > 0);
            })
    })


    // orderData


    app.get('/orderData', (req, res) => {
        console.log(req.query.email)

        adminCollection.find({ admin: req.query.email })
            .toArray((error, admin) => {
                if (admin.length > 0) {
                    orderDataCollection.find({})
                        .toArray((err, items) => {
                            res.send(items)
                        })
                } else {
                    orderDataCollection.find({ userEmail: req.query.email })
                        .toArray((err, items) => {
                            res.send(items)
                        })
                }
            })





    })
    app.post('/orderData', (req, res) => {
        const newService = req.body;
        console.log('adding new service', newService)
        orderDataCollection.insertOne(newService)
            .then(result => {
                console.log('inserting data', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })




});

app.get('/', (req, res) => {
    res.send('Hello World!')
})




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
