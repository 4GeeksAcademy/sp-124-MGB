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
        token: action.payload.token,
        email: action.payload.email,
      };

    case "logout":
      return {
        ...store,
        token: null,
        email: null,
      };
  }
}
