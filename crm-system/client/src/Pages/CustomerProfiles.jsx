import React, { useEffect, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import Customers from "../components/Customers";
import * as customerService from "../services/customers";

export default function CustomerProfiles() {
  const { theme } = useTheme();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    notes: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const load = async (q) => {
    setLoading(true);
    setError(null);
    try {
      const res = await customerService.fetchCustomers(q);
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

  const doSearch = async () => {
    await load(searchTerm && searchTerm.trim() ? searchTerm.trim() : undefined);
  };

  const clearSearch = async () => {
    setSearchTerm("");
    await load();
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", email: "", company: "", phone: "", notes: "" });
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      name: c.name || "",
      email: c.email || "",
      company: c.company || "",
      phone: c.phone || "",
      notes: c.notes || "",
    });
    setShowForm(true);
  };

  const onDelete = async (c) => {
    if (!confirm(`Delete ${c.name}? This cannot be undone.`)) return;
    try {
      await customerService.deleteCustomer(c._id);
      setCustomers((prev) => prev.filter((p) => p._id !== c._id));
    } catch (err) {
      console.error("delete customer", err);
      alert("Failed to delete customer");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const res = await customerService.updateCustomer(editing._id, form);
        setCustomers((prev) =>
          prev.map((p) => (p._id === res.data._id ? res.data : p))
        );
      } else {
        const res = await customerService.createCustomer(form);
        setCustomers((prev) => [res.data, ...prev]);
      }
      setShowForm(false);
    } catch (err) {
      console.error("save customer", err);
      alert(err?.response?.data?.message || "Failed to save");
    }
  };

  const handleDownload = async () => {
    try {
      await customerService.exportCustomers();
    } catch (err) {
      console.error("export customers", err);
      alert("Failed to export customers");
    }
  };

  const card = {
    padding: theme.spacing.lg,
    borderRadius: theme.radii.large,
    background: theme.glassCard?.background || theme.colors.surface,
    border: theme.glassCard?.border || `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.card,
  };

  return (
    <div
      style={{
        padding: theme.spacing.lg,
        maxWidth: 1000,
        margin: "0 auto",
        color: theme.colors.text,
      }}
    >
      <h2
        style={{
          marginTop: 0,
          fontSize: theme.typography.fontSizes.xl,
          fontWeight: 700,
          color: theme.colors.primary,
        }}
      >
        Customer Profiles
      </h2>
      <p style={{ color: theme.colors.subtleText, marginTop: -8 }}>
        Manage customers — add, edit, or remove customer records.
      </p>

      <div style={{ ...card, marginTop: theme.spacing.md }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              aria-label="Search customers"
              placeholder="Search customers"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  doSearch();
                }
              }}
              style={{
                padding: theme.spacing.sm,
                borderRadius: theme.radii.medium,
                border: `1px solid ${theme.colors.border}`,
                minWidth: 220,
                background: theme.colors.surface,
              }}
            />
            <button
              onClick={doSearch}
              style={{
                padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                borderRadius: theme.radii.medium,
                border: "1px solid " + theme.colors.border,
                background: theme.button.background,
                color: theme.button.color,
                cursor: "pointer",
              }}
            >
              Search
            </button>
            <button
              onClick={clearSearch}
              style={{
                padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                borderRadius: theme.radii.medium,
                border: "1px solid " + theme.colors.border,
                background: "transparent",
                color: theme.colors.subtleText,
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleDownload}
              style={{
                padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                borderRadius: theme.radii.medium,
                border: "1px solid " + theme.colors.border,
                background: "transparent",
                color: theme.colors.text,
                cursor: "pointer",
              }}
            >
              Download
            </button>
            <button
              onClick={openAdd}
              style={{
                padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
                borderRadius: theme.radii.medium,
                border: "none",
                background: theme.button.background,
                color: theme.button.color,
                cursor: "pointer",
              }}
            >
              Add Customer
            </button>
          </div>
        </div>

        <div style={{ marginTop: theme.spacing.md }}>
          {loading && <div>Loading customers...</div>}
          {error && <div style={{ color: theme.colors.danger }}>{error}</div>}

          {!loading && (
            <Customers
              customers={customers}
              onEdit={openEdit}
              onDelete={onDelete}
              theme={theme}
            />
          )}
        </div>
      </div>

      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 40,
          }}
        >
          <form
            onSubmit={onSubmit}
            style={{
              width: 640,
              padding: theme.spacing.lg,
              borderRadius: theme.radii.large,
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: 700 }}>
                {editing ? "Update Customer" : "Add Customer"}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: theme.colors.subtleText,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>

            <div
              style={{
                marginTop: theme.spacing.md,
                display: "grid",
                gap: theme.spacing.sm,
              }}
            >
              <input
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  padding: theme.spacing.sm,
                  borderRadius: theme.radii.medium,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
              <input
                required
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{
                  padding: theme.spacing.sm,
                  borderRadius: theme.radii.medium,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
              <input
                placeholder="Company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                style={{
                  padding: theme.spacing.sm,
                  borderRadius: theme.radii.medium,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={{
                  padding: theme.spacing.sm,
                  borderRadius: theme.radii.medium,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                style={{
                  padding: theme.spacing.sm,
                  borderRadius: theme.radii.medium,
                  border: `1px solid ${theme.colors.border}`,
                  minHeight: 80,
                }}
              />

              <div
                style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
              >
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                    borderRadius: theme.radii.medium,
                    border: "1px solid " + theme.colors.border,
                    background: "transparent",
                    color: theme.colors.subtleText,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                    borderRadius: theme.radii.medium,
                    border: "none",
                    background: theme.button.background,
                    color: theme.button.color,
                  }}
                >
                  {editing ? "Save" : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
