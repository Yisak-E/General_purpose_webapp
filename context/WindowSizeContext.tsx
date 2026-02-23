'use client';


import {useContext, createContext , useState, useEffect} from 'react';

type WindowContextType = {
  width: number;
  breakpoint: 'small' | 'medium' | 'large';
};


const getBreakpoint = (w: number) => {
  if (w < 640) return 'small';
  if (w < 1024) return 'medium';
  return 'large';
};




export const windowContext = createContext<WindowContextType| null>(null);

export const WindowContextProvider = ({children}:{ children: React.ReactNode})=>{
    const [width, setWidth] = useState(0);
    const breakpoint = getBreakpoint(width);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [width]);



    return (
        <windowContext.Provider
         value={{
             width,
             breakpoint
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