import { Link } from "react-router-dom";

function Expense({ expense, deleteExpense }) {
  return (
    <tr>
      <td>{expense.category}</td>
      <td>{expense.title}</td>
      <td>£{expense.amount}</td>
      <td>
        <Link to={`/expenses/${expense.id}`}>View</Link>{" | "}
        <Link to={`/expenses/update/${expense.id}`}>Update</Link>{" | "}
        <button onClick={() => deleteExpense(expense.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default Expense;