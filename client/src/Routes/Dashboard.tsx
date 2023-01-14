import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Balance from '../Component/Balance';
import Expense from "../Component/Expense";
import ExpensesForm from "../Component/ExpensesForm";
import ListUser from "../Component/ListUser";
import { IExpense } from "../types/Expense";
import WelcomeDashBoard from "../Component/WelcomeDashboard";
import "../style/Dashboard.css"
import NavBarDashboard from "../Component/navBarDashboard";


export default function Dashboard() {
    const token = JSON.parse(sessionStorage.token)
    const [coloc, setColoc] = useState({title:"", content:"", id:""} || undefined)
    const [expenses, setExpenses] = useState<{ expenses: IExpense[] }>({expenses: []})
    const navigate = useNavigate()

    const deco: any = () => {
        sessionStorage.removeItem('token');
        navigate("/login");
    }

    useEffect(() => {
        fetch('http://localhost:5657/coloc', {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: new Headers({
            "Authorization" : "Bearer " + token.token,
            "Content-type":  "application/x-www-form-urlencoded"
        })})
        .then(response => response.json())
        .then(data => setColoc(data.coloc));
    }, [token.token]);
    return(
        <>  
        {/* La navBar qui a été créé inclu déjà un logout (se déconnecter) */}
        {/* <button className="btn btn-outline-dark btn-lg px-5" onClick={deco}>Logout</button> */}
        <NavBarDashboard deco={deco} coloc={coloc} />
        <div className="dashboard">
            <h1 className="title">{coloc?.title}</h1>
            <WelcomeDashBoard coloc={coloc} />
            <div className="container dashboard__section">
                <div className="dashboard__section__group bg-warning px-4 py-2">
                    <h3 className="subtitle fs-4 mt-2 mb-3">Dépenses</h3>
                    <Expense setExpenses={setExpenses} expenses={expenses}/>
                </div>
                <div className="dashboard__section__group bg-success text-white">
                    <h3 className="subtitle fs-4 mt-2 mb-3">Ajout d'une dépense</h3>
                    <ExpensesForm setExpenses={setExpenses} expenses={expenses}/>
                </div>
                <div className="dashboard__section__group bg-warning text-dark">
                    <h3 className="subtitle fs-4 my-2">Potentiels colocataires</h3>
                    <ListUser colocId={coloc?.id}/>
                </div>
            </div>
        </div>
        <Balance coloc={coloc} />
        </>
    )
}