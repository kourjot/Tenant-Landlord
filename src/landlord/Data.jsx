import { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";
import "./Data.css";
import Navbar_1 from "./Navbar_1";

function Data() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billData, setBillData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentBill, setCurrentBill] = useState({});
  const [billAmount, setBillAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState(""); // For managing status

  useEffect(() => {
    fetchBillData();
  }, []);

  const fetchBillData = () => {
    axios
      .get(
        "https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/LeaseEase/BillData.json"
      )
      .then((response) => {
        const fetchedBills = response.data || {};
        const formattedBills = Object.keys(fetchedBills).map((key) => ({
          id: key,
          ...fetchedBills[key],
        }));
        setBillData(formattedBills);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch bill data.");
        setLoading(false);
      });
  };

  const handleGenerateBill = (bill) => {
    setCurrentBill(bill);
    setBillAmount(bill.amount); // Pre-fill bill amount
    setDueDate(bill.dueDate); // Pre-fill due date
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setBillAmount("");
    setDueDate("");
  };

  const handleBillSubmit = () => {
    if (!billAmount || !dueDate) {
      alert("Please fill in all fields.");
      return;
    }

    const billDetails = {
      name: currentBill.name,
      address: currentBill.address,
      category: currentBill.category,
      amount: billAmount,
      dueDate,
    };

    axios
      .put(
        `https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/LeaseEase/BillData/${currentBill.id}.json`,
        billDetails
      )
      .then(() => {
        alert("Bill updated successfully.");
        fetchBillData(); // Refresh the bill data
        handleClosePopup();
      })
      .catch(() => {
        alert("Failed to update bill.");
      });
  };

  const handleStatusUpdate = (billId, newStatus) => {
    const updatedBill = {
      ...billData.find((bill) => bill.id === billId),
      status: newStatus,
    };
    axios
      .put(
        `https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/LeaseEase/BillData/${billId}.json`,
        updatedBill
      )
      .then(() => {
        fetchBillData(); // Refresh the bill data
      })
      .catch(() => {
        setError("Failed to update status.");
      });
  };

  const handleDeleteBill = (billId) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      axios
        .delete(
          `https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/LeaseEase/BillData/${billId}.json`
        )
        .then(() => {
          alert("Bill deleted successfully.");
          fetchBillData(); // Refresh the bill data
        })
        .catch(() => {
          alert("Failed to delete bill.");
        });
    }
  };

  return (
    <>
      <Navbar_1 />
      <div className="Data">
      <h1>Bill Details</h1>
        {loading ? (
          <p className="loadings">Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="Bill_1">
            
            {billData.length > 0 ? (
              <div className="cards">
                {billData.map((bill) => (
                  <div key={bill.id} className="card">
                    <div className="card-content">
                      <p>
                        <strong>Name:</strong> {bill.name || "No Name"}
                      </p>
                      <p>
                        <strong>Address:</strong> {bill.address || "No Address"}
                      </p>
                      <p>
                        <strong>Category:</strong>{" "}
                        {bill.category || "No Category"}
                      </p>
                      <p>
                        <strong>Amount:</strong> {bill.amount || "No Amount"}
                      </p>
                      <p>
                        <strong>Due Date:</strong>{" "}
                        {bill.dueDate || "No Due Date"}
                      </p>
                      <p>
                        <strong>Status:</strong> {bill.status || "Pending"}
                      </p>
                      <select
                        value={bill.status || "Pending"}
                        onChange={(e) =>
                          handleStatusUpdate(bill.id, e.target.value)
                        }
                        className="status-select"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <div className="card-edit">
                        <button
                          onClick={() => handleGenerateBill(bill)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBill(bill.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No Bill Data Available.</p>
            )}
          </div>
        )}
      </div>

      {showPopup && (
        <div className="popup_1">
          <div className="bill_1-form">
            <h2>Edit Bill</h2>
            <p>
              <strong>Name:</strong> {currentBill.name}
            </p>
            <p>
              <strong>Address:</strong> {currentBill.address}
            </p>
            <p>
              <strong>Category:</strong> {currentBill.category}
            </p>
            <label>
              Bill Amount:
              <input
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
              />
            </label>
            <label>
              Due Date:
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </label>
            <button onClick={handleBillSubmit} className="submit-btn_1">
              Update Bill
            </button>
            <button onClick={handleClosePopup} className="close-btn_1">
              ✖
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Data;
