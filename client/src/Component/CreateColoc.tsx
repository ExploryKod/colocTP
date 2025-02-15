import {ChangeEvent, FormEvent, useState} from "react";
import { FormColoc, IShowProps} from "../types/Coloc";
import {useNavigate} from "react-router-dom";


export default function Form({setColoc, coloc}: IShowProps) {

    const [formData, setFormData] = useState<FormColoc>({ title: "", content: "" })
    // @ts-ignore
    const token = JSON.parse(sessionStorage.token)
    const navigate = useNavigate()

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch('http://localhost:5657/createcoloc', {
            method: "POST",
            mode: "cors",
            body: new URLSearchParams({
                ...formData
            }),
            credentials: "include",
            headers: new Headers({
                "Authorization" : "Bearer " + token.token,
                "Content-type":  "application/x-www-form-urlencoded"
            })
        })
            .then(data => data.json())
            .then((json) => {
               
                if (json.message) {
                    if (json.message === "invalid cred") {
                        sessionStorage.removeItem('token');
                        navigate("/login")
                    }
                    return
                }
                setColoc(
                    prevState => {
                        return {
                            coloc: [
                                json.coloc,
                                ...prevState.coloc,
                            ]
                        }
                    }
                )
            })
            navigate('/coloc')
    }

    const handleChange = (e: ChangeEvent) => {
        setFormData(prevState => {
            return {
                ...prevState,
                // @ts-ignore
                [e.target.name]: e.target.value
            }
        })
    }

    return (
        <>
            <div className="container py-2 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card bg-dark text-white " style={{borderRadius: '1rem'}}>
                            <form className="card-body p-5" onSubmit={handleSubmit}>
                                <div className="form-outline form-white mb-4">
                                    <label className="form-label" htmlFor="ColocName">Nom de la colocation:</label>
                                    <input type="text" id="ColocName" className="form-control form-control-lg" name="title" onChange={handleChange}/>
                                </div>
                                <div className="form-outline form-white mb-4">
                                    <label className="form-label" htmlFor="ColocAddress">Adresse:</label>
                                    <textarea id="ColocAddress" className="form-control form-control-lg" name="content" onChange={handleChange}/>
                                </div>
                                <button className="btn btn-outline-light btn-lg px-5" type="submit">Je crée ma coloc</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}