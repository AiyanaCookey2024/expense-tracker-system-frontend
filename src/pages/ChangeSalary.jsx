import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function SalaryPeriod() {
    const [period, setPeriod] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const apiURL = import.meta.env.VITE_DJANGO_API_URL || "http://127.0.0.1:8000";
    const navigate = useNavigate();

   useEffect(() => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("No access token found");
        setLoading(false);
        return;
      }
      
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
        .then((data) => {
          if (data.length > 0){
            setPeriod(data[0]);
          } else {
            setError("No salary period found for this user.")
          }
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load salary period.")
        })
        .finally(() => {
          setLoading(false);
        })
    }, [apiURL]);


  function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    if (!token) return;

    fetch(`${apiURL}/api/salary-periods/${period.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(period),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to update salary period");
        }
        return res.json();
      })
      .then(updated => {
        console.log("Updated:", updated);
        setPeriod(updated);
      })
      .then(() => navigate("/"))
      .catch(err => console.error(err));
  }


  if (!period) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!period) return <p>No salary period found.</p>

  return (
    <div className="container">

      <h1>Salary Period</h1>

      <form onSubmit={handleSubmit}>

        <label>Month</label>
        <input
          type="number"
          value={period.month}
          onChange={e =>
            setPeriod({ ...period, month: Number(e.target.value) })
          }
        />

        <label>Year</label>
        <input
          type="number"
          value={period.year}
          onChange={e =>
            setPeriod({ ...period, year: Number(e.target.value )})
          }
        />

        <label>Salary</label>
        <input 
            type="number"
            value={period.total_salary || ""}
            onChange={e =>
                setPeriod({...period, total_salary: Number(e.target.value)})
            }
        />

        <button type="submit" className="btn">
          Update Salary Period
        </button>

      </form>

    </div>
  );
}

export default SalaryPeriod;

    