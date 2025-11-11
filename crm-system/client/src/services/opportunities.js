import api from "./api";

// Fetch all opportunities
export async function fetchOpportunities() {
  const res = await api.get("/opportunities");
  return res.data;
}

// Create new opportunity
export async function createOpportunity(payload) {
  const res = await api.post("/opportunities", payload);
  return res.data.data;
}

// Update opportunity
export async function updateOpportunity(id, payload) {
  const res = await api.put(`/opportunities/${id}`, payload);
  return res.data.data;
}

// Update opportunity stage (for drag & drop)
export async function updateOpportunityStage(id, stage, order) {
  const res = await api.put(`/opportunities/${id}/stage`, { stage, order });
  return res.data.data;
}

// Delete opportunity
export async function deleteOpportunity(id) {
  const res = await api.delete(`/opportunities/${id}`);
  return res.data.data;
}

export default {
  fetchOpportunities,
  createOpportunity,
  updateOpportunity,
  updateOpportunityStage,
  deleteOpportunity,
};
