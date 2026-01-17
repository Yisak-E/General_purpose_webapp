import Link from "next/link";
import { JSearchJob } from "@/type/jobSearchType";

interface JobCardViewProps {
  job: JSearchJob;
}

const JobCardView = ({ job }: JobCardViewProps)=>{
    
    return (
        <div
                className="p-4 border border-gray-400 rounded-lg bg-white/70 text-black font-serif overflow-y-scroll md:max-h-[800px]"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {job.job_title}
                </h3>

                <p className="mb-1">
                  <strong>Employer:</strong>{' '}
                  {job.employer_name ?? 'N/A'}
                  <span className="text-blue-700 underline pl-4"> <Link href={job.employer_website ?? '#'} target="_blank" rel="noopener noreferrer">{job.employer_website ?? ''}</Link></span>
                </p>

                <p className="mb-1">
                  <strong>Location:</strong>{' '}
                  {job.job_city ?? 'N/A'}, {job.job_state ?? 'N/A'}
                </p>

                <p className="mb-1">
                  <strong>Posted At:</strong>{' '}
                  {job.job_posted_at_timestamp ? new Date(job.job_posted_at_timestamp * 1000).toLocaleDateString() : 'N/A'}
                </p>

                <p>
                    <strong>Employment Type:</strong>{' '}
                    {job.job_employment_type ?? 'N/A'}
                </p>

                <p className="">
                  <strong>Jop Publisher</strong>
                  : {job.job_publisher ?? 'N/A'}
                   
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

export default JobCardView;