const {
  addUser,
  removeUser,
  getPlayersInGame,
  getAllUsers,
} = require("./helpers/user");
module.exports = function (server) {
  const io = require("socket.io")(server, {
    pingTimeout: 60000,
    pingInterval: 30000,
  });
  var gamesessionNSP = io.of("/gamesession");
  gamesessionNSP.on("connection", (socket) => {
    /****************************************************
     ********************* JOIN **************************
     *****************************************************/
    socket.on("join", ({ profile, session }, callback) => {
      console.log("user joined!");
      const { error, user } = addUser({
        id: socket.id,
        name: profile.gamename,
        session: session._id,
      });
      if (error) return callback({ error });
      socket.join(user.session, () => {
        gamesessionNSP.to(user.session).emit("sessionData", {
          session: user.session,
          players: getPlayersInGame(user.session),
        });
      });
      callback();
    });
    /****************************************************
     ********************* DISCONNECT ********************
     *****************************************************/
    socket.on("disconnect", () => {
      console.log("user disconnected!");
      const user = removeUser(socket.id);

      if (user)
        gamesessionNSP.to(user.session).emit("sessionData", {
          session: user.session,
          players: getPlayersInGame(user.session),
        });
    });
  });
};
