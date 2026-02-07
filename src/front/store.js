export const initialStore = () => {
  return {
    token: null,
    email: "",
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "login":
      return {
        ...store,
        email: action.payload.email,
      };

    case "logout":
      return {
        ...store,
        email: null,
      };
  }
}
