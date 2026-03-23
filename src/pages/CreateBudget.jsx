import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateBudget({ addBudget }) {
  const navigate = useNavigate();

  const [budget, setBudget] = useState({
    name: "",
    total_amount: "",
    month: "",
    year: ""
  });

  const handleChange = (e) => {
    setBudget({
      ...budget,
      [e.target.name]: e.target.value
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
       await addBudget(budget);
       navigate("/");
    } catch(error) {
      console.error(error);
      alert("Failed to create budget") 
    }   
  }

  return (
    <div className="container">
      <h1>Create Budget</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={budget.name} onChange={handleChange} />
        <input name="total_amount" placeholder="Total Amount" value={budget.total_amount} onChange={handleChange} />
        <input name="month" placeholder="Month" value={budget.month} onChange={handleChange} />
        <input name="year" placeholder="Year" value={budget.year} onChange={handleChange} />
        <button type="submit" className="btn">Create</button>
      </form>
    </div>
  );
}

export default CreateBudget;