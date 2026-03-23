import { Routes, Route, Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ExpenseDetails from "./pages/ExpenseDetails";
import BudgetDetails from "./pages/BudgetDetails";
import CreateExpense from "./pages/CreateExpense";
import CreateBudget from "./pages/CreateBudget";
import EditExpense from "./pages/EditExpense";
import EditBudget from "./pages/EditBudget";
import { Login, Register } from "./components/Authentication";
import { useAuth } from "./AuthContext";
import SalaryPeriod from "./pages/ChangeSalary";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

function PrivateRoute({ children }) {
  const { isLoggedIn, authChecked } = useAuth();

  if (!authChecked){
    return <p>Loading...</p>
  }
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const { logout, isLoggedIn, username } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const apiURL = import.meta.env.VITE_DJANGO_API_URL || "http://127.0.0.1:8001";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!isLoggedIn || !token) return;

    fetch(`${apiURL}/api/budgets/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch budgets");
        }
        return res.json();
      })
      .then((data) => {
        setBudgets(data);
      })
      .catch((err) => console.error(err));
  }, [isLoggedIn, apiURL]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!isLoggedIn || !token) return;

    fetch(`${apiURL}/api/expenses/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch expenses");
        }
        return res.json();
      })
      .then((data) => {
        setExpenses(data);
      })
      .catch((err) => console.error(err));
  }, [isLoggedIn, apiURL]);

  async function addBudget(data) {
    const token = localStorage.getItem("access_token");

    const res = await fetch(`${apiURL}/api/budgets/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to add budget");
    }

    const newBud = await res.json();
    setBudgets((prev) => [...prev, newBud]);
    return newBud;
  }

  async function addExpense(data) {
    const token = localStorage.getItem("access_token");

    const res = await fetch(`${apiURL}/api/expenses/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      console.error("Expense create error:", responseData);
      throw new Error(JSON.stringify(responseData));
    }

    setExpenses((prev) => [...prev, responseData]);
    return responseData;
  }

  function deleteBudget(id) {
    const token = localStorage.getItem("access_token");

    fetch(`${apiURL}/api/budgets/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete budget");
        }
        setBudgets((prev) => prev.filter((b) => b.id !== id));
      })
      .catch((err) => console.error(err));
  }

  function deleteExpense(id) {
    const token = localStorage.getItem("access_token");

    fetch(`${apiURL}/api/expenses/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete expense");
        }
        setExpenses((prev) => prev.filter((e) => e.id !== id));
      })
      .catch((err) => console.error(err));
  }

  const hideNav =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";

  return (
    <>
      {!hideNav && (
        <nav>
          {isLoggedIn ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/create-expense">Create Expense</Link>
              <Link to="/create-budget">Create Budget</Link>
              <Link to="/salary-period">Salary Period</Link>
              <Link to="/profile">Profile</Link>
              <span className="welcome-text"> Welcome {username}!</span>
              <button className="btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home
                expenses={expenses}
                budgets={budgets}
                deleteExpense={deleteExpense}
                deleteBudget={deleteBudget}
              />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/create-expense"
          element={
            <PrivateRoute>
              <CreateExpense addExpense={addExpense} />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-budget"
          element={
            <PrivateRoute>
              <CreateBudget addBudget={addBudget} />
            </PrivateRoute>
          }
        />
        <Route
          path="/expenses/:id"
          element={
            <PrivateRoute>
              <ExpenseDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/expenses/edit/:id"
          element={
            <PrivateRoute>
              <EditExpense />
            </PrivateRoute>
          }
        />
        <Route
          path="/budgets/:id"
          element={
            <PrivateRoute>
              <BudgetDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/budgets/edit/:id"
          element={
            <PrivateRoute>
              <EditBudget />
            </PrivateRoute>
          }
        />
        <Route
          path="/salary-period"
          element={
            <PrivateRoute>
              <SalaryPeriod />
            </PrivateRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;