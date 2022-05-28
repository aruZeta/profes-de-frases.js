const { MongoClient, ServerApiVersion } = require('mongodb');

const mongoConnection = () => {
    return new MongoClient(
        [ 'mongodb+srv://',
          process.env.mongoUser,
          ':',
          process.env.mongoPswd,
          '@data.0t392.mongodb.net/data',
          '?retryWrites=true&w=majority'
        ].join(""),
        { useNewUrlParser: true,
          useUnifiedTopology: true,
          serverApi: ServerApiVersion.v1
        }
    )
};

module.exports = {
    async setupDB(collections, collNames) {
        const mongo = mongoConnection();
        await mongo.connect();

        const db = mongo.db("data");
        const dbCollections = [];

        for (const collection of await db.collections()) {
            dbCollections.push(collection.collectionName);
        }

        collNames.forEach(collectionName => {
            if (!dbCollections.includes(collectionName)) {
                db.createCollection(collectionName);
            }

            collections[`${collectionName}Coll`] = db.collection(collectionName);
        })

        console.log('DB connected');
    }
}
