'use client';

import { FormEvent, useState } from "react";
import { JobSearchType } from "@/type/jobSearchType";
import { useJobContext } from "@/context/JobContext";
import { saveSearchKeywords } from "@/lib/saveSearchKeywords";

export default function JopForm() {
  const [error, setError] = useState<Error | string>("");
  const { searchjob } = useJobContext();
    

    const [searchParams, setSearchParams] = useState<JobSearchType>({
        name: '',
        location: '',
        country: '',
        skill: '',
    });

    const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
        const combinedText = `${searchParams.name} ${searchParams.skill} ${searchParams.location}`;

        await saveSearchKeywords(combinedText);
        await searchjob(searchParams);

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Search failed");
        }
    }
    };


    return (
                  <form
            className="space-y-4 max-w-md mx-auto border p-4 rounded-lg"
            onSubmit={handleSearch}
          >
            {/* Keyword */}
            <div>
              <label className="block mb-2">Keyword:</label>
              <input
                required
                type="text"
                className="w-full p-2 rounded bg-gray-600 text-white"
                placeholder="e.g., Software Engineer"
                value={searchParams.name}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, name: e.target.value })
                }
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block mb-2">Skills:</label>
              <input
                required
                type="text"
                className="w-full p-2 rounded bg-gray-600 text-white"
                placeholder="e.g., JavaScript, React"
                value={searchParams.skill}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, skill: e.target.value })
                }
              />
            </div>

            {/* Location */}
            <div>
              <label className="block mb-2">Location:</label>
              <input
                required
                type="text"
                className="w-full p-2 rounded bg-gray-600 text-white"
                placeholder="e.g., New York"
                value={searchParams.location}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    location: e.target.value,
                  })
                }
              />
            </div>

            {/* Country */}
            <div>
              <label className="block mb-2">Country:</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-600 text-white"
                placeholder="e.g., US"
                value={searchParams.country}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    country: e.target.value,
                  })
                }
              />
            </div>

            <button
              type="submit"
              className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-600 hover:text-black hover:cursor-pointer"
            >
              Search job
            </button>
            {error && (
              <p className="mt-2 text-sm text-red-400">
                {typeof error === "string" ? error : error.message}
              </p>
            )}
          </form>
    );
}