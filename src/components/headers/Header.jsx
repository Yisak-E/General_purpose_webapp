import logo from '../../assets/gpa.png';


export default function Header({headerProps}) {
    return (
        <header className={'flex align-items-center'}>
            <img src={logo} alt="Logo" className={'h-30 w-40 mr-4'}/>
            <h1 className={'text-center text-4xl font-bold my-10'}>{headerProps.title}</h1>
            <nav className={'nav flex-row align-items-center justify-center ml-auto mr-10 my-12'}>
                {
                    headerProps.navLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.path}
                            className={'mx-2 hover:text-black  bg-blue-500 text-white px-3 py-3 rounded-2xl'}
                        >
                            {link.label}
                        </a>
                    ))
                }

            </nav>
        </header>
    );
}