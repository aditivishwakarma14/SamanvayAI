import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const loadServiceAccount = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
    return JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, "base64").toString("utf8")
    );
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  const file = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../serviceAccountKey.json"
  );
  return JSON.parse(fs.readFileSync(file, "utf8"));
};

export const app = admin.initializeApp({
  credential: admin.credential.cert(loadServiceAccount())
});