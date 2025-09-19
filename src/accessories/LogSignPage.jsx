
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import {useState} from "react";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEKNj6Rt0KQOcZF5b0jtt5xS27ycWT6Dc",
  authDomain: "moody-bb55f.firebaseapp.com",
  projectId: "moody-bb55f",
  storageBucket: "moody-bb55f.firebasestorage.app",
  messagingSenderId: "299299744275",
  appId: "1:299299744275:web:30ff3d1f56806f0698ade6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);


const GenericPage = ({signType}) => {
     const [index, setIndex] = useState(0);
    const [isLogin, setIsLogin ] = useState(true);


    const handleChange = () => {
        setIsLogin(!isLogin);
        setIndex( index => (index+1)%2);
    }




return (
        <>
             <section className={'flex flex-col justify-center'}>
                <p className={'text-center'}>{signType[index].message}</p>
                <h1 className={'text-center text-2xl font-bold'}>{signType[index].type}</h1>
                <form className={'my-16 p-4 rounded-2xl flex flex-col bg-amber-200 m-auto w-1/3 justify-center'} onSubmit={signType[index].func} >
                      <div className="flex flex-1 justify-between">
                          <label htmlFor={'email'} className={'font-bold text-xl  w-100 justify-end '}>Email:  </label>
                            <input type={'email'} name={'email'}
                                   className={'text-lg bg-white text-black  justify-center'} />
                      </div>

                    <div className="flex flex-1 justify-between my-3">
                         <label htmlFor={'password'} className={'font-bold text-xl '}>Password: </label>
                            <input type={'password'} name={'password'} className={'text-lg bg-white text-black  justify-center'} />

                    </div>
                   <div>
                        <button type='submit' className={'bg-blue-400 text-black cursor-pointer w-32 h-10 rounded-xl mx-auto hover:font-bold hover:text-white'}>{signType[index].btnName}</button>
                       <p className={'text-black'}
                          onClick={handleChange}
                       >{signType[index].goToMessage} <span className={'text-blue-500'}> {signType[index].goToName}</span></p>
                   </div>
                </form>

            </section>
        </>
    )
}


export default function LogSignPage({props}) {
    const [message , setMessage] = useState("");
    const [isGoing, setIsGoing] = useState(false);


    const signInWithEmailAndPassword = (e)=>{
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential=>{
            // logged in
            console.log(userCredential)
            setMessage("Successfully logged in");
           setIsGoing(true);
        }).catch(error =>{
           console.log(error)
            setMessage(error);
           setIsGoing(false);
        })
    }


    const signUpWithEmailAndPassword = (e)=>{
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        createUserWithEmailAndPassword(auth, email, password)
     .then(userCredential=>{
         console.log(userCredential);
         setMessage("successfully logged in");
         setIsGoing(true);

     })
     .catch((error) =>{
        console.log(error)
         setMessage(error);
        setIsGoing(false);
     })
    }




    const signLogSwitchData = [
        {
            message: message,
            type: 'login',
            func: signInWithEmailAndPassword,
            btnName: 'Login',
            goToMessage:"already have an account?",
            goToName:'Sign Up',
            goTo:props.goTo,
            isGoing:isGoing,
        },{
         message: message,
            type: 'Sign Up',
            func: signUpWithEmailAndPassword,
            btnName: 'Sign Up',
            goToMessage:"already have an account?",
            goToName:'login',
            goTo:props.goTo,
            isGoing:isGoing,
        }
    ]

    return (
        <GenericPage signType={signLogSwitchData}/>
    )
}