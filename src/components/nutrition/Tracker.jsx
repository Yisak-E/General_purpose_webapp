import Header from "../headers/Header.jsx";


export  default function Tracker() {
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

     <section className={'grid gap-2 bg-gray-300 wx-50 p-4 rounded-lg'}>
            <h1 className={'text-center text-2xl'}>Nutrition Tracker</h1>
            <div className={'grid gap-2'}>
                <div className={'left-side-nav flex flex-col'}>
                    <h3>log meal</h3>
                    <form onSubmit={e => e.preventDefault()} className={'flex flex-col'}>
                       <div className={'flex justify-start ml-3'}>
                            <label htmlFor={'mealType'}>Meal type: </label>
                            <select name={'mealType'} onChange={e => e.preventDefault()} className={'m-2 p-2 rounded-lg'}>
                                <option>Breakfast</option>
                                <option>Lunch</option>
                                <option>snack</option>
                                <option>Dinner</option>
                            </select>
                       </div>

                       <div>
                           <label htmlFor={'foodtype'}>Food Type: </label>
                        <select name={'foodtype'} onChange={e => e.preventDefault()}>
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
                     <label htmlFor={'meal_date'}>Date of meal taken: </label>
                 <input type='date' name={'meal_date'} onChange={e => e.preventDefault()}/>

                </div>
                    </form>

                </div>

                <div className={'right-side-view '}>
                    <p className={'text-center'}> Nutrition tracker coming soon...</p>
                </div>
            </div>
     </section>

        </div>
    )
}