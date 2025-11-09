import React, { useEffect, useState } from "react";
import { useTheme } from '../theme/ThemeContext'
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
  const { theme } = useTheme()
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
    <div style={{ padding: theme.spacing.lg, color: theme.colors.text }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: theme.spacing.md,
        }}
      >
        <h2 style={{ color: theme.colors.primary }}>Customers</h2>
        <div style={{ display: "flex", gap: theme.spacing.sm }}>
          <button onClick={() => setShowForm(true)} style={{ borderRadius: theme.radii.small }}>Add Customer</button>
          <button onClick={load} style={{ borderRadius: theme.radii.small }}>Refresh</button>

          {/* ✅ Import/Export UI */}
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginLeft: theme.spacing.sm }}
          />
          <button onClick={handleImport} style={{ borderRadius: theme.radii.small }}>Import CSV</button>
          <button onClick={handleExport} style={{ borderRadius: theme.radii.small }}>Export CSV</button>
        </div>
      </div>

      {showForm && (
        <div
          style={{
            marginTop: theme.spacing.sm,
            marginBottom: theme.spacing.sm,
            background: theme.glassCard?.background || theme.colors.surface,
            padding: theme.spacing.md,
            borderRadius: theme.radii.medium,
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
      {error && <div style={{ color: theme.colors.danger }}>{error}</div>}

      <div style={{ marginTop: theme.spacing.md }}>
        {customers.length === 0 && !loading ? (
          <div style={{ color: theme.colors.subtleText }}>No customers yet.</div>
        ) : (
          <div style={{ display: "grid", gap: theme.spacing.sm }}>
            {customers.map((c) => (
              <div
                key={c._id}
                style={{
                  padding: theme.spacing.md,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radii.small,
                  background: theme.glassCard?.background || theme.colors.surface,
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
                    <div style={{ fontWeight: 600, color: theme.colors.primary }}>{c.name}</div>
                    <div style={{ fontSize: theme.typography.fontSizes.sm, color: theme.colors.subtleText }}>
                      {c.company || ""} {c.email ? `• ${c.email}` : ""}
                    </div>
                  </div>
                  <div>
                    <button onClick={() => handleEdit(c)} style={{ marginRight: theme.spacing.sm, borderRadius: theme.radii.small }}>Edit</button>
                    <button onClick={() => handleDelete(c)} style={{ borderRadius: theme.radii.small }}>Delete</button>
                  </div>
                </div>
                {c.phone && <div style={{ marginTop: theme.spacing.sm }}>{c.phone}</div>}
                {c.address && (
                  <div style={{ marginTop: theme.spacing.xs, fontSize: theme.typography.fontSizes.sm, color: theme.colors.subtleText }}>
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
