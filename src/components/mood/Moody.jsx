import Header from "../headers/Header.jsx";

import {useState} from "react";
import LogSignPage from "../../accessories/LogSignPage.jsx";
import {useState} from "react";





export default function Moody(){
    const [isGoing, setIsGoing] = useState(false);

    return (
        <>
            <Header headerProps={
                {title: 'Moody',
                       navLinks: [
                           {label: 'Study Plan', path: '/studyPlan'},
                           {label: 'Job Search', path: '/jobSearch'}
                       ]
            }}/>
            <LogSignPage {...setIsGoing(false)}/ />

        </>
    )
}