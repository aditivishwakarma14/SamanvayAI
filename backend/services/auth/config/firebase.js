import { initializeApp, getApps, cert } from "firebase-admin/app";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const loadServiceAccount = () => {
  let sa;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
    sa = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, "base64").toString("utf8")
    );
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    const file = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "../serviceAccountKey.json"
    );
    sa = JSON.parse(fs.readFileSync(file, "utf8"));
  }

  if (sa.private_key) sa.private_key = sa.private_key.replace(/\\n/g, "\n");
  return sa;
};

export const app = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: cert(loadServiceAccount()) });