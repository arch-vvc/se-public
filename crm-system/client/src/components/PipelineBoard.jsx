 'use client'

import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useTheme } from '../theme/ThemeContext'

const stageColors = (theme) => ({
  new: theme.glassCard?.background || theme.colors.surface,
  inProgress: theme.glassCard?.background || theme.colors.surface,
  escalated: theme.glassCard?.background || theme.colors.surface,
  resolved: theme.glassCard?.background || theme.colors.surface
})

const initialData = {
  stages: {
    new: { id: 'new', title: 'New', opportunityIds: ['cust-1', 'cust-2', 'cust-4'] },
    inProgress: { id: 'inProgress', title: 'In Progress', opportunityIds: ['cust-3', 'cust-5'] },
    escalated: { id: 'escalated', title: 'Escalated', opportunityIds: ['cust-6'] },
    resolved: { id: 'resolved', title: 'Resolved', opportunityIds: ['cust-7'] },
  },
  opportunities: {
    'cust-1': { id: 'cust-1', name: 'Alice Johnson', issue: 'Billing issue', contact: 'alice.j@example.com', history: ['Order #1234 - $250', 'Order #1256 - $180'] },
    'cust-2': { id: 'cust-2', name: 'Bob Singh', issue: 'Login failure', contact: 'bob.s@example.com', history: ['Order #1201 - $90'] },
    'cust-3': { id: 'cust-3', name: 'Chitra Rao', issue: 'Feature request', contact: 'chitra.r@example.com', history: ['Order #1199 - $300', 'Order #1220 - $150'] },
    'cust-4': { id: 'cust-4', name: 'Daniel Kim', issue: 'Payment declined', contact: 'daniel.k@example.com', history: ['Order #1300 - $75'] },
    'cust-5': { id: 'cust-5', name: 'Elena Garcia', issue: 'Shipping delay', contact: 'elena.g@example.com', history: ['Order #1288 - $200', 'Order #1299 - $120'] },
    'cust-6': { id: 'cust-6', name: 'Farhan Ali', issue: 'Account locked', contact: 'farhan.a@example.com', history: ['Order #1277 - $95'] },
    'cust-7': { id: 'cust-7', name: 'Grace Lee', issue: 'Refund processed', contact: 'grace.l@example.com', history: ['Order #1310 - $150'] },
  },
  stageOrder: ['new', 'inProgress', 'escalated', 'resolved'],
}

export default function PipelineBoard({ onExport }) {
  const { theme } = useTheme()
  const [data, setData] = useState(initialData)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // Send opportunities with stage info to parent
  useEffect(() => {
    if (onExport) {
      const allOpps = []
      data.stageOrder.forEach(stageId => {
        const stage = data.stages[stageId]
        stage.opportunityIds.forEach(id => {
          const opp = data.opportunities[id]
          allOpps.push({ ...opp, status: stage.title })
        })
      })
      onExport(allOpps)
    }
  }, [data, onExport])

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const start = data.stages[source.droppableId]
    const finish = data.stages[destination.droppableId]

    if (start === finish) {
      const newOpportunityIds = Array.from(start.opportunityIds)
      newOpportunityIds.splice(source.index, 1)
      newOpportunityIds.splice(destination.index, 0, draggableId)
      const newStage = { ...start, opportunityIds: newOpportunityIds }
      setData({ ...data, stages: { ...data.stages, [newStage.id]: newStage } })
      return
    }

    const startOpportunityIds = Array.from(start.opportunityIds)
    startOpportunityIds.splice(source.index, 1)
    const newStart = { ...start, opportunityIds: startOpportunityIds }

    const finishOpportunityIds = Array.from(finish.opportunityIds)
    finishOpportunityIds.splice(destination.index, 0, draggableId)
    const newFinish = { ...finish, opportunityIds: finishOpportunityIds }

    setData({
      ...data,
      stages: {
        ...data.stages,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    })
  }

  return (
  <>
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{
        display: 'flex',
        gap: theme.spacing.lg,
        padding: theme.spacing.lg,
        background: theme.colors.surface,
        minHeight: 'auto',
        fontFamily: theme.typography.fontFamily,
        color: theme.colors.text
      }}>
        {data.stageOrder.map(stageId => {
          const stage = data.stages[stageId]
          const opportunities = stage.opportunityIds.map(id => data.opportunities[id])

          return (
            <Droppable droppableId={stage.id} key={stage.id}>
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
                    minWidth: '240px'
                  }}
                >
                  <h2 style={{ textAlign: 'center', color: theme.colors.primary, fontSize: theme.typography.fontSizes.lg, marginBottom: theme.spacing.md }}>
                    {stage.title}
                  </h2>
                  {opportunities.map((opp, index) => (
                    <Draggable draggableId={opp.id} index={index} key={opp.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => setSelectedCustomer(opp)}
                          style={{
                            padding: theme.spacing.md,
                            margin: `${theme.spacing.sm}px 0`,
                            background: snapshot.isDragging ? theme.colors.surface : (theme.glassCard?.background || theme.colors.surface),
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius: theme.radii.small,
                            boxShadow: snapshot.isDragging
                              ? theme.shadows.float
                              : theme.shadows.card,
                            cursor: 'pointer',
                            ...provided.draggableProps.style
                          }}
                        >
                          <div style={{ fontWeight: 700 }}>{opp.name}</div>
                          <div style={{ fontSize: theme.typography.fontSizes.sm, color: theme.colors.subtleText }}>{opp.issue}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )
        })}
      </div>
    </DragDropContext>

      {selectedCustomer && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setSelectedCustomer(null)}
      >
        <div
          style={{
            background: theme.colors.surface,
            padding: theme.spacing.lg,
            borderRadius: theme.radii.large,
            width: '320px',
            boxShadow: theme.shadows.float,
            fontFamily: theme.typography.fontFamily,
            color: theme.colors.text
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{ marginBottom: theme.spacing.md }}>{selectedCustomer.name}</h3>
          <p><strong>Contact:</strong> {selectedCustomer.contact}</p>
          <p><strong>Issue:</strong> {selectedCustomer.issue}</p>
          <p><strong>Order History:</strong></p>
          <ul>
            {selectedCustomer.history.map((order, idx) => (
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
              border: 'none',
              borderRadius: theme.radii.small,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    )}
  </>
)

}
