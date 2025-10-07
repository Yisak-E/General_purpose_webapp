import Header from "../../components/headers/Header.jsx";

export default function TicTacToe(){


    return (
        <>
            <Header
                headerProps={{
                    title: 'Tic Tac Toe',
                    navLinks: [
                        {label: 'Home', path: '/home'},
                        {label: 'Study Plan', path: '/studyPlan'},
                        {label: 'Job Search', path: '/jobSearch'}
                    ]
                }}
            />

            <div className={`mt-12 h-min-screen`}>
                <h2 className={'text-lg text-black '}>tic tac toe</h2>



            </div>

        </>
    )
}


