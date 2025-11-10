// Simple client-side controller to manage sales representatives and assignments.
// Assignments are stored in localStorage to avoid any server changes (non-destructive).

const STORAGE_KEY = 'lead_assignments_v1'

const defaultReps = [
  { id: 'rep_alice', name: 'Alice Johnson' },
  { id: 'rep_bob', name: 'Bob Patel' },
  { id: 'rep_carla', name: 'Carla Gomez' }
]

function loadAssignments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch (err) {
    console.warn('Failed to load assignments', err)
    return {}
  }
}

function saveAssignments(map) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch (err) {
    console.warn('Failed to save assignments', err)
  }
}

export default {
  getReps() {
    return defaultReps
  },

  assignLead(leadId, repId) {
    const m = loadAssignments()
    if (!repId) {
      delete m[leadId]
    } else {
      m[leadId] = repId
    }
    saveAssignments(m)
  },

  getAssignment(leadId) {
    const m = loadAssignments()
    return m[leadId]
  },

  getAssignmentName(leadId) {
    const repId = this.getAssignment(leadId)
    if (!repId) return '—'
    const rep = defaultReps.find((r) => r.id === repId)
    return rep ? rep.name : repId
  }
}
