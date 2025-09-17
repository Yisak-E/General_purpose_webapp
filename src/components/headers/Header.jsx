import logo from '../../assets/gpa.png';
import {useNavigate} from "react-router-dom";


export default function Header({headerProps}) {
      const nav = useNavigate();

    const navigateTo= (navData) => {
        nav(navData);
    }

    return (
        <header className={'flex flex-col lg:flex-row md:flex-row lg:align-items-center lg:justify-center '}>
            <img src={logo} alt="Logo" className={' h-fit w-40 mx-auto lg:'}/>
            <h1 className={'text-center text-2xl lg:text-5xl md:text-4xl lg:m-auto md:m-auto font-bold mx-auto '}>{headerProps.title}</h1>
            <nav className={'  m-auto'}>
                {
                    headerProps.navLinks.map((link, index) => (
                       <div className={'inline-flex items-center justify-center'} key={index}>
                            <button
                            key={index}
                            onClick={()=>navigateTo(link.path)}
                            className={'mx-2 hover:text-black  md:bg-blue-500 text-white px-2 py-1 rounded-xl md:h  lg:bg-gray-500 bg-blue-600'}
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