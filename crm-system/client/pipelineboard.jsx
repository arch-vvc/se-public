import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

// Initial dummy opportunities
const initialData = {
  stages: {
    prospecting: { id: 'prospecting', title: 'Prospecting', opportunityIds: ['opp-1', 'opp-2'] },
    qualification: { id: 'qualification', title: 'Qualification', opportunityIds: ['opp-3'] },
    proposal: { id: 'proposal', title: 'Proposal', opportunityIds: [] },
    closed: { id: 'closed', title: 'Closed', opportunityIds: [] },
  },
  opportunities: {
    'opp-1': { id: 'opp-1', name: 'Acme Corp', value: '$25,000' },
    'opp-2': { id: 'opp-2', name: 'Globex Inc', value: '$10,000' },
    'opp-3': { id: 'opp-3', name: 'Soylent Co', value: '$40,000' },
  },
  stageOrder: ['prospecting', 'qualification', 'proposal', 'closed'],
}

export default function PipelineBoard() {
  const [data, setData] = useState(initialData)

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

    // Moving between stages
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
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{
        display: 'flex',
        gap: '20px',
        padding: '20px',
        background: '#f5f7fa',
        minHeight: '100vh',
        fontFamily: 'Inter, sans-serif'
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
                    background: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    flex: 1,
                    padding: '10px',
                    minWidth: '220px'
                  }}
                >
                  <h2 style={{ textAlign: 'center', color: '#333' }}>{stage.title}</h2>
                  {opportunities.map((opp, index) => (
                    <Draggable draggableId={opp.id} index={index} key={opp.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            userSelect: 'none',
                            padding: '12px',
                            margin: '8px 0',
                            borderRadius: '6px',
                            background: snapshot.isDragging ? '#4f46e5' : '#e0e7ff',
                            color: snapshot.isDragging ? '#fff' : '#111',
                            boxShadow: snapshot.isDragging ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                            ...provided.draggableProps.style
                          }}
                        >
                          <strong>{opp.name}</strong>
                          <div style={{ fontSize: '0.9em', color: snapshot.isDragging ? '#fff' : '#555' }}>
                            {opp.value}
                          </div>
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
  )
}