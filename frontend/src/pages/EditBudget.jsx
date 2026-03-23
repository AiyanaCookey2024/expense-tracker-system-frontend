import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function EditBudget() {

    const apiURL = import.meta.env.VITE_DJANGO_API_URL || "http://127.0.0.1:8000";

    const { id } = useParams();
    const navigate = useNavigate();
    const [budget, setBudget] = useState({
        name: "",
        total_amount: "",
        month: "",
        year: ""
    });

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        fetch(`${apiURL}/api/budgets/${id}/`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch budget");
            }
            return res.json();
            })
            .then(data => setBudget(data))
            .catch(err => console.error(err));
    }, [id, apiURL]);
    
    const handleChange = (e) => {
        setBudget({
            ...budget,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem("access_token");
        if (!token) return;

        fetch(`${apiURL}/api/budgets/${id}/`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(budget),
        })
            .then(res => {
            if (!res.ok) {
                throw new Error("Failed to update budget");
            }
            return res.json();
            })
            .then(() => navigate(`/budgets/${id}`))
            .catch(err => console.error(err));
        };

    return (
        <div className="container">
            <h1>Edit Budget</h1>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" value={budget.name} onChange={handleChange} />
                <input name="total_amount" placeholder="Total Amount" value={budget.total_amount} onChange={handleChange} />
                <input name="month" placeholder="Month" value={budget.month} onChange={handleChange} />
                <input name="year" placeholder="Year" value={budget.year} onChange={handleChange} />
                <button type="submit" className="btn">
                    Edit</button>
            </form>
        </div>
    );
}

export default EditBudget;