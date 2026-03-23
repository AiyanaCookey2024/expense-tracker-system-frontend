import { Link } from "react-router-dom";

function Budget({ budget, deleteBudget }) {
  return (
    <tr>
      <td>{budget.name}</td>
      <td>£{budget.total_amount}</td>
      <td>{budget.month}</td>
      <td>{budget.year}</td>
      <td>
        <Link to={`/budgets/update/${budget.id}`}>Update</Link>{" | "}
        <button onClick={() => deleteBudget(budget.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default Budget;