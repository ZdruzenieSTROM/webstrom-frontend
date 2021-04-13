/* eslint-disable prettier/prettier */
import './Competition.css'

import axios from 'axios';
import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

import {Latex} from '../../components/Latex/Latex'


interface Problem {
    id: number,
    text: string, 
    order: number,
    series: number
}

interface Series {
    id: number,
    problems: Problem[],
    order: number,
    deadline: string,
    complete: boolean,
    frozen_results: any,
    semester: number
}

interface Semester {
    id: number,
    series_set: Series[],
    semesterpublication_set: any[],
    unspecifiedpublication_set: any[],
    year: number,
    school_year: string,
    start: string,
    end: string,
    season_code: number,
    frozen_results: boolean,
    competition: number,
    late_tags: any[]
}

const defaultProblems: Problem[] = []

export const Problems: React.FC<{series: number}> = ({series}) => {
    const [problems, setProblems]: [Problem[], (problems: Problem[]) => void] = useState(defaultProblems)
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true)
    const [error, setError]: [string, (error: string) => void] = React.useState("")
    const [year, setYear] = useState(0)
    
    useEffect(() => {
        axios.get<Semester[]>('/api/competition/semester/', {
            headers: {
                "Content-type": "application/json"
            }
        })
        .then(response => {
            setProblems(response.data[0].series_set[series].problems)
            setLoading(false)
            setYear(response.data[0].year)
        })
        .catch(ex => {
            const error =
            ex.response.status === 404
                ? "Máme problém!"
                : "An unexpected error has occurred"
            setError(error)
            setLoading(false)
        })
    }, [])

    return(
        <div className="grid-line">
            <div className="cell spancol">
                <p><h3>ZADANIA - {year}.ROČNÍK - ZIMNÝ SEMESTER</h3></p>
            </div>
            <div className="cell"></div>
            <div className="cell"></div>
            <div className="cell"><h3><Link to='/malynar/zadania/0'>1. SÉRIA ZIMNÉHO SEMESTRA</Link></h3></div>
            <div className="cell"><h3><Link to='/malynar/zadania/1'>2. SÉRIA ZIMNÉHO SEMESTRA</Link></h3></div>
            <div className="cell"><h4>ZMENIŤ SEMESTER</h4></div>

            {problems.map((problem) => (
                <div className="cell spancol" key={problem.id}>
                    <p><h3>{problem.order}. ÚLOHA</h3></p>
                    <p><Latex>{problem.text}</Latex></p>
                </div>
            ))}

            {error && <p className="error">{error}</p>}
        </div>
    )
}
