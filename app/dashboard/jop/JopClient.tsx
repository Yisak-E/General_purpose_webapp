'use client';


import { useJobContext } from '@/context/JobContext';
import { useState } from 'react';
import FirebaseWordCloud from "@/components/FirebaseWordCloud";
import JopForm from './JobForm';
import JobCardView from '@/ui/JobCardView';

export default function JopClient() {
  const { jobLists } = useJobContext();
  const [index, setIndex] = useState(0);

  return (
    <div className="p-4 mt-0 bg-gray-800 text-white rounded-lg shadow h-min-screen w-full ">
      <article className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">

        {/* 🔍 SEARCH SECTION */}
        <section className="md:col-span-1 bg-gray-700 p-4 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Search The job here
          </h2>
          <JopForm />



          <div className="mt-6 p-4 bg-gray-600 rounded-lg">
                <h2 className="text-center mb-2">Search Keywords</h2>
                <FirebaseWordCloud />
            </div>

        </section>

        {/* 📄 JOB LIST SECTION */}
        <section>
          <h2 className="text-2xl font-bold mb-4">job Listings</h2>

          <div className="space-y-4  md:max-h-[880px] p-2 border rounded-lg bg-gray-700">
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
