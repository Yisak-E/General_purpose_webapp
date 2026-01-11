'use client';
import { useJopContext } from '@/context/JopContext';
import { JopSearchType } from '@/type/jopSearchType';
import {useState } from 'react';

interface JopClientProps {
    // Define any props if needed
}


export default function JopClient() {
    const [error, setError] = useState<Error | string>("");
    const {updateJop, deleteJop, jopLists, searchJop} = useJopContext();
    const [searchParams, setSearchParams] = useState<JopSearchType>({ name: '', location: '', country: '', skill: '' });


    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await searchJop({ name: 'developer', location: 'New York' , country: 'US', skill: 'JavaScript' });
        }
        catch (err: any) {
            setError(err);
        }
    };

    if (error) {
        return <div>Error: {typeof error === 'string' ? error : error.message}</div>;
    }

    return (
    <div className="p-4 mt-20 bg-gray-800 text-white rounded-lg shadow h-screen w-full">
        <article className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <section className="md:col-span-1 bg-gray-700 p-4 rounded-lg shadow ">
                <h2 className="text-2xl font-bold mb-4">Search The Jop here</h2>
                <form className="space-y-4 max-w-md mx-auto ">
                    {/* Form fields for job search criteria */}
                    <div>
                        <label className="block mb-2">Keyword:</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-gray-600 text-white"
                            placeholder="e.g., Software Engineer"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Location:</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-gray-600 text-white"
                            placeholder="e.g., New York"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-600 hover:text-black hover:cursor-pointer"
                    >
                        Search Jop
                    </button>
                </form>

                <div>
                    <h2 className="">search history</h2>
                </div>


            </section>

             <section>
            <h2 className="text-2xl font-bold mb-4">Jop Listings</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {jopLists.map((jop, index) => (
                    <div key={jop.job_id} className="p-4 border border-gray-300 rounded-lg bg-white text-black">
                        <h3 className="text-xl font-semibold mb-2">{jop.job_title}</h3>
                        <p className="mb-1"><strong>Employer:</strong> {jop.employer_name ?? 'N/A'}</p>
                        <p className="mb-1"><strong>Location:</strong> {jop.job_city ?? 'N/A'}, {jop.job_state ?? 'N/A'}</p>
                        <p className="mb-1"><strong>Posted At:</strong> {jop.job_posted_at_datetime_utc ?? 'N/A'}</p>
                        <a href={jop.job_apply_link ?? '#'} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Apply Here</a>
                    </div>
                ))}
            </div>

             </section>
        </article>
       
    </div>
    );
}