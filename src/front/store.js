export const initialStore = () => {
  return {
    admin: false,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set-admin":
      return {
        ...store,
        admin: action.payload,
      };
  }
}
