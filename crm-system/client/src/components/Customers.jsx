import React, { useEffect, useState } from "react";
import CustomerForm from "./CustomerForm";
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  importCustomers,
  exportCustomers,
} from "../services/customers";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null); // for CSV import

  // Fetch all customers
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCustomers();
      setCustomers(res.data || []);
    } catch (err) {
      console.error("load customers", err);
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Create new or update existing customer
  const handleSubmit = async (payload) => {
    try {
      if (editing) {
        const updated = await updateCustomer(editing._id, payload);
        setCustomers((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c))
        );
      } else {
        const created = await createCustomer(payload);
        setCustomers((prev) => [created, ...prev]);
      }
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error("submit customer", err);
      alert("Failed to save customer");
    }
  };

  const handleEdit = (c) => {
    setEditing(c);
    setShowForm(true);
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete customer ${c.name}?`)) return;
    try {
      await deleteCustomer(c._id);
      setCustomers((prev) => prev.filter((p) => p._id !== c._id));
    } catch (err) {
      console.error("delete customer", err);
      alert("Failed to delete");
    }
  };

  // ✅ Import customers from CSV
  const handleImport = async () => {
    if (!file) return alert("Please select a CSV file first!");
    try {
      await importCustomers(file);
      alert("Customers imported successfully!");
      load(); // refresh after import
    } catch (err) {
      console.error("import customers", err);
      alert("Import failed!");
    }
  };

  // ✅ Export customers to CSV
  const handleExport = async () => {
    try {
      await exportCustomers();
    } catch (err) {
      console.error("export customers", err);
      alert("Export failed!");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2>Customers</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowForm(true)}>Add Customer</button>
          <button onClick={load}>Refresh</button>

          {/* ✅ Import/Export UI */}
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginLeft: 8 }}
          />
          <button onClick={handleImport}>Import CSV</button>
          <button onClick={handleExport}>Export CSV</button>
        </div>
      </div>

      {showForm && (
        <div
          style={{
            marginTop: 12,
            marginBottom: 12,
            background: "#fff",
            padding: 12,
            borderRadius: 6,
          }}
        >
          <CustomerForm
            initialData={editing || {}}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div style={{ marginTop: 12 }}>
        {customers.length === 0 && !loading ? (
          <div>No customers yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {customers.map((c) => (
              <div
                key={c._id}
                style={{
                  padding: 12,
                  border: "1px solid #eee",
                  borderRadius: 6,
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "#555" }}>
                      {c.company || ""} {c.email ? `• ${c.email}` : ""}
                    </div>
                  </div>
                  <div>
                    <button onClick={() => handleEdit(c)} style={{ marginRight: 8 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(c)}>Delete</button>
                  </div>
                </div>
                {c.phone && <div style={{ marginTop: 8 }}>{c.phone}</div>}
                {c.address && (
                  <div style={{ marginTop: 4, fontSize: 13, color: "#666" }}>
                    {c.address}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
