import Header from "../headers/Header.jsx";


export default function WeatherAbuDhabi() {
    return (
        <div className="weather-widget container px-4 py-0 min-w-full min-h-screen">


                        <Header headerProps={
                            {
                                title: 'Weather - Abu Dhabi',
                                navLinks: [
                                    {label: 'Home', path: '/'},
                                    {label: 'Schedules', path: '/schedule'},
                                    {label: 'Study Plan', path: '/studyPlan'},
                                    {label: 'Job Search', path: '/jobSearch'}
                                ]
                            }
                        }/>
            <iframe
            title="Abu Dhabi Weather"
            src="https://www.meteoblue.com/en/weather/widget/three/abu-dhabi_united-arab-emirates_292968?geoloc=fixed&nocurrent=0&noforecast=0&days=3&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&layout=image"
            frameBorder="0"
            scrolling="NO"
            allowTransparency="true"
            style={{ width: '100%', height: '650px' }}
            ></iframe>
        </div>
    );
}