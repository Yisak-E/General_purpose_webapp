import logo from '../../assets/gpa.png';
import {useNavigate} from "react-router-dom";


export default function Header({headerProps}) {
      const nav = useNavigate();

    const navigateTo= (navData) => {
        nav(navData);
    }

    return (
        <header className={'flex lg:flex-row lg:align-items-center lg:justify-center sm:flex-col'}>
            <img src={logo} alt="Logo" className={'h-30 w-40 mr-4'}/>
            <h1 className={'text-center text-4xl font-bold m-auto '}>{headerProps.title}</h1>
            <nav className={'  m-auto'}>
                {
                    headerProps.navLinks.map((link, index) => (
                       <div className={'inline-flex items-center justify-center'} key={index}>
                            <button
                            key={index}
                            onClick={()=>navigateTo(link.path)}
                            className={'mx-2 hover:text-black  md:bg-blue-500 text-white p-1 rounded-xl md:h  lg:bg-gray-500 sm:bg-blue-950'}
                        >
                            {link.label}
                        </button>
                       </div>
                    ))
                }

            </nav>
        </header>
    );
}