import Header from "../headers/Header.jsx";
import React from "react";


export  default function Tracker() {

    const [showProgress, setShowProgress] = React.useState(false);

    return (
 <div className={'container min-w-full px-2 py-0 min-h-screen'}>
             <Header headerProps={
                    {
                        title: 'Nutrition Tracker',
                        navLinks: [
                            {label: 'Home', path: '/'},
                            {label: 'Schedules', path: '/schedule'},
                            {label: 'Study Plan', path: '/studyPlan'},
                            {label: 'Job Search', path: '/jobSearch'}
                        ]
                    }
              }/>

     <section className={' bg-gray-300  rounded-lg max-w-full'}>

            <article className={' flex lg:flex-row flex-col gap-2'}>
                <section className={'lg:w-1/3  flex flex-col h-200'}>
                    <h3 className={'text-center text-2xl font-bold'}>log meal</h3>
                    <form onSubmit={e => e.preventDefault()} className={'flex flex-col bg-green-100 rounded-xl'}>

                        <div className={'flex justify-start ml-3'}>
                           <label htmlFor={'foodType'} className={'my-auto font-bold'}>Food Type: </label>
                            <select name={'foodType'} onChange={e => e.preventDefault()} className={'m-2 p-2 bg-green-600 rounded-xl w-40'}>
                                <option>Dairy</option>
                                <option>Vegetables</option>
                                <option>Fruits</option>
                                <option>Grains</option>
                                <option>Protein</option>
                                <option>Oils</option>
                                <option>Discretionary calories</option>

                            </select>
                       </div>

                        <div className={'flex justify-start ml-3'}>
                             <label htmlFor={'meal_date'} className={'my-auto font-bold'}>food Name: </label>
                             <input type='text' name={'meal_date'} onChange={e => e.preventDefault()} className={'m-2 p-2 bg-green-600 rounded-xl w-40'}/>
                        </div>

                       <div className={'flex justify-start ml-3'}>
                            <label htmlFor={'mealType'} className={'my-auto font-bold'}>Meal type: </label>
                            <select name={'mealType'} onChange={e => e.preventDefault()} className={'m-2 p-2 bg-green-600 rounded-xl w-40'}>
                                <option>Breakfast</option>
                                <option>Lunch</option>
                                <option>snack</option>
                                <option>Dinner</option>
                            </select>
                       </div>


                        <div className={'flex justify-start ml-3'}>
                             <label htmlFor={'meal_date'} className={'my-auto font-bold'}>Date of meal taken: </label>
                         <input type='date' name={'meal_date'} onChange={e => e.preventDefault()} className={'m-2 p-2 bg-green-600 rounded-xl w-40'}/>

                        </div>
                    </form>

                </section>

                {
                    showProgress? (  <section className={'lg:w-1/3 flex flex-col justify-between'} >
                    <h3 className={'text-center text-2xl font-bold'}>Daily Progress</h3>
                    <div className={'flex justify-start ml-3 bg-yellow-300 h-200 rounded-lg'} >

                    </div>
                </section>

               ):( <section className={'lg:w-1/3  flex flex-col justify-between'}>
                   <h3 className={'text-center text-2xl font-bold'}> Generate report</h3>
                     <div className={'flex justify-start ml-3 bg-blue-400   h-200 rounded-lg'} >

                    </div>

                </section>)
                }
            </article>
     </section>

        </div>
    )
}