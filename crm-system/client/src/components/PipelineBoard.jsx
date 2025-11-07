import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

// Inject Roboto Mono font
const robotoMono = document.createElement('link')
robotoMono.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap'
robotoMono.rel = 'stylesheet'
document.head.appendChild(robotoMono)

const stageColors = {
  new: '#e3f2fd',
  inProgress: '#fffde7',
  escalated: '#ffebee',
  resolved: '#e8f5e9',
}

const initialData = {
  stages: {
    new: { id: 'new', title: 'New', opportunityIds: ['cust-1', 'cust-2'] },
    inProgress: { id: 'inProgress', title: 'In Progress', opportunityIds: ['cust-3'] },
    escalated: { id: 'escalated', title: 'Escalated', opportunityIds: [] },
    resolved: { id: 'resolved', title: 'Resolved', opportunityIds: [] },
  },
  opportunities: {
    'cust-1': {
      id: 'cust-1',
      name: 'Alice Johnson',
      issue: 'Billing issue',
      contact: 'alice.j@example.com',
      history: ['Order #1234 - $250', 'Order #1256 - $180'],
    },
    'cust-2': {
      id: 'cust-2',
      name: 'Bob Singh',
      issue: 'Login failure',
      contact: 'bob.s@example.com',
      history: ['Order #1201 - $90'],
    },
    'cust-3': {
      id: 'cust-3',
      name: 'Chitra Rao',
      issue: 'Feature request',
      contact: 'chitra.r@example.com',
      history: ['Order #1199 - $300', 'Order #1220 - $150'],
    },
  },
  stageOrder: ['new', 'inProgress', 'escalated', 'resolved'],
}

export default function PipelineBoard() {
  const [data, setData] = useState(initialData)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return

    const start = data.stages[source.droppableId]
    const finish = data.stages[destination.droppableId]

    if (start === finish) {
      const newOpportunityIds = Array.from(start.opportunityIds)
      newOpportunityIds.splice(source.index, 1)
      newOpportunityIds.splice(destination.index, 0, draggableId)

      const newStage = { ...start, opportunityIds: newOpportunityIds }
      setData({
        ...data,
        stages: { ...data.stages, [newStage.id]: newStage },
      })
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
          gap: '20px',
          padding: '20px',
          background: '#f0f4f8',
          minHeight: '100vh',
          fontFamily: '"Roboto Mono", monospace'
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
                      background: stageColors[stageId],
                      borderRadius: '12px',
                      boxShadow: 'inset 0 0 0 1px #ccc, 0 4px 12px rgba(0,0,0,0.1)',
                      flex: 1,
                      padding: '16px',
                      minWidth: '240px',
                      transition: 'background 0.3s ease'
                    }}
                  >
                    <h2 style={{
                      textAlign: 'center',
                      color: '#333',
                      fontSize: '1.2rem',
                      marginBottom: '12px'
                    }}>{stage.title}</h2>
                    {opportunities.map((opp, index) => (
                      <Draggable draggableId={opp.id} index={index} key={opp.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => setSelectedCustomer(opp)}
                            style={{
                              padding: '12px',
                              margin: '10px 0',
                              background: snapshot.isDragging ? '#a5d6a7' : '#ffffff',
                              border: '1px solid #ddd',
                              borderRadius: '8px',
                              boxShadow: snapshot.isDragging ? '0 6px 12px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
                              color: '#222',
                              cursor: 'pointer',
                              transition: 'background 0.2s ease',
                              ...provided.draggableProps.style
                            }}
                          >
                            <div style={{ fontWeight: 700 }}>{opp.name}</div>
                            <div style={{ fontSize: '0.85rem', color: '#555' }}>{opp.issue}</div>
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

      {/* Modal Overlay */}
      {selectedCustomer && (
        <div style={{
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
          <div style={{
            background: '#fff',
            padding: '24px',
            borderRadius: '12px',
            width: '320px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            fontFamily: '"Roboto Mono", monospace'
          }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '12px' }}>{selectedCustomer.name}</h3>
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
                marginTop: '16px',
                padding: '8px 12px',
                background: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
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
