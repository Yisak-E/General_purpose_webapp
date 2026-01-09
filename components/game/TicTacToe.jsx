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

            <div className={`block`}>
                <h2 className={'text-lg text-black '}>tic tac toe</h2>

                <div className={'my-5 bg-gradient-to-br from-green-500 via-yellow-300 to-red-300 h-120 flex flex-col lg:flex-row'}>

                        <section className="my-5 max-w-xl mx-auto p-6 bg-gray-200 rounded-lg shadow-md opacity-60 hover:bg-white hover:opacity-95 hover:scale-x-110 min-h-screen lg:min-h-fit ">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Play Tic-Tac-Toe</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Tic-Tac-Toe is a turn-based strategy game played on a <span
                                className="font-semibold text-blue-600">3×3 grid</span>. Two players alternate turns,
                                marking empty squares with either an <span
                                className="font-semibold text-red-500">"X"</span> or an <span
                                className="font-semibold text-green-500">"O"</span>. The objective is to be the first to
                                align three of your marks in a row—horizontally, vertically, or diagonally. Each move
                                updates the board with smooth transitions and centered typography, styled for clarity
                                and focus. Hover effects guide your turn, while subtle shadows and rounded corners keep
                                the interface intuitive. Once a player wins or the board fills with no winner, the game
                                resets with a soft fade, inviting you to play again. It’s minimal, responsive, and built
                                for quick strategic fun.
                            </p>
                        </section>


                    <section
                        className={'my-5 opacity-60 hover:opacity-100 shadow-md bg-gray-400 hover:bg-gray-800 rounded-lg  lg:w-1/3'}>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-4 text-center h-32">1</div>
                            <div className="bg-white p-4 text-center h-32">2</div>
                            <div className="bg-white p-4 text-center h-32">3</div>
                            <div className="bg-white p-4 text-center h-32">4</div>
                            <div className="bg-white p-4 text-center h-32">5</div>
                            <div className="bg-white p-4 text-center h-32">6</div>
                            <div className="bg-white p-4 text-center h-32">7</div>
                            <div className="bg-white p-4 text-center h-32">8</div>
                            <div className="bg-white p-4 text-center h-32">9</div>
                        </div>


                    </section>

                    <div className={'opacity-10 bg-gray-400 hover:bg-gray-800 rounded-lg h-21 lg:w-1/3'}>

                    </div>

                </div>


            </div>

        </>
    )
}


