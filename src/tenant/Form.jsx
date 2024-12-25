import { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";
import "./Form.css";
import Navbar from "./Navbar";

function Form() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    category: "",
    urgency: "",
    description: "",
    file: null,
  });

  const [pendingData, setPendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  useEffect(() => {
    fetchPendingData();
  }, []);

  const fetchPendingData = () => {
    setLoading(true);
    axios
      .get(
        "https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/LeaseEase/MaintainanceData.json"
      )
      .then((response) => {
        const fetchedData = response.data || {};
        const filteredData = Object.keys(fetchedData)
          .map((key) => ({
            id: key,
            ...fetchedData[key],
          }))
          .filter((item) => item.status === "Pending");
        setPendingData(filteredData);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      address: formData.address,
      category: formData.category,
      urgency: formData.urgency,
      description: formData.description,
      status: "Pending",
    };

    if (formData.file) {
      const file = formData.file;
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileData = reader.result;
        data.file = fileData;
        sendDataToFirebase(data);
      };
      reader.readAsDataURL(file);
    } else {
      sendDataToFirebase(data);
    }
  };

  const sendDataToFirebase = async (data) => {
    try {
      if (editId) {
        await axios.put(
          `https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/LeaseEase/MaintainanceData/${editId}.json`,
          data
        );
        setEditId(null);
        alert("Maintenance request updated successfully!");
      } else {
        await axios.post(
          "https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/LeaseEase/MaintainanceData.json",
          data
        );
        alert("Maintenance request submitted successfully!");
      }

      // Reset the form data and hide the form
      setFormData({
        name: "",
        address: "",
        category: "",
        urgency: "",
        description: "",
        file: null,
      });
      setShowForm(false); // Hide form after submission
      fetchPendingData(); // Refetch pending data after submission
    } catch (error) {
      console.error("Error sending data to Firebase:", error);
      alert("An error occurred while submitting the request.");
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      name: item.name || "",
      address: item.address || "",
      category: item.category || "",
      urgency: item.urgency || "",
      description: item.description || "",
      file: item.file || null,
    });
    setShowForm(true); 
  };

  return (
    <>
      <Navbar />
      <div className="Pending">
        <h1>Pending Requests</h1>
        <div className="btn">
        <button
          className="request-btn"
          onClick={() => {
            setEditId(null);
            setFormData({
              name: "",
              address: "",
              category: "",
              urgency: "",
              description: "",
              file: null,
            });
            setShowForm(true); 
          }}
        >
          New Request
        </button>
        </div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : pendingData.length > 0 ? (
          <div className="cards-container">
            {pendingData.map((item) => (
              <div key={item.id} className="card">
                <h3>{item.name || "No Name"}</h3>
                <p><strong>Address:</strong> {item.address || "No Address"}</p>
                <p><strong>Category:</strong> {item.category || "No Category"}</p>
                <p><strong>Urgency:</strong> {item.urgency || "Unknown"}</p>
                <p><strong>Description:</strong> {item.description || "No Description"}</p>
                <div className="attachment">
                  {item.file ? (
                    <a href={item.file} target="_blank" rel="noopener noreferrer">
                      View Attachment
                    </a>
                  ) : (
                    "No File"
                  )}
                </div>
                <button
                  className="edit-bttn"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending maintenance requests.</p>
        )}


      </div>

      {showForm && (
        <div className="Form">
          <h1>Maintenance Form</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </label>

            <label>
              Address:
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
            </label>

            <label>
              Category:
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              >
                <option value="">Select</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="General">General</option>
              </select>
            </label>

            <label>
              Urgency:
              <select
                value={formData.urgency}
                onChange={(e) =>
                  setFormData({ ...formData, urgency: e.target.value })
                }
                required
              >
                <option value="">Select</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>

            <label>
              Description:
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </label>

            <label>
              Attach File:
              <input
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, file: e.target.files[0] })
                }
              />
            </label>

            <button className="submit-btns" type="submit">
              {editId ? "Update" : "Submit"}
            </button>
          </form>
          <button className="close-btns" onClick={() => setShowForm(false)}>
            ✖
          </button>
        </div>
      )}
    </>
  );
}

export default Form;