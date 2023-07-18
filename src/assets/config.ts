export const API_URL = "https://peak-tracker-5856f-default-rtdb.firebaseio.com";
export const SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${
  import.meta.env.VITE_API_KEY
}`;
export const LOGIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${
  import.meta.env.VITE_API_KEY
}`;
