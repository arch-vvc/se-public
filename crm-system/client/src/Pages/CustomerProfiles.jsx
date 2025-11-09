import React, { useEffect, useState } from "react";

const CustomerProfiles = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Placeholder: replace with real fetch to your API
    const fakeFetch = () =>
      new Promise((res) =>
        setTimeout(
          () =>
            res([
              { id: 1, name: "Alice Johnson", email: "alice@example.com" },
              { id: 2, name: "Bob Smith", email: "bob@example.com" },
            ]),
          600
        )
      );

    setLoading(true);
    fakeFetch()
      .then((data) => setCustomers(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="customer-profiles-page" style={{ padding: 20 }}>
      <header style={{ marginBottom: 16 }}>
        <h1>Customer Profiles</h1>
        <p className="muted">View and search your customer list.</p>
      </header>

      <div style={{ marginBottom: 12 }}>
        <input
          type="search"
          placeholder=""
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "8px 12px",
            width: "100%",
            maxWidth: 400,
            boxSizing: "border-box",
          }}
        />
      </div>

      {loading ? (
        <p>Loading customers…</p>
      ) : filtered.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {filtered.map((c) => (
            <li
              key={c.id}
              style={{
                padding: 12,
                border: "1px solid #e0e0e0",
                borderRadius: 6,
                marginBottom: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{c.name}</strong>
                <div style={{ fontSize: 14, color: "#555" }}>{c.email}</div>
              </div>
              <div>
                <button style={{ marginRight: 8 }}>View</button>
                <button>Message</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default CustomerProfiles;