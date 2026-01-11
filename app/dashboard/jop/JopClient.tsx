'use client';

import { useJopContext } from '@/context/JopContext';
import { JopSearchType } from '@/type/jopSearchType';
import { useState } from 'react';

interface JopClientProps {
  // Define any props if needed
}

export default function JopClient() {
  const [error, setError] = useState<Error | string>('');
  const { updateJop, deleteJop, jopLists, searchJop } = useJopContext();

  const [searchParams, setSearchParams] = useState<JopSearchType>({
    name: '',
    location: '',
    country: '',
    skill: '',
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await searchJop(searchParams);
    } catch (err: any) {
      setError(err instanceof Error ? err : 'Search failed');
    }
  };

  if (error) {
    return (
      <div className="p-4 mt-20 bg-red-500 text-white rounded">
        Error: {typeof error === 'string' ? error : error.message}
      </div>
    );
  }

  return (
    <div className="p-4 mt-20 bg-gray-800 text-white rounded-lg shadow h-screen w-full">
      <article className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">

        {/* 🔍 SEARCH SECTION */}
        <section className="md:col-span-1 bg-gray-700 p-4 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Search The Jop here
          </h2>

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
              Search Jop
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-600 rounded-lg">
            <h2 className="text-center">search history</h2>
          </div>
        </section>

        {/* 📄 JOB LIST SECTION */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Jop Listings</h2>

          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {jopLists.map((jop) => (
              <div
                key={jop.job_id}
                className="p-4 border border-gray-300 rounded-lg bg-white text-black"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {jop.job_title}
                </h3>

                <p className="mb-1">
                  <strong>Employer:</strong>{' '}
                  {jop.employer_name ?? 'N/A'}
                </p>

                <p className="mb-1">
                  <strong>Location:</strong>{' '}
                  {jop.job_city ?? 'N/A'}, {jop.job_state ?? 'N/A'}
                </p>

                <p className="mb-1">
                  <strong>Posted At:</strong>{' '}
                  {jop.job_posted_at_datetime_utc ?? 'N/A'}
                </p>

                <a
                  href={jop.job_apply_link ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Apply Here
                </a>
              </div>
            ))}
          </div>
        </section>

      </article>
    </div>
  );
}
