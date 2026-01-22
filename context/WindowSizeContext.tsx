'use client';


import {useContext, createContext , useState, useEffect} from 'react';






type WindowContextType ={
    width: number;

}


export const windowContext = createContext<WindowContextType| null>(null);

export const WindowContextProvider = ({children}:{ children: React.ReactNode})=>{
    const [width, setWidth] = useState(0);

    useEffect(()=>{
        const handleResize = () => setWidth(window.innerWidth);

        handleResize(); // set initial size
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    },[])


    return (
        <windowContext.Provider
         value={{
             width
         }}
        >
           { children}
        </windowContext.Provider>

    );

}


export function useWindowContext(){
    const context = useContext(windowContext);
    if(!context){
         throw new Error('useWeatherContext must be used within a WeatherContextProvider');
    }
    return context;
}