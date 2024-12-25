import { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";
import "./Payment_1.css";
import Navbar_1 from "./Navbar_1.jsx";

function Payment_1() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedData, setCompletedData] = useState([]);
  const [billData, setBillData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentBill, setCurrentBill] = useState({});
  const [billAmount, setBillAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState(""); // For managing status

  useEffect(() => {
    fetchCompletedData();
    fetchBillData();
  }, []);

  const fetchCompletedData = () => {
    setLoading(true);
    axios
      .get(
        "https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/LeaseEase/MaintainanceData.json"
      )
      .then((response) => {
        const fetchedData = response.data || {};
        const filteredData = Object.keys(fetchedData)
          .map((key, index) => ({
            id: key,
            number: index + 1,
            ...fetchedData[key],
          }))
          .filter((item) => item.status === "Completed");
        setCompletedData(filteredData);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      });
  };

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
      })
      .catch(() => {
        setError("Failed to fetch bill data.");
      });
  };

  const handleGenerateBill = (item) => {
    const existingBill = billData.find(bill => bill.name === item.name);
    if (existingBill) {
      alert("Bill has already been generated for this user.");
      return;
    }

    setCurrentBill(item);
    setBillAmount(item.amount);
    setDueDate(item.dueDate);
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
        fetchBillData();
        handleClosePopup();
      })
      .catch(() => {
        alert("Failed to update bill.");
      });
  };

  return (
    <>

      <Navbar_1 />
      <div className="Payment_1">
        <h1>Payment Dashboard</h1>
        {loading ? (
          <p className="loading_1">Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : completedData.length > 0 ? (
          <div className="card-container">
            {completedData.map((item) => (
              <div className="card" key={item.id}>
                <div className="card-content">
                  <h3>{item.name || "No Name"}</h3>
                  <p><strong>Address:</strong> {item.address || "No Address"}</p>
                  <p><strong>Category:</strong> {item.category || "No Category"}</p>
                  <p><strong>Urgency:</strong> {item.urgency || "Unknown"}</p>
                  <p><strong>Description:</strong> {item.description || "No Description"}</p>
                  <button
                    onClick={() => handleGenerateBill(item)}
                    className="generate-bill-btn"
                    disabled={billData.some(bill => bill.name === item.name)} // Disable if bill exists
                  >
                    Generate Bill
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No Completed Maintenance Data Available.</p>
        )}
      </div>

      {showPopup && (
        <div className="popup">
          <div className="bill-form">
            <h2>Generate Bill</h2>
            <p><strong>Name:</strong> {currentBill.name}</p>
            <p><strong>Address:</strong> {currentBill.address}</p>
            <p><strong>Category:</strong> {currentBill.category}</p>
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
            <button onClick={handleBillSubmit} className="submit-btns">Generate Bill</button>
            <button onClick={handleClosePopup} className="close-btns">✖</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Payment_1;