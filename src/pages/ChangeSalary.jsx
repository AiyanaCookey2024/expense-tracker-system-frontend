import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SalaryPeriod() {
  const [period, setPeriod] = useState({
    month: "",
    year: "",
    total_salary: "",
  });
  const [loading, setLoading] = useState(true);
  const [existingPeriodId, setExistingPeriodId] = useState(null);
  const apiURL = import.meta.env.VITE_DJANGO_API_URL || "http://127.0.0.1:8000";
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${apiURL}/api/salary-periods/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch salary periods");
        }
        return res.json();
      })
      .then((data) => {
        if (data.length > 0) {
          setPeriod(data[0]);
          setExistingPeriodId(data[0].id);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiURL]);

  function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const method = existingPeriodId ? "PATCH" : "POST";
    const url = existingPeriodId
      ? `${apiURL}/api/salary-periods/${existingPeriodId}/`
      : `${apiURL}/api/salary-periods/`;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        month: Number(period.month),
        year: Number(period.year),
        total_salary: Number(period.total_salary),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            existingPeriodId
              ? "Failed to update salary period"
              : "Failed to create salary period"
          );
        }
        return res.json();
      })
      .then((savedPeriod) => {
        console.log("Saved:", savedPeriod);
        setPeriod(savedPeriod);
        setExistingPeriodId(savedPeriod.id);
      })
      .then(() => navigate("/"))
      .catch((err) => console.error(err));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Salary Period</h1>

      <form onSubmit={handleSubmit}>
        <label>Month</label>
        <input
          type="number"
          value={period.month}
          onChange={(e) =>
            setPeriod({ ...period, month: Number(e.target.value) })
          }
        />

        <label>Year</label>
        <input
          type="number"
          value={period.year}
          onChange={(e) =>
            setPeriod({ ...period, year: Number(e.target.value) })
          }
        />

        <label>Salary</label>
        <input
          type="number"
          value={period.total_salary || ""}
          onChange={(e) =>
            setPeriod({ ...period, total_salary: Number(e.target.value) })
          }
        />

        <button type="submit" className="btn">
          {existingPeriodId ? "Update Salary Period" : "Create Salary Period"}
        </button>
      </form>
    </div>
  );
}

export default SalaryPeriod;