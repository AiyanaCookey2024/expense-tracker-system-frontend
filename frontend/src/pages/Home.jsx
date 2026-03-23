import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Home({ expenses, budgets, deleteExpense, deleteBudget }) {
  
  const [period, setPeriod] = useState(null);
  const apiURL = import.meta.env.VITE_DJANGO_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const token = localStorage.getItem("access_token")
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
      .then(data => setPeriod(data[0]))
      .catch(err => console.error(err));
  }, [apiURL]);


  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", 
    "August", "September", "October", "November", "December"
  ];
  
  const salaryPeriod = 
    period
    ? `${monthNames[period.month -1]} ${period.year}`
    : "No salary period";

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  )
  const totalSalary = Number(period?.total_salary) || 0;
  
  const remaining = totalSalary - totalExpenses;
  
  return (
    <div className="container">

      <h1>Dashboard</h1>

      {salaryPeriod && (
      <h2>Salary Period: {salaryPeriod}</h2>
      )}

      <p>Total Salary: £{totalSalary.toFixed(2)}</p>
      <p>Total Expenses: £{totalExpenses.toFixed(2)}</p>
      
      <p
        style={{
          color: remaining < 0 ? "red" : "green",
          fontWeight:"bold"}}
          >
          Remaining: £{remaining.toFixed(2)}</p>

      <h2>Expenses</h2>

      <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
  

        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id}>
              <td>{expense.category}</td>
              <td>{expense.title}</td>
              <td>£{expense.amount}</td>

              <td>

                <Link className="btn view-details" to={`/expenses/${expense.id}`}>
                  View Details
                </Link>

                <Link className="btn edit" to={`/expenses/edit/${expense.id}`}>
                  Edit
                </Link>

                <button className="btn delete" onClick={() => deleteExpense(expense.id)}>
                  Delete
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>


      <h2>Budgets</h2>

      <div className="table-wrapper">

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Total Amount</th>
            <th>Month</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {budgets.map(budget => (
            <tr key={budget.id}>

              <td>{budget.name}</td>
              <td>£{budget.total_amount}</td>
              <td>{budget.month}</td>
              <td>{budget.year}</td>

              <td>

                <Link className="btn view-details" to={`/budgets/${budget.id}`}>
                  View Details
                </Link>

                <Link className="btn edit" to={`/budgets/edit/${budget.id}`}>
                  Edit
                </Link>

                <button className="btn delete" onClick={() => deleteBudget(budget.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  </div>
  );
}

export default Home;