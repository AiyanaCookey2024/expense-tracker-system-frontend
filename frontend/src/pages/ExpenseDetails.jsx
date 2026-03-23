import { useParams } from "react-router-dom";   
import { useEffect, useState } from "react";

function ExpenseDetails() {
    const apiURL = import.meta.env.VITE_DJANGO_API_URL || "http://127.0.0.1:8000";

    const { id } = useParams();
    const [expenses, setExpenses] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        fetch(`${apiURL}/api/expenses/${id}/`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch expense details");
            }
            return res.json();
            })
            .then(data => setExpenses(data))
            .catch(err => console.error(err));
    }, [id, apiURL]);

if (!expenses) return <p>Loading...</p>;

return (
    <div className="container">
        <h1>{expenses.title}</h1>

        <p>Category: {expenses.category}</p>
        <p>Title: {expenses.title}</p>
        <p>Amount: £{expenses.amount}</p>
        <p>Month: {expenses.month}</p>
        <p>Year: {expenses.year}</p>
    </div>
  );
}
export default ExpenseDetails;