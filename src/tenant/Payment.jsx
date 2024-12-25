import { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";
import "./Payment.css";
import Navbar from "./Navbar";

function Payment() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billData, setBillData] = useState([]);

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

  return (
    <>
      <div>
        <Navbar />
        <div className="Payment">
        <h1>Payment Status</h1>
          {loading ? (
            <p className="loading">Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="bill">
              
              {billData.length > 0 ? (
                <div className="cards-container">
                  {billData.map((bill) => (
                    <div className="card" key={bill.id}>
                        <h3>{bill.name || "No Name"}</h3>
                        <p>
                          <strong>Address:</strong> {bill.address || "No Address"}
                        </p>
                        <p>
                          <strong>Category:</strong> {bill.category || "No Category"}
                        </p>
                        <p>
                          <strong>Amount:</strong> {bill.amount || "No Amount"}
                        </p>
                        <p>
                          <strong>Status:</strong> {bill.status || "Pending"}
                        </p>
                        <p>
                          <strong>Due Date:</strong> {bill.dueDate || "No Due Date"}
                        </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No Bill Data Available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Payment;