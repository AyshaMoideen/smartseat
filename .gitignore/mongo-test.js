const { MongoClient } = require("mongodb");
require("dotenv").config();

async function test() {
    try {
        console.log("Connecting...");

        const client = new MongoClient(process.env.MONGO_URI);

        await client.connect();

        console.log("✅ Connected Successfully!");

        await client.close();
    } catch (err) {
        console.error("❌ Connection Failed");
        console.error(err);
    }
}

test();