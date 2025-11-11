"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { fetchLeads, updateLead } from "../services/leads";
import LeadManagementController from "../services/LeadManagementController";
import * as leadService from "../services/leads";
import "./LeadManagement.css";

export default function LeadManagement() {
  const { theme } = useTheme();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reps, setReps] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchLeads();
      setLeads(res.data || []);
    } catch (err) {
      console.error("load leads", err);
      setError("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    setReps(LeadManagementController.getReps());
  }, []);

  const assign = async (leadId, repId) => {
    // Persist assignment to server so it's stored in MongoDB
    try {
      const rep =
        LeadManagementController.getReps().find((r) => r.id === repId) || null;
      const payload = {
        assignedTo: repId || undefined,
        assignedToName: rep ? rep.name : undefined,
      };

      // If repId is empty, clear assignment
      const updated = await updateLead(leadId, payload);
      // update local state with server response
      setLeads((prev) =>
        prev.map((l) => (l._id === updated._id ? updated : l))
      );
      // still keep local fallback storage so UI works offline
      LeadManagementController.assignLead(leadId, repId);
    } catch (err) {
      console.error("assign lead", err);
      alert("Failed to assign lead");
    }
  };

  const handleConvert = async (lead) => {
    const confirmed = window.confirm(
      `Convert "${lead.name}" to an opportunity?\n\n` +
        `This will create a new opportunity in the sales pipeline. ` +
        `The lead will be marked as converted.`
    );

    if (!confirmed) return;

    try {
      await leadService.convertLeadToOpportunity(lead._id, {
        issue: `Opportunity for ${lead.name}`,
        history: [],
      });

      alert(
        `✓ Successfully converted!\n\n` +
          `"${lead.name}" is now an opportunity in your sales pipeline.\n` +
          `Go to the Pipeline page to see it.`
      );

      // Reload leads to show updated status
      await load();
    } catch (err) {
      console.error("convert lead error:", err);
      const errorMsg = err.response?.data?.error || "Failed to convert lead";
      alert(`Failed to convert lead: ${errorMsg}`);
    }
  };

  // stages removed - no status updates

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
        Lead Management
      </h2>
      <p style={{ color: theme.colors.subtleText, marginTop: -8 }}>
        Assign leads to sales representatives and track progress.
      </p>

      <div style={{ ...card, marginTop: theme.spacing.md }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: 700 }}>Assignments</div>
          <div style={{ color: theme.colors.subtleText }}></div>
        </div>

        <div
          style={{
            marginTop: theme.spacing.md,
            display: "grid",
            gap: theme.spacing.md,
          }}
        >
          {loading && <div>Loading leads...</div>}
          {error && <div style={{ color: theme.colors.danger }}>{error}</div>}

          {!loading && leads.length === 0 && (
            <div style={{ color: theme.colors.subtleText }}>
              No leads available.
            </div>
          )}

          {leads.map((l) => (
            <div
              key={l._id}
              className="lm-card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: theme.typography.fontSizes.lg,
                  }}
                >
                  {l.name}
                </div>
                <div style={{ color: theme.colors.subtleText, marginTop: 4 }}>
                  {l.email} {l.source ? `• ${l.source}` : ""}
                </div>
                {l.notes && (
                  <div style={{ marginTop: theme.spacing.sm }}>{l.notes}</div>
                )}
                {/* stages removed - no status shown */}
              </div>

              <div
                style={{
                  width: 300,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <select
                  value={
                    l.assignedTo ||
                    LeadManagementController.getAssignment(l._id) ||
                    ""
                  }
                  onChange={(e) => assign(l._id, e.target.value)}
                  style={{
                    padding: theme.spacing.sm,
                    borderRadius: theme.radii.medium,
                    border: `1px solid ${theme.colors.border}`,
                    background: theme.colors.surface,
                  }}
                >
                  <option value="">Unassigned</option>
                  {reps.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <div style={{ display: "flex", gap: 8 }}>
                  {/* Convert button - only show if not converted */}
                  {!l.converted && (
                    <button
                      onClick={() => handleConvert(l)}
                      style={{
                        padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
                        borderRadius: theme.radii.medium,
                        border: "none",
                        background: "#27ae60",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Convert
                    </button>
                  )}

                  {/* Show badge if converted */}
                  {l.converted && (
                    <span
                      style={{
                        padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
                        borderRadius: theme.radii.medium,
                        background: "#95a5a6",
                        color: "#fff",
                        fontSize: theme.typography.fontSizes.sm,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ✓ Converted
                    </span>
                  )}

                  <button
                    onClick={load}
                    style={{
                      padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
                      borderRadius: theme.radii.medium,
                      border: "none",
                      background: theme.button.background,
                      color: theme.button.color,
                      cursor: "pointer",
                    }}
                  >
                    Refresh
                  </button>
                </div>

                <div
                  style={{
                    color: theme.colors.subtleText,
                    fontSize: theme.typography.fontSizes.sm,
                  }}
                >
                  Assigned to:{" "}
                  <strong>
                    {l.assignedToName ||
                      LeadManagementController.getAssignmentName(l._id)}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
