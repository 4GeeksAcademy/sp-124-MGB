export const initialStore = () => {
  return {
    changes: false,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set-changes":
      return {
        ...store,
        changes: action.payload,
      };
  }
}
