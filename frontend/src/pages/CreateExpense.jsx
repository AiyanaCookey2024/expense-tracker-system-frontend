import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CreateExpense({ addExpense }) {
  const apiURL = import.meta.env.VITE_DJANGO_API_URL || "http://127.0.0.1:8000";
  const navigate = useNavigate();

  const [salaryPeriods, setSalaryPeriods] = useState([]);
  const [expense, setExpense] = useState({
    category: "",
    title: "",
    amount: "",
    salary_period: ""
  });

  const handleChange = (e) => {
    setExpense({
      ...expense,
      [e.target.name]: e.target.value
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try{
        const formattedExpense = {
      category: expense.category,
      title: expense.title,
      amount: parseFloat(expense.amount),
      salary_period: parseInt(expense.salary_period)
    };

    await addExpense(formattedExpense);
    navigate("/");
  } catch (error) {
    console.error(error);
    alert(error.message || "Failed to create expense");
  }
}
    

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    fetch(`${apiURL}/api/salary-periods/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok){
            throw new Error("Failed to fetch salary periods");
        }
        return res.json();
    })
      .then((data) => setSalaryPeriods(data))
      .catch((err) => console.error(err));
  }, [apiURL]);

  return (
    <div className="container">
      <h1>Create Expense</h1>
      <form onSubmit={handleSubmit}>
        <select name="category" value={expense.category} onChange={handleChange} required>
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

        <input name="title" placeholder="Title" value={expense.title} onChange={handleChange} required/>
        <input type="number" name="amount" placeholder="Amount" value={expense.amount} onChange={handleChange} required/>

        <select name="salary_period" value={expense.salary_period} onChange={handleChange} required>
          <option value="">Select Salary Period</option>
          {salaryPeriods.map(period => (
            <option key={period.id} value={period.id}>
              {period.total_salary} ({period.month}/{period.year})
            </option>
          ))}
        </select>

        <button type="submit" className="btn">Create</button>
      </form>
    </div>
  );
}

export default CreateExpense;