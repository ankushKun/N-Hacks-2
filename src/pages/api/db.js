import { Client } from "pg";

export default function handler(req, res) {
    res.status(200).json({ name: 'John Doe' })
    return;
    const client = new Client("postgresql://nhack2-proj:oRxV_RUsyNPJQ3e0ym-GJQ@free-tier6.gcp-asia-southeast1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&options=--cluster%3Dcock-roach-db-3538");
    client.connect()
    const t = Date.now();
    console.log(t);
    // client.query("CREATE TABLE hashes (time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, phash VARCHAR(256))");
    client.query(`INSERT INTO hashes ('${t}', 'adadasdadada')`)
    console.log("DONE");
}