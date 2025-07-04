export const saveUser = (user) => {
  localStorage.setItem('docsign-user', JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem('docsign-user');
  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem('docsign-user');
};