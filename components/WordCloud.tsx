'use client';

interface WordCloudProps {
  words: string[];
}

export default function WordCloud({ words }: WordCloudProps) {
  const frequency: Record<string, number> = {};

  words.forEach((word) => {
    const clean = word.toLowerCase();
    frequency[clean] = (frequency[clean] || 0) + 1;
  });

  const max = Math.max(...Object.values(frequency), 1);

  return (
    <div className="flex flex-wrap gap-2 p-4 justify-center">
      {Object.entries(frequency).map(([word, count]) => {
        const size =
          12 + (count / max) * 24; // scale font size

        return (
          <span
            key={word}
            style={{ fontSize: `${size}px` }}
            className="text-blue-400 hover:text-green-400 cursor-pointer transition"
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}
