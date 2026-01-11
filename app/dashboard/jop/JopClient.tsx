'use client';

import { saveSearchKeywords } from "@/lib/saveSearchKeywords";
import { usejobContext } from '@/context/JobContext';
import { JobSearchType } from '@/type/jobSearchType';
import { useState, FormEvent } from 'react';
import FirebaseWordCloud from "@/components/FirebaseWordCloud";
import Link from "next/link";

export default function jobClient() {
    const [error, setError] = useState<Error | string>('');
    const { jobLists, searchjob } = usejobContext();
    const [index, setIndex] = useState(0);

    const [searchParams, setSearchParams] = useState<JobSearchType>({
        name: '',
        location: '',
        country: '',
        skill: '',
    });

    const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
        const combinedText = `${searchParams.name} ${searchParams.skill} ${searchParams.location}`;

        await saveSearchKeywords(combinedText);
        await searchjob(searchParams);

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
            Search The job here
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
              Search job
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-600 rounded-lg">
                <h2 className="text-center mb-2">Search Keywords</h2>
                <FirebaseWordCloud />
            </div>

        </section>

        {/* 📄 JOB LIST SECTION */}
        <section>
          <h2 className="text-2xl font-bold mb-4">job Listings</h2>

          <div className="space-y-4  overflow-y-scroll md:max-h-[880px] p-2 border rounded-lg bg-gray-700">
            <p className="flex-inline">{index + 1}/{jobLists.length}   
                 <span className="float-right">
                <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-700"
                    onClick={() => setIndex((prev) => Math.max(prev - 1, 0))}
                > Previous </button>
                <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                    onClick={() => setIndex((prev) => Math.min(prev + 1, jobLists.length - 1))}
                > Next </button>
                 </span>
            </p>
            {
                jobLists.length > 0 ? (
                    <JobCardView job={jobLists[index]} />
                ) : (
                    <p>No job listings found. Please perform a search.</p>
                )
            }
          </div>
        </section>

      </article>
    </div>
  );
}

interface JobCardViewProps {
  job: any;
}

const JobCardView = ({ job }: JobCardViewProps)=>{
    
    return (
        <div
                className="p-4 border border-gray-300 rounded-lg bg-white text-black"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {job.job_title}
                </h3>

                <p className="mb-1">
                  <strong>Employer:</strong>{' '}
                  {job.employer_name ?? 'N/A'}
                </p>

                <p className="mb-1">
                  <strong>Location:</strong>{' '}
                  {job.job_city ?? 'N/A'}, {job.job_state ?? 'N/A'}
                </p>

                <p className="mb-1">
                  <strong>Posted At:</strong>{' '}
                  {job.job_posted_at_datetime_utc ?? 'N/A'}
                </p>
                <p>
                    <strong>Employment Type:</strong>{' '}
                    {job.job_employment_type ?? 'N/A'}
                </p>

                <p>
                    <strong>Description</strong>
                    : {job.job_description ?? 'N/A'}
                </p>



                <Link
                  href={job.job_apply_link ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Apply Here
                </Link>
              </div>
    );
}