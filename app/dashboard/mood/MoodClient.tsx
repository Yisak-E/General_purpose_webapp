'use client';

import { useMoody } from "@/context/MoodyContext";


export default function MoodClient() {
    const {posts} = useMoody();
    return (
        <div>
            <ul className='list-disc list-inside'>
                {posts.map((post, index) => (
                    <li key={index}>{post.message}
                    {post.postedAt.toString()}
                     
                    </li>
                ))}
               
            </ul>
        </div>
    );
}