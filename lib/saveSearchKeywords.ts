import { db } from "@/api/firebaseConfigs";
import {
  doc,
  increment,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

export async function saveSearchKeywords(text: string) {
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .map(w => w.replace(/[^a-z0-9]/g, ""))
    .filter(w => w.length > 2); // remove noise

  const uniqueWords = Array.from(new Set(words));

  await Promise.all(
    uniqueWords.map(async (word) => {
      const ref = doc(db, "search_keywords", word);
      await setDoc(
        ref,
        {
          keyword: word,
          count: increment(1),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    })
  );
}
