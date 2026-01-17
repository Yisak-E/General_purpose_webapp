'use client';

import { db } from "@/api/firebaseConfigs";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";

interface KeywordDoc {
  keyword: string;
  count: number;
}

export default function FirebaseWordCloud() {
  const [keywords, setKeywords] = useState<KeywordDoc[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "search_keywords"),
      orderBy("count", "desc")
    );

    return onSnapshot(q, (snap) => {
      setKeywords(
        snap.docs.map((doc) => doc.data() as KeywordDoc)
      );
    });
  }, []);

  const maxCount = Math.max(...keywords.map(k => k.count), 1);

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center p-4 bg-gray-900 rounded-lg shadow h-[300px] ">
      {keywords.map(({ keyword, count }) => {
        const size = 12 + (count / maxCount) * 28;

        return (
          <span
            key={keyword}
            style={{ fontSize: `${size}px`,
            rotate: `${(size) % 180}deg` 
          
          }}
            className="text-blue-400 hover:text-green-400 transition cursor-pointer"
          >
            {keyword}
          </span>
        );
      })}
    </div>
  );
}
