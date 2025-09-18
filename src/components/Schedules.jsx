
import schedulesData from '../data/schedules.json';
import Header from "./headers/Header.jsx";
import {useState} from "react";


function ScheduleTable({schedlue}) {
    const [day, setDay] = useState("Monday");

    const handleChange = (e)=>{
        setDay(e.target.value);
    }

  return (
    <>
        <form>
            <label htmlFor={'daySelection'}
            className={'w-56 bg-amber-300 px-2 py-1 text-2xl'}
            >Show For: </label>
            <select name={'daySelection'}
                    value={day}
                    onChange={handleChange}
                    className={'w-56 bg-gray-200 px-2 py-1 text-2xl'}>
                <option className={'w-full'}>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
            </select>
        </form>

        <table className={'bg-black text-white w-full '}>
            <thead>
            <tr className={'w-full gap-6 h-12 border-white border-b-2'}>
                <th >Course</th>
                <th>Time</th>
                <th>Room</th>
            </tr>
            </thead>
            {schedlue.length>0? schedlue.map((schedule, index) => (


                        schedule.day === day?(
                          <tr key={index} className={'w-full gap-6 h-12'}>
                             <td className={'border-gray-300 border-1'}>{schedule.course}</td>
                              <td className={'border-gray-300 border-1'}>{schedule.time}</td>
                              <td className={'border-gray-300 border-1'}>{schedule.room}</td>
                          </tr>
                        ):(
                            <p className={'hidden'}>not the need</p>
                        )



            )):(<></>)
            }
        </table>

    </>
  );
}
export default function Schedules() {


    return (
        <>
            <div className="container px-4 py-0 min-w-full min-h-screen">
               <Header headerProps={
                   {
                       title: 'Schedules',
                       navLinks: [
                           {label: 'Home', path: '/'},
                           {label: 'Study Plan', path: '/studyPlan'},
                           {label: 'Job Search', path: '/jobSearch'}
                       ]
                   }
               } />
                <p>This is the Schedules page.</p>
                    <ScheduleTable schedlue={schedulesData} />

            </div>
        </>
    )
}
