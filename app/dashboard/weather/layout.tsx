import { WeatherContextProvider } from "@/context/WeatherContext";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <WeatherContextProvider>
                 {children}
            </WeatherContextProvider>
           
        </div>
    );
}