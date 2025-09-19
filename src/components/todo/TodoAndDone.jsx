import React, { useState, useEffect, useMemo } from "react";
import Header from "../headers/Header.jsx";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

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

export default function TodoAndDone() {
  const db = getFirestore(app);
  const [toDOList, setTodoList] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    title: "",
    description: "",
    completed: false,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch data from Firebase in real-time
  useEffect(() => {
    setLoading(true);

    // Set up real-time listener
    const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
      const todos = [];
      snapshot.forEach((doc) => {
        todos.push({ id: doc.id, ...doc.data() });
      });

      setTodoList(todos);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching todos: ", error);
      setMessage("Error loading tasks");
      setLoading(false);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [db]);

  const accomplishedTasks = useMemo(() => {
    return toDOList.filter(task => task.completed);
  }, [toDOList]);

  const todoTasks = useMemo(() => {
    return toDOList.filter(task => !task.completed);
  }, [toDOList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "todos"), {
        date: formData.date,
        title: formData.title,
        description: formData.description,
        completed: false,
      });
      console.log("Document written with ID: ", docRef.id);

      // Reset form
      setFormData({
        date: "",
        title: "",
        description: "",
        completed: false,
      });

      setMessage("Task added successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (e) {
      console.error("Error adding document: ", e);
      setMessage("Error adding task");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleMarking = async (id, currentStatus) => {
    try {
      const taskRef = doc(db, "todos", id);
      await updateDoc(taskRef, {
        completed: !currentStatus
      });

      setMessage(`Task marked as ${!currentStatus ? 'completed' : 'todo'}!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating document: ", error);
      setMessage("Error updating task");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="container min-w-full px-2 py-0 min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading tasks...</div>
      </div>
    );
  }

  return (
    <>
      <div className={'container min-w-full px-2 py-0 min-h-screen'}>
        <Header headerProps={
          {
            title: 'Mini Todo',
            navLinks: [
              { label: 'Home', path: '/' },
              { label: 'Schedules', path: '/schedule' },
              { label: 'Job Search', path: '/jobSearch' }
            ]
          }
        } />

        <section className={'flex-wrap bg-gray-300 w-full mt-3 p-4 '}>

          {message && (
            <div id={'form-message'} className={`p-3 mb-4 rounded-lg text-center ${
              message.includes("Error") ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
            }`}>
              {message}
            </div>
          )}

          <div className={'flex flex-col justify-center'}>
            <div className={'flex justify-center bg-green-300'}>
              <div className={' w-1/1  bg-amber-300 p-3'}>

                <h3 className={'text-start ml-7 font-bold text-2xl'}>Log Task</h3>
                <form onSubmit={handleSubmit}>

                  <div className={'flex justify-start ml-3'}>
                    <label htmlFor={'date'} className={'m-2 p-2 font-bold'}>Date of task: </label>
                    <input type='date' name={'date'}
                      className={'m-2 p-2 rounded-lg bg-amber-50 text-black'}
                      required={true}
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={'flex justify-start ml-3'}>
                    <label className={'m-2 p-2 font-bold'}
                      htmlFor={'title'}>Task Name: </label>
                    <input type='text'
                      className={'m-2 p-2 rounded-lg bg-amber-50 text-black'}
                      name={'title'}
                      placeholder={'Task Name'}
                      value={formData.title}
                      onChange={handleChange}
                      required={true}
                    />
                  </div>

                  <div className={'flex flex-col justify-start ml-3'}>
                    <label className={'m-2 p-2 font-bold'}
                      htmlFor={'description'}>Task Description: </label>
                    <textarea
                      className={'m-2 p-2 rounded-lg bg-amber-50 text-black'}
                      name={'description'}
                      placeholder={'Task Description'}
                      cols={40} rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      required={true}
                    >
                    </textarea>
                  </div>

                  <button type={'submit'}
                    className={'bg-blue-500 text-white px-3 py-2 rounded-lg m-2 ml-4 w-1/4'}>
                    Add Task
                  </button>
                </form>
              </div>
            </div>

            <div className={'flex w-full flex-col lg:gap-5 md:flex-row mt-4'}>
              <div className={'w-full md:w-1/2 mx-auto  bg-green-300 p-3'}>
                <h3 className={'text-center text-2xl mb-4'}>Accomplished Tasks</h3>
                {accomplishedTasks.length > 0 ?
                  accomplishedTasks.map((data) =>
                    data && (
                      <div key={data.id} className="bg-amber-100 p-4 rounded-xl mb-2 flex flex-row justify-between">
                        <div className={''}>
                          <p className="uppercase font-bold flex text-gray-600">{data.title}</p>
                          <p className="text-sm font-semibold text-blue-700 text-wrap px-2">{data.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{data.date}</p>
                        </div>
                        <div className={'ml-3 my-auto'}>
                          <button type={'button'} className={'bg-red-700 text-white p-2 rounded-xl'}
                            onClick={() => handleMarking(data.id, data.completed)}> Mark as Todo</button>
                        </div>
                      </div>
                    )
                  )
                  : <p className="text-center p-4">No completed tasks yet</p>

                }
              </div>

              <div className={'w-full md:w-1/2 mx-auto bg-red-300 p-3 rounded mt-4 md:mt-0'}>
                <h3 className={'text-center text-2xl mb-4'}>Todo Tasks</h3>
                {todoTasks.length > 0 ?
                  todoTasks.map((data) =>
                    !data.completed && (
                      <div key={data.id} className="bg-amber-100 p-4 rounded-xl mb-2 flex flex-row justify-between">
                        <div className={''}>
                          <p className="uppercase font-bold flex text-gray-600">{data.title}</p>
                          <p className="text-sm font-semibold text-blue-700 text-wrap px-2">{data.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{data.date}</p>
                        </div>
                        <div className={'ml-3 my-auto'}>
                          <button type={'button'}
                            className={'bg-green-700 text-white p-2 rounded-xl hover:cursor-pointer'}
                            onClick={() => (handleMarking(data.id, data.completed))}
                          > Complete</button>
                        </div>
                      </div>
                    )
                  )
                  : <p className="text-center p-4">All tasks completed! Great job!</p>
                }
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}