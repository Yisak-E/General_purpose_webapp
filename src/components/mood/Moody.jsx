import Header from "../headers/Header.jsx";
import { Chart } from "react-google-charts";
import relaxImg from "../../assets/relax.png";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import React, { useEffect, useState } from "react";

// configs
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default function Moody() {
  const db = getFirestore(app);
  const [message, setMessage] = useState("");
  const [moods, setMoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState({
    message: "",
    feeling: "",
    postedAt: serverTimestamp(),
  });
  const [postCollection, setPostCollection] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [editingId, setEditingId] = useState(null);

  // get data
  useEffect(() => {
    setIsLoading(true);

    const imojis = [
      { emoji: "😊", name: "happy" },
      { emoji: "😡", name: "angry" },
      { emoji: "😔", name: "sad" },
      { emoji: "😋", name: "playful" },
      { emoji: "😍", name: "loving" },
    ];

    setMoods(imojis);

    const unsubscribe = onSnapshot(
      collection(db, "posts"),
      (snapshot) => {
        const posts = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          posts.push({
            id: doc.id,
            ...data,
            // Convert Firestore timestamp to JS date if it exists
            postedAt: data.postedAt ? data.postedAt.toDate() : new Date(),
          });
        });

        // Sort by date, newest first
        posts.sort((a, b) => b.postedAt - a.postedAt);
        setPostCollection(posts);
        setIsLoading(false);
      },
      (error) => {
        console.log(error);
        setMessage("An error occurred while retrieving posts");
        setTimeout(() => setMessage(""), 3000);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [db]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDescription((prev) => ({ ...prev, [name]: value }));
  };

  // Handle mood selection
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setDescription((prev) => ({ ...prev, feeling: mood }));
  };

  // Add new post
  const addPost = async (e) => {
    e.preventDefault();

    if (!description.message.trim() || !description.feeling) {
      setMessage("Please write something and select a mood!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        message: description.message,
        feeling: description.feeling,
        postedAt: serverTimestamp(),
      });

      // Reset form
      setDescription({
        message: "",
        feeling: "",
        postedAt: serverTimestamp(),
      });
      setSelectedMood("");
      setMessage("Se publicó correctamente!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.log(err);
      setMessage("Pardon, Hubo un problema!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Update post
  const updatePost = async (id) => {
    if (!description.message.trim() || !description.feeling) {
      setMessage("Please write something and select a mood!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, {
        message: description.message,
        feeling: description.feeling,
        postedAt: serverTimestamp(),
      });

      setMessage("Post updated successfully!");
      setTimeout(() => setMessage(""), 3000);
      setEditingId(null);
      setDescription({
        message: "",
        feeling: "",
        postedAt: serverTimestamp(),
      });
      setSelectedMood("");
    } catch (err) {
      console.error(err);
      setMessage("Error updating post");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Set post to edit mode
  const startEditing = (post) => {
    setEditingId(post.id);
    setDescription({
      message: post.message,
      feeling: post.feeling,
      postedAt: serverTimestamp(),
    });
    setSelectedMood(post.feeling);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setDescription({
      message: "",
      feeling: "",
      postedAt: serverTimestamp(),
    });
    setSelectedMood("");
  };

  // Delete post
  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "posts", id));
      setMessage("Post deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.log(err);
      setMessage("Disculpe, Hubo un problema!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="container min-w-full px-2 py-0 min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading posts...</div>
      </div>
    );
  }


  // statistics
  const data = [
    ["Mood", "Feeling Frequency"],
    ["😊 Happy", postCollection.filter(d => d.feeling === "😊").length],
    ["😡 Angry", postCollection.filter(d => d.feeling === "😡").length],
    ["😔 Sad", postCollection.filter(d => d.feeling === "😔").length],
    ["😋 Playful", postCollection.filter(d => d.feeling === "😋").length],
    ["😍 Loving", postCollection.filter(d => d.feeling === "😍").length],
  ];


  const pieOption = {
    title: "Mood",
  };

  const options = {
  title: "Mood Frequency",
  hAxis: { title: "Mood" },
  vAxis: { title: "Frequency" },
  legend: "none",
  colors: ["#4caf50"],
};


  return (
    <>
      <Header
        headerProps={{
          title: "Moody",
          navLinks: [
            { label: "Study Plan", path: "/studyPlan" },
            { label: "Job Search", path: "/jobSearch" },
          ],
        }}
      />

      <section className=" bg-gray-50 min-h-screen py-8 ">
        <div className="container mx-auto px-4  lg:flex lg:flex-row lg:justify-between ">
         <div className={'flex flex-col lg:w-1/2'}>

          {message && (
            <div
              id={"form-message"}
              className={`p-3 mb-6 rounded-lg text-center ${
                message.includes("Error") || message.includes("problem")
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-green-100 text-green-800 border border-green-200"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-32 h-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
              <img src={relaxImg} alt={"profile"} className="w-full h-full object-cover" />
            </div>
            <h1 className="text-black text-2xl font-semibold mt-4">Profile Name</h1>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-center mb-6">How are you feeling today?</h3>

            <div className="mb-6 flex flex-row justify-center space-x-4">
              {moods.map((mood, index) => (
                <button
                  key={index}
                  type="button"
                  className={`text-3xl p-2 rounded-full transition-all ${
                    selectedMood === mood.emoji
                      ? "bg-blue-100 transform scale-110"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleMoodSelect(mood.emoji)}
                  aria-label={mood.name}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>

            <form onSubmit={editingId ? (e) => { e.preventDefault(); updatePost(editingId); } : addPost}>
              <div className="mb-4">
                <label htmlFor="postText" className="block text-gray-700 mb-2">
                  What's on your mind?
                </label>
                <textarea
                  name="message"
                  id="postText"
                  cols="30"
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your thoughts..."
                  value={description.message}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white h-12 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  {editingId ? "Update Post" : "Share Post"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="px-4 bg-gray-500 text-white h-12 rounded-xl font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
         </div>

          <div className="space-y-6 lg:flex lg:flex-col lg:ml-12 max-h-dvh overflow-y-auto ">
            {postCollection.length > 0 ? (
              postCollection.map((data) => (
                <div
                  key={data.id}
                  className="bg-white rounded-xl shadow-md p-5 transition-all hover:shadow-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{data.feeling}</span>
                      <span className="text-gray-500 text-sm">
                        {data.postedAt.toLocaleString()}
                      </span>
                    </div>

                    {!editingId && (
                      <div className="flex space-x-2">
                        <button
                          className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-sm hover:bg-yellow-200 transition-colors"
                          onClick={() => startEditing(data)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition-colors"
                          onClick={() => deletePost(data.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-800 whitespace-pre-line">{data.message}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p className="text-lg">No posts yet(Aún no hay publicaciones)</p>
                <p className="mt-2">Share how you're feeling to get started!</p>
                  <p className="mt-2"> Cuéntanos cómo te sientes para comenzar.</p>
              </div>
            )}
          </div>

        </div>
         <div className={'flex flex-col lg:flex-row '}>
            <Chart
                chartType="PieChart"
                data={data}
                options={pieOption}
                width={"100%"}
                height={"300px"}
              />
           <Chart
              chartType="ColumnChart"
              width="100%"
              height="400px"
              data={data}
              options={options}
            />

          </div>
      </section>
    </>
  );
}


