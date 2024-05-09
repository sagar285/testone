const UserModel = require("./modals/user")
const socktIdToUserId = new Map();

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on("join_room", (chatId) => {
          // console.log("join roomm chat idddd",chatId)
          socket.join(chatId)
        })
    
        socket.on("leave_room", (chatId) => {
          socket.leave(chatId)
        })  
    
        // socket.on("join_chat", (userId) => {
        //   console.log("join user id ",userId)
        //   socket.join(userId)
        //   console.log(`User ${socket.id} join chat ${userId}`)
        // })
    
        // socket.on("leave_chat", (userId) => {
        //   socket.leave(userId)
        //   console.log(`User ${socket.id} leave chat ${userId}`)
        // })
    
        socket.on('is_typing', ({ roomId, userId }) => {
          // console.log("is_typing",userId)
          io.to(roomId).emit('user_typing', { userId })
        })
        
        socket.on('stop_typing', ({ roomId, userId }) => {
          io.to(roomId).emit('user_stopped', { userId })
        })
    
        socket.on('send_message', (data) => {
          io.to(data?.data?.chatId).emit("receive_message", data.data)
        })
    
        socket.on('user_online', async ({ userId }) => {
          try {
            const user = await UserModel.findById(userId)
            if (user) {
              user.online = true;
              await user.save();
              socktIdToUserId.set(socket.id, userId)
              io.emit('user_online', { userId: user._id, online: true })
              // console.log(userId, "+++user online success++++")
            }
          } catch (error) {
            console.log("error updating user status:", error)
          }
        })
    
        socket.on('disconnect', async () => {
          // console.log('Socket disconnected');
          const userId = socktIdToUserId.get(socket.id)
          if (userId) {
            try {
              const user = await UserModel.findById(userId)
              if (user) {
                user.online = false,
                  user.lastSeen = new Date();
                await user.save();
                io.emit('user_online', { userId: user._id, online: false, lastSeen: user.lastSeen })
                // console.log('user disconnected succesfully...!');
              }
            } catch (error) {
              console.log("error")
            }
          }
        })
        // socket.on("disconnect", () => {
        //   console.log("User Disconnected", socket.id);
        // });
    
      });
}