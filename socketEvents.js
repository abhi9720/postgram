module.exports = function (io) {
	console.log(io.req);
	io.on('connection', (socket) => {
		console.log('a user connected.');

		socket.on('addUser', (userId) => {
			console.log('Adding new user ');
			console.log(userId, socket.id);
			addUser(userId, socket.id);
			io.emit('getUsers', users); // this is send to everyone  now get this on client side we should socket.on('getUsers')
			console.log('-----------online users ----------------------');
			console.log(users);
		});

		//send and get message
		socket.on('sendMessage', ({ senderId, receiverId, text }) => {
			const user = getUser(receiverId);

			console.log(`user : ${user}   senderId : ${senderId}  receiverId : ${receiverId} text : ${text} `);

			if (user) {
				io.to(user.socketId).emit('getMessage', {
					senderId,
					text,
				});
			} else {
				console.log('User is offline ');
			}
		});

		// to implement send friend request
		// socket.on('sendFriendRequest', ({ senderId, receiverId }) => {
		// 	console.log('request to send friendrequest');
		// 	const user = getUser(receiverId);
		// 	console.log(receiverId);
		// 	if (user) {
		// 		console.log(user.socketId);
		// 		console.log(users);
		// 		io.emit('getFriendRequest', {
		// 			senderId,
		// 		});
		// 	}
		// });

		socket.on('sendFriendRequest', ({ senderId, receiverId }) => {
			const user = getUser(receiverId);
			console.log('------------------------ SENDING FRIEND REQUEST ------------------------------');
			console.log('getting friend request ');
			console.log(receiverId);
			if (user) {
				console.log(
					'---------' + user.socketId + '-------------------------------------' + senderId + '--------------'
				);

				console.log(senderId + ' ---> ' + receiverId);
				io.to(user.socketId).emit('getFriendRequest', {
					senderId,
				});
			} else {
				console.log('User is offline ');
			}
		});

		//when disconnect
		socket.on('disconnect', () => {
			console.log('a user disconnected!');
			removeUser(socket.id); // remover user
			io.emit('getUsers', users); // set new online users
		});
	});

	let users = [];

	const addUser = (userId, socketId) => {
		!users.some((user) => user.userId === userId) && users.push({ userId, socketId });
		console.log('new user push with id ' + userId);
		console.log(users);
	};

	const removeUser = (socketId) => {
		users = users.filter((user) => user.socketId !== socketId);
	};

	const getUser = (userId) => {
		return users.find((user) => user.userId === userId);
	};
};
