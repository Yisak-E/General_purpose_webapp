
import React , {useState} from "react";
import Header from "../headers/Header.jsx";
//import studyplan from "../data/studyplan.json"


export default function TodoAndDone(){
    const toDOList = [{
        title:"study DSA",
        description:"start learning and practicing linked list",
        date:"2025-09-08",
        completed:false
    },
    {
        title:"study SWE401",
        description:"start learning  SDLC",
        date:"2025-09-05",
         completed:false
    },
          {
        title:"study CSC305",
        description:"chapter one to three",
        date:"2025-09-05",
         completed:true
    },
    {
        title:"study ITE390",
        description:"start learning and practicing ethical theories",
        date:"2025-09-18",
         completed:false
    }]
    const [formData, setFormData] = useState({
        taskDate: "",
        taskName: "",
        taskDescription: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e)=> {

        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}))
       setMessage(`name: ${formData.taskName} Date: ${formData.taskDate}`);
    }
    const handleSubmit = (e)=> {
          e.preventDefault();
            // Reset form fields
              setFormData({
                taskDate: "",
                taskName: "",
                taskDescription: ""
              });
              setMessage("");


    }

    const handleMarking = (index)=>{
        toDOList.map((data, i)=>{
            if(i === index){
                data.isComplete = !data.isComplete;
            }
        })
    }

    return(
        <>
            <div className={'container min-w-full px-2 py-0 min-h-screen'}>
                <Header headerProps={
                    {
                        title: 'Todo And Done',
                        navLinks: [
                            {label: 'Home', path: '/'},
                            {label: 'Schedules', path: '/schedule'},
                            {label: 'Job Search', path: '/jobSearch'}
                        ]
                    }
                }/>

                <section className={'grid  bg-gray-300 wx-50 p-4 rounded-lg'}>
                    <h1 className={'text-center text-2xl'}>Todo And Done</h1>
                    <p id={'form-message'}>{message}</p>
                    <div className={' gap-1.5 flex flex-row justify-between'}>
                        <div className={' w-1/3 rounded-2xl bg-green-300 p-3'}>
                             <h3 className={'text-center text-2xl'}>Accomplished Tasks</h3>
                            {
                              toDOList.filter(data => data.completed).length > 0
                                ? toDOList.map((data, i) =>
                                    data.completed && (
                                     <div key={i} className="bg-amber-100 p-4 rounded-xl mb-2 flex flex-row justify-between">
                                           <div className={''}>
                                               <p className="uppercase font-bold flex  text-gray-600">{data.title}</p>
                                               <p className="text-sm font-semibold text-blue-700 text-wrap px-2">{data.description}</p>
                                           </div>

                                              <div className={'ml-3 my-auto'}>
                                                   <button type={'button'} className={'bg-red-700 text-white p-2 rounded-xl'}> uncompleted</button>
                                              </div>

                                          </div>
                                    )
                                  )
                                : <p>Nothing completed</p>
                            }

                        </div>

                        <div className={' w-1/3 rounded-2xl bg-amber-300 p-3'}>

                             <h3 className={'text-center text-2xl'}>Log Task</h3>
                            <form onSubmit={handleSubmit}
                                  >


                                <div className={'flex justify-start ml-3'}>
                                    <label htmlFor={'task_date'} className={'m-2 p-2 font-bold'}>Date of task: </label>
                                    <input type='date' name={'taskDate'}
                                           className={'m-2 p-2 rounded-lg bg-amber-50 text-black'}
                                           required={true}
                                          value={formData.taskDate}
                                           onChange={handleChange}
                                           />

                                </div>

                                <div className={'flex justify-start ml-3'}>
                                    <label className={'m-2 p-2 font-bold'}
                                        htmlFor={'task_name'}>Task Name: </label>
                                    <input type='text'
                                            className={'m-2 p-2 rounded-lg bg-amber-50 text-black'}
                                           name={'taskName'}
                                           placeholder={'Task Name'}
                                           value={formData.taskName}
                                            onChange={handleChange}
                                           required={true}
                                         />

                                </div>


                                <div className={'flex flex-col justify-start ml-3'}>
                                    <label className={'m-2 p-2 font-bold'}
                                        htmlFor={'task_description'}>Task Description: </label>
                                    <textarea
                                            className={'m-2 p-2 rounded-lg bg-amber-50 text-black'}
                                           name={'taskDescription'}
                                            placeholder={'Task Description'}
                                           cols={40} rows={4}
                                            value={formData.taskDescription}
                                             onChange={handleChange}
                                            required={true}
                                          >
                                </textarea>

                                </div>

                                <button type={'submit'} className={'bg-blue-500 text-white px-3 py-2 rounded-lg m-2 ml-4 w-1/4'}>
                                    Add Task
                                </button>
                            </form>

                        </div>

                        <div className={'w-1/3  bg-red-300 p-3 rounded'}>
                             <h3 className={'text-center text-2xl'}>Todo Tasks</h3>
                                {
                                  toDOList.filter(data => !data.completed).length > 0
                                    ? toDOList.map((data, i) =>
                                        !data.completed && (
                                          <div key={i} className="bg-amber-100 p-4 rounded-xl mb-2 flex flex-row justify-between">
                                           <div className={''}>
                                               <p className="uppercase font-bold flex  text-gray-600">{data.title}</p>
                                               <p className="text-sm font-semibold text-blue-700 text-wrap px-2">{data.description}</p>
                                           </div>

                                              <div className={'ml-3 my-auto'}>
                                                   <button type={'button'}
                                                           className={'bg-green-700 text-white p-2 rounded-xl'}
                                                            onClick={()=>(handleMarking(i))}
                                                   > complete</button>
                                              </div>

                                          </div>
                                        )
                                      )
                                    : <p>Nothing completed</p>
}
                        </div>
                    </div>


                </section>

            </div>


        </>
    )
}