'use client';

import { useMoody } from "@/context/MoodyContext";
import { motion, scale } from "framer-motion";
import { useState } from "react";
import { Chart } from "react-google-charts";

const imojis = [
      { emoji: "😊", name: "happy" },
      { emoji: "😡", name: "angry" },
      { emoji: "😔", name: "sad" },
      { emoji: "😋", name: "playful" },
      { emoji: "😍", name: "loving" },
    ];


export default function MoodClient() {
    const [moods, setMoods] = useState(imojis);
    const {posts, addPost} = useMoody();
    const [selectedMood, setSelectedMood] = useState<string >("");
    const [message, setMessage] = useState("");
    const [feeling, setFeeling] = useState("");

    



    const handleMoodSelect = (mood: string) => {
      setSelectedMood(mood);
      setFeeling(mood); 
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedMood && message) {
            await addPost(message, selectedMood);
            setMessage("");
            setSelectedMood("");
        }
    };
   
    return (
        <div className="mt-10 md:grid md:grid-cols-2 md:gap-6 bg-black text-white">
            <div className="space-y-4 md:col-span-1 px-10">

                 {
                    message && !feeling && (
                       <div className="  ">
                        <motion.p className="text-red-600 italic text font-semibold"
                            initial={{scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ repeat: Infinity,  ease: "easeInOut", delay: 2, duration: 5 }}
                            >Please select a mood before posting.</motion.p>
                       </div>
                    )
                }

                {/* new post/ edition */}
                <div className="p-4 rounded-lg bg-gray-800/50 text-white shadow">
                    <h2 className="text-2xl font-semibold mb-4">Create a New Mood Post</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="mb-6 flex flex-row justify-center space-x-4">
                            {moods.map((mood, index) => (
                                <button
                                key={index}
                                type="button"
                                className={`text-3xl p-2 rounded-full transition-all ${
                                    selectedMood === mood.emoji
                                    ? "bg-blue-100 transform scale-120 hover:rotate-270 duration-700 ease-in-out"
                                    : "hover:bg-gray-100"
                                }`}
                                onClick={() => handleMoodSelect(mood.emoji)}
                                aria-label={mood.name}
                                >
                                {mood.emoji}
                                </button>
                            ))}
                        </div>
                
                        <div>
                            <label className="block text-gray-400">Message:</label>
                            <textarea 
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 mt-1" rows={4}></textarea>
                        </div>
                        <button type="submit" className="bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500 hover:cursor-pointer">Post Mood</button>
                    </form>
                </div>

                <div className="p-4  bg-black text-white shadow">
                    <h2 className="text-2xl font-semibold mb-4">Mood Statistics</h2>
                    <MoodyStats posts={posts} />
                </div>

           </div>
            <div className="space-y-2 mt-4 flex flex-col justify-center md:flex-row md:col-span-1  md:flex-wrap gap-4 overflow-y-auto  max-h-[600px]">

            
                {posts.map((post) => (
                    <MoodyCard
                        key={post.id.toString()}
                        feeling={post.feeling}
                        postedAt={post.postedAt}
                        message={post.message}
                    />
                ))}
            </div>
        </div>
    );
}

    
interface MoodyCardProps {
   
    feeling: string;
    postedAt: Date;
    message: string;
}

function MoodyCard({  feeling, postedAt, message }: MoodyCardProps) {
    return (
        <div className="p-4 border border-gray-300 rounded-lg bg-white shadow h-32 w-64">
            <h2 className="mb-2">
                <span className=" text-xl">{feeling}</span> 
                <span className="float-right italic text-sm text-gray-500">{postedAt.toDateString()}</span></h2>       
            <p className="text-gray-700">{message}</p>
        </div>
    );
}


interface MoodyStatsProps {
    // You can add props if needed
    posts: Array<{
        feeling: string;
        postedAt: Date;
        message: string;
    }>;
}

const MoodyStats = ({ posts }: MoodyStatsProps) => {

      // statistics
  const data = [
    ["Mood", "Feeling Frequency"],
    ["😊 Happy", posts.filter(d => d.feeling === "😊").length],
    ["😡 Angry", posts.filter(d => d.feeling === "😡").length],
    ["😔 Sad", posts.filter(d => d.feeling === "😔").length],
    ["😋 Playful", posts.filter(d => d.feeling === "😋").length],
    ["😍 Loving", posts.filter(d => d.feeling === "😍").length],
  ];


  const options = {
        title: "Mood Frequency",
        hAxis: { title: "Mood" },
        vAxis: { title: "Frequency" },
        legend: "none",
    };

    return (

    <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={data}
                options={options}
            />

    );
}