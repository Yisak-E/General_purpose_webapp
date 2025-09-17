import React, { useState, useEffect , useMemo} from "react";
import Header from "../headers/Header.jsx";

export default function TodoAndDone() {

    const [toDOList, setTodoList] = useState([]);
    const [formData, setFormData] = useState({
        date: "",
        title: "",
        description: "",
        completed: false,
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

        // This will only re-run the filter when toDOList changes
    const accomplishedTasks = useMemo(() => {
        return toDOList.filter(task => task.completed);
    }, [toDOList]);

    // This will also only re-run the filter when toDOList changes
    const todoTasks = useMemo(() => {
        return toDOList.filter(task => !task.completed);
    }, [toDOList]);


    // Fetch initial data on component mount
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/items');
                if (!response.ok) {
                    // throw new Error('Failed to fetch items');
                }
                const result = await response.json();

                setTodoList(result.items || result || []); // Handle different API response structures
            } catch (error) {
                console.error("Failed to fetch items", error);
                setMessage("Error loading tasks");
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.date || !formData.title || !formData.description) {
            setMessage("Please fill in all fields");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
               // throw new Error('Failed to add task');
            }

            const result = await response.json();
            // Adjust based on your API response structure
            const newItem = result.item || result;
            setTodoList(prev => [...prev, newItem]);
            setMessage("Task added successfully");

            // Clear message after 3 seconds
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Error adding task: " + error.message);
            console.error(error);
        }

        setFormData({
            date: "",
            title: "",
            description: "",
            completed: false,
        });
    };

    const handleMarking = async (id) => {
        const item = toDOList.find(item => item.id === id);
        if (!item) return;

        const updatedItem = { ...item, completed: !item.completed };

        try {
            const response = await fetch(`http://localhost:5000/api/items/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem)
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            const updatedList = toDOList.map(data =>
                data.id === id ? updatedItem : data
            );
            setTodoList(updatedList);
        } catch (error) {
            console.error("Failed to update item", error);
            setMessage("Error updating task");

            // Clear message after 3 seconds
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
                        title: 'Todo And Done',
                        navLinks: [
                            { label: 'Home', path: '/' },
                            { label: 'Schedules', path: '/schedule' },
                            { label: 'Job Search', path: '/jobSearch' }
                        ]
                    }
                } />

                <section className={'flex-wrap bg-gray-300 wx-50 p-4 rounded-lg'}>

                    {message && (
                        <div id={'form-message'} className={`p-3 mb-4 rounded-lg text-center ${
                            message.includes("Error") ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
                        }`}>
                            {message}
                        </div>
                    )}

                    <div className={'flex flex-col justify-center'}>
                        <div className={'flex justify-center bg-green-300'}>
                            <div className={' w-1/1 rounded-2xl bg-amber-300 p-3'}>

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
                            <div className={'w-full md:w-1/2 mx-auto rounded-2xl bg-green-300 p-3'}>
                                <h3 className={'text-center text-2xl mb-4'}>Accomplished Tasks</h3>
                                {accomplishedTasks.length > 0?
                                    accomplishedTasks.map((data) =>
                                        data && (
                                            <div key={data.title} className="bg-amber-100 p-4 rounded-xl mb-2 flex flex-row justify-between">
                                                <div className={''}>
                                                    <p className="uppercase font-bold flex text-gray-600">{data.title}</p>
                                                    <p className="text-sm font-semibold text-blue-700 text-wrap px-2">{data.description}</p>
                                                </div>
                                                <div className={'ml-3 my-auto'}>
                                                    <button type={'button'} className={'bg-red-700 text-white p-2 rounded-xl'}
                                                        onClick={() => handleMarking(data.id)}> Mark as Todo</button>
                                                </div>
                                            </div>
                                        )
                                    )
                                    : <p className="text-center p-4">No completed tasks yet</p>

                                }
                            </div>

                            <div className={'w-full md:w-1/2 mx-auto bg-red-300 p-3 rounded mt-4 md:mt-0'}>
                                <h3 className={'text-center text-2xl mb-4'}>Todo Tasks</h3>
                                {todoTasks.length>0?
                                    todoTasks.map((data) =>
                                        !data.completed && (
                                            <div key={data.title} className="bg-amber-100 p-4 rounded-xl mb-2 flex flex-row justify-between">
                                                <div className={''}>
                                                    <p className="uppercase font-bold flex text-gray-600">{data.title}</p>
                                                    <p className="text-sm font-semibold text-blue-700 text-wrap px-2">{data.description}</p>
                                                </div>
                                                <div className={'ml-3 my-auto'}>
                                                    <button type={'button'}
                                                        className={'bg-green-700 text-white p-2 rounded-xl hover:cursor-pointer'}
                                                        onClick={() => (handleMarking(data.id))}
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