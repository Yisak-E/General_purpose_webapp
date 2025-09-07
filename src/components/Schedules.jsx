
import schedulesData from '../data/schedules.json';
import Header from "./headers/Header.jsx";


function ScheduleTable({ schedules }) {

  return (
    <table className="min-w-full bg-white border">
      <thead>
      <tr>
        <th className="py-2 px-4 border-b">Day</th>
        <th className="py-2 px-4 border-b">Schedule</th>
        </tr>
      </thead>
      <tbody>
        {schedules.map((day) => (
            <tr key={day}>
            <td className="py-2 px-4 border-b">{day}</td>
            <td className="py-2 px-4 border-b">
                {schedulesData[day] ? (
                <ul>
                    {schedulesData[day].map((item, index) => (
                    <li key={index}>{item}</li>
                    ))}
                </ul>
                ) : (
                'No schedule available'
                )}
            </td>
            </tr>
        ))}

      </tbody>
    </table>
  );
}
export default function Schedules() {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
                    <ScheduleTable schedules={daysOfWeek} />

            </div>
        </>
    )
}