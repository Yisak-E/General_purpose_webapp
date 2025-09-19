import Header from "../headers/Header.jsx";
// import {useState} from "react";







export default function Moody(){


    return (
        <>
            <Header headerProps={
                {title: 'Moody',
                       navLinks: [
                           {label: 'Study Plan', path: '/studyPlan'},
                           {label: 'Job Search', path: '/jobSearch'}
                       ]
            }}/>


        </>
    )
}