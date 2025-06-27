import { MongoClient } from "mongodb";
import { EJSON } from "bson";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
  const secret = req.query.secret;
  if (secret !== process.env.BACKUP_SECRET) {
    return res.status(403).json({ success: false, error: "Unauthorized" });
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collections = await db.collections();

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const prefix = `backup-${timestamp}`;

    const s3 = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });

    for (const collection of collections) {
      const name = collection.collectionName;
      const docs = await collection.find().toArray();
      const serialized = EJSON.stringify(EJSON.serialize(docs), null, 2);

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${prefix}/${name}.json`,
        Body: serialized,
        ContentType: "application/json",
      });

      await s3.send(command);
    }

    await client.close();
    res
      .status(200)
      .json({ success: true, message: "Backup uploaded to S3", prefix });
  } catch (err) {
    console.error("❌ Backup to S3 failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
