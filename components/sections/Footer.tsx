
export default function Footer(){
    return (
        <footer className="bg-gray-800 text-white p-4 mt-4 w-full bottom-0">
            <div className="container mx-auto text-center">
                {/*this is my personal information site as well name Yisak Metaferiya and software engineering student */}
                <section>
                    <h2 className="text-lg font-bold mb-2">About Us</h2>
                    <p className="mb-4 text-wrap">This application is developed by Yisak Metaferiya, a software engineering student. It aims to provide users with tools for managing schedules, study plans, and job searches effectively.</p>
                </section>
                <p>&copy; 2025 My Application. All rights reserved.</p>
                <p>
                    <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a> |{' '}
                    <a href="/terms" className="text-blue-400 hover:underline">Terms of Service</a>
                </p>
            </div>
        </footer>
    )
}