
import {useState} from "react";
import Header from "../headers/Header.jsx";
//import studyplan from "../data/studyplan.json"


export default function TodoAndDone(){
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
                    <div className={' gap-1.5 flex flex-row justify-between'}>
                        <div className={' w-1/3 rounded-2xl bg-green-300 p-3'}>
                             <h3 className={'text-center text-2xl'}>Accomplished Tasks</h3>
                            <p className={'text-center'}> Coming soon...</p>
                        </div>

                        <div className={' w-1/3 rounded-2xl bg-amber-300 p-3'}>

                             <h3 className={'text-center text-2xl'}>Log Task</h3>
                            <form onSubmit={e => e.preventDefault()}
                                  >


                                <div className={'flex justify-start ml-3'}>
                                    <label htmlFor={'task_date'} className={'m-2 p-2 font-bold'}>Date of task: </label>
                                    <input type='date' name={'task_date'}
                                           className={'m-2 p-2 rounded-lg bg-amber-50 text-black'}
                                           onChange={e => e.preventDefault()}/>

                                </div>

                                <div className={'flex justify-start ml-3'}>
                                    <label className={'m-2 p-2 font-bold'}
                                        htmlFor={'task_name'}>Task Name: </label>
                                    <input type='text'
                                            className={'m-2 p-2 rounded-lg bg-amber-50 text-black'}
                                           name={'task_name'}
                                           onChange={e => e.preventDefault()}/>

                                </div>


                                <div className={'flex flex-col justify-start ml-3'}>
                                    <label className={'m-2 p-2 font-bold'}
                                        htmlFor={'task_description'}>Task Description: </label>
                                    <textarea
                                            className={'m-2 p-2 rounded-lg bg-amber-50 text-black'}
                                           name={'task_description'}
                                           cols={40} rows={4}
                                           onChange={e => e.preventDefault()}>
                                </textarea>

                                </div>

                                <button type={'submit'} className={'bg-blue-500 text-white px-3 py-2 rounded-lg m-2 ml-4 w-1/4'}>
                                    Add Task
                                </button>
                            </form>

                        </div>

                        <div className={'w-1/3 rounded-2xl bg-red-300 '}>
                             <h3 className={'text-center text-2xl'}>Todo Tasks</h3>
                            <p className={'text-center'}> Coming soon...</p>
                        </div>
                    </div>


                </section>

            </div>


        </>
    )
}