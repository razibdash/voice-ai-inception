export const routerAgent = async (state: any) => {
  // Always go to retriever first
  return {
    ...state,
    next: "retriever",
  };
};