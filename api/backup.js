import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { EJSON } from "bson";

dotenv.config();

async function backup() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db(process.env.DB_NAME);
    const collections = await db.collections();

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFolder = path.join(process.cwd(), "backups", `backup-${timestamp}`);
    if (!fs.existsSync(backupFolder)) {
      fs.mkdirSync(backupFolder, { recursive: true });
    }

    for (const collection of collections) {
      const name = collection.collectionName;
      const docs = await collection.find().toArray();

      const serialized = EJSON.stringify(EJSON.serialize(docs), null, 2);
      const filePath = path.join(backupFolder, `${name}.json`);
      fs.writeFileSync(filePath, serialized);
      console.log(`✅ Saved ${name}.json`);
    }

    await client.close();

    console.log("🎉 Backup completed to folder:", backupFolder);
  } catch (err) {
    console.error("❌ Backup error:", err.message);
  }
}

backup();
