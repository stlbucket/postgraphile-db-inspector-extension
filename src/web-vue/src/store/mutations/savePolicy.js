function savePolicy(state, payload) {
  state.isDirty = true
  const policies = state.policies.filter(p => p.name !== payload.policy.name);
  state.policies = [...policies, ...[payload.policy]].sort((a, b) => {
    return a.id - b.id;
  });
}

export default savePolicy;
