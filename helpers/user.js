const users = [];
/************** ADD USER **********************/
const addUser = ({ id, name, session }) => {
  const exists = users.find(
    (user) => user.session === session && user.id === id
  );

  if (exists) return { error: "Session Error: User already registered!" };

  const user = { id, name, session };
  users.push(user);

  // console.log(users);
  return { user };
};
/************** REMOVE USER **********************/
const removeUser = (id) => {
  const ind = users.findIndex((user) => user.id === id);
  if (ind !== -1) {
    return users.splice(ind, 1)[0];
  }
};
/************** GET USERS IN SESSION**********************/
const getPlayersInGame = (session) =>
  users.filter((user) => user.session === session);

/************** GET USERS ARRAY**********************/
const getAllUsers = () => {
  return users;
};

module.exports = { addUser, removeUser, getPlayersInGame, getAllUsers };
