"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTheme } from "../theme/ThemeContext";
import * as opportunityService from "../services/opportunities";

const stageColors = (theme) => ({
  new: theme.glassCard?.background || theme.colors.surface,
  inProgress: theme.glassCard?.background || theme.colors.surface,
  escalated: theme.glassCard?.background || theme.colors.surface,
  resolved: theme.glassCard?.background || theme.colors.surface,
});

const stageMapping = {
  new: { id: "new", title: "New" },
  inProgress: { id: "inProgress", title: "In Progress" },
  escalated: { id: "escalated", title: "Escalated" },
  resolved: { id: "resolved", title: "Resolved" },
};

export default function PipelineBoard({ onExport }) {
  const { theme } = useTheme();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Load opportunities from database
  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const res = await opportunityService.fetchOpportunities();
      setOpportunities(res.data || []);
    } catch (err) {
      console.error("Failed to load opportunities:", err);
    } finally {
      setLoading(false);
    }
  };

  // Group opportunities by stage
  const getOpportunitiesByStage = (stage) => {
    return opportunities
      .filter((opp) => opp.stage === stage)
      .sort((a, b) => a.order - b.order);
  };

  // Export data to parent
  useEffect(() => {
    if (onExport) {
      const exportData = opportunities.map((opp) => ({
        ...opp,
        status: stageMapping[opp.stage]?.title || opp.stage,
      }));
      onExport(exportData);
    }
  }, [opportunities, onExport]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;

    // Get the opportunity being moved
    const movedOpp = opportunities.find((opp) => opp._id === draggableId);
    if (!movedOpp) return;

    // Update local state optimistically
    const newOpportunities = [...opportunities];
    const oppIndex = newOpportunities.findIndex(
      (opp) => opp._id === draggableId
    );
    newOpportunities[oppIndex] = {
      ...movedOpp,
      stage: destStage,
      order: destination.index,
    };

    // Reorder opportunities in destination stage
    const destOpps = newOpportunities.filter((opp) => opp.stage === destStage);
    destOpps.forEach((opp, idx) => {
      const oppIdx = newOpportunities.findIndex((o) => o._id === opp._id);
      newOpportunities[oppIdx] = { ...newOpportunities[oppIdx], order: idx };
    });

    setOpportunities(newOpportunities);

    // Save to backend
    try {
      await opportunityService.updateOpportunityStage(
        draggableId,
        destStage,
        destination.index
      );

      // Reload to ensure consistency
      await loadOpportunities();
    } catch (err) {
      console.error("Failed to update opportunity stage:", err);
      alert("Failed to update opportunity. Reloading...");
      await loadOpportunities();
    }
  };

  const handleDelete = async (opportunityId, opportunityName) => {
    const confirmed = window.confirm(
      `Delete "${opportunityName}"?\n\nThis cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await opportunityService.deleteOpportunity(opportunityId);

      // Remove from local state
      setOpportunities((prev) =>
        prev.filter((opp) => opp._id !== opportunityId)
      );
    } catch (err) {
      console.error("Failed to delete opportunity:", err);
      alert("Failed to delete opportunity. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: theme.spacing.lg, textAlign: "center" }}>
        Loading pipeline...
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: "flex",
            gap: theme.spacing.lg,
            padding: theme.spacing.lg,
            background: theme.colors.surface,
            minHeight: "auto",
            fontFamily: theme.typography.fontFamily,
            color: theme.colors.text,
          }}
        >
          {Object.keys(stageMapping).map((stageId) => {
            const stage = stageMapping[stageId];
            const stageOpportunities = getOpportunitiesByStage(stageId);

            return (
              <Droppable droppableId={stageId} key={stageId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      background: stageColors(theme)[stageId],
                      borderRadius: theme.radii.large,
                      boxShadow: theme.shadows.card,
                      flex: 1,
                      padding: theme.spacing.md,
                      minWidth: "240px",
                    }}
                  >
                    <h2
                      style={{
                        textAlign: "center",
                        color: theme.colors.primary,
                        fontSize: theme.typography.fontSizes.lg,
                        marginBottom: theme.spacing.md,
                      }}
                    >
                      {stage.title}
                    </h2>
                    {stageOpportunities.map((opp, index) => (
                      <Draggable
                        draggableId={opp._id}
                        index={index}
                        key={opp._id}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              padding: theme.spacing.md,
                              margin: `${theme.spacing.sm}px 0`,
                              background: snapshot.isDragging
                                ? theme.colors.surface
                                : theme.glassCard?.background ||
                                  theme.colors.surface,
                              border: `1px solid ${theme.colors.border}`,
                              borderRadius: theme.radii.small,
                              boxShadow: snapshot.isDragging
                                ? theme.shadows.float
                                : theme.shadows.card,
                              cursor: "pointer",
                              position: "relative",
                              ...provided.draggableProps.style,
                            }}
                          >
                            {/* Delete button in top-right corner */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click from firing
                                handleDelete(opp._id, opp.name);
                              }}
                              style={{
                                position: "absolute",
                                top: "6px",
                                right: "6px",
                                background: theme.colors.danger || "#e74c3c",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                width: "22px",
                                height: "22px",
                                cursor: "pointer",
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 0,
                                opacity: 0.8,
                                transition: "opacity 0.2s",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.opacity = "1")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.opacity = "0.8")
                              }
                            >
                              ×
                            </button>

                            {/* Card content - make clickable for details */}
                            <div onClick={() => setSelectedCustomer(opp)}>
                              <div
                                style={{
                                  fontWeight: 700,
                                  paddingRight: "28px",
                                }}
                              >
                                {opp.name}
                              </div>
                              <div
                                style={{
                                  fontSize: theme.typography.fontSizes.sm,
                                  color: theme.colors.subtleText,
                                }}
                              >
                                {opp.issue}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {selectedCustomer && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            style={{
              background: theme.colors.surface,
              padding: theme.spacing.lg,
              borderRadius: theme.radii.large,
              width: "320px",
              boxShadow: theme.shadows.float,
              fontFamily: theme.typography.fontFamily,
              color: theme.colors.text,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: theme.spacing.md }}>
              {selectedCustomer.name}
            </h3>
            <p>
              <strong>Contact:</strong> {selectedCustomer.contact}
            </p>
            <p>
              <strong>Issue:</strong> {selectedCustomer.issue}
            </p>
            <p>
              <strong>Order History:</strong>
            </p>
            <ul>
              {selectedCustomer.history?.map((order, idx) => (
                <li key={idx}>{order}</li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedCustomer(null)}
              style={{
                marginTop: theme.spacing.md,
                padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                background: theme.colors.primary,
                color: theme.colors.surface,
                border: "none",
                borderRadius: theme.radii.small,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
