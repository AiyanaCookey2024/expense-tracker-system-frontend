import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function EditExpense() {

    const apiURL = import.meta.env.VITE_DJANGO_API_URL || "http://127.0.0.1:8000";

    const { id } = useParams();
    const navigate = useNavigate();
    const [salaryPeriods, setSalaryPeriods] = useState([]);
    const [expense, setExpense] = useState({
        title: "",
        amount: "",
        category: "",
        salary_period: "",
        month: "",
        year: ""
    });

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
                throw new Error("Failed to fetch expense");
            }
            return res.json();
            })
            .then(data => setExpense(data))
            .catch(err => console.error(err));
    }, [id, apiURL]);
    
    const handleChange = (e) => {
        setExpense({
            ...expense,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const formattedExpense = {
        ...expense,
        amount: parseFloat(expense.amount),
        salary_period: parseInt(expense.salary_period),
    };

    fetch(`${apiURL}/api/expenses/${id}/`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedExpense),
    })
        .then(res => {
        if (!res.ok) {
            throw new Error("Failed to update expense");
        }
        return res.json();
        })
        .then(() => navigate(`/expenses/${id}`))
        .catch(err => console.error(err));
    };

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        fetch(`${apiURL}/api/salary-periods/`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch salary periods");
            }
            return res.json();
            })
            .then(data => setSalaryPeriods(data))
            .catch(err => console.error(err));
    }, [apiURL]);

    return (
        <div className="container">
            <h1>Edit Expense</h1>
            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Title" value={expense.title} onChange={handleChange} />
                <input name="amount" placeholder="Amount" value={expense.amount} onChange={handleChange} />
                <input name="month" placeholder="Month" value={expense.month} onChange={handleChange} />
                <input name="year" placeholder="Year" value={expense.year} onChange={handleChange} />
                <select name="category" value={expense.category} onChange={handleChange}>
                    <option value="">Select Category</option>
                    <option value="FOOD">Food</option>
                    <option value="TRANSPORT">Transport</option>
                    <option value="ENTERTAINMENT">Entertainment</option>
                    <option value="BILLS">Bills</option>
                    <option value="FUN">Fun</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="SAVINGS/INVESTMENTS">Savings/Investments</option>
                    <option value="OTHER">Other</option>
                </select>
                <select name="salary_period" value={expense.salary_period} onChange={handleChange}>
                    <option value="">Select Salary Period</option>

                    {salaryPeriods.map(period => (
                        <option key={period.id} value={period.id}>
                            {period.total_salary} ({period.month}/{period.year})
                        </option>
                    ))}
                </select>
                <button type="submit" className="btn">
                    Edit </button>
            </form>
        </div>
    );
}

export default EditExpense;