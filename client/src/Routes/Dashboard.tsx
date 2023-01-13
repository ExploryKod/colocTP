import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Balance from '../Component/Balance';
import Expense from "../Component/Expense";
import ExpensesForm from "../Component/ExpensesForm";
import ListUser from "../Component/ListUser";
import { IExpense } from "../types/Expense";
import "../style/Dashboard.css"


export default function Dashboard() {
    const token = JSON.parse(sessionStorage.token)
    const [coloc, setColoc] = useState({title:"", content:"", id:""} || undefined)
    const [expenses, setExpenses] = useState<{ expenses: IExpense[] }>({expenses: []})
    const navigate = useNavigate()

    const deco = () => {
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
        <button className="btn btn-outline-dark btn-lg px-5" onClick={deco}>Logout</button>
        <div className="dashboard">
            <h1 className="title">{coloc?.title}</h1>
            <div className="dashboard__section">
                <div className="dashboard__section__group">
                    <h3 className="subtitle">Expenses</h3>
                    <Expense setExpenses={setExpenses} expenses={expenses}/>
                </div>
                <div className="dashboard__section__group">
                    <h3 className="subtitle">Add Expense</h3>
                    <ExpensesForm setExpenses={setExpenses} expenses={expenses}/>
                </div>
                <div className="dashboard__section__group">
                    <h3 className="subtitle">Add User</h3>
                    <ListUser colocId={coloc?.id}/>
                </div>
                <Balance />
            </div>
        </div>
        </>
    )
}