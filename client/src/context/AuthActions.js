export const LoginStart = (userCreadentials) => ({
	type: 'LOGIN_START',
});

export const LoginSuccess = (user) => ({
	type: 'LOGIN_SUCCESS',
	payload: user,
});

export const LoginFailing = (error) => ({
	type: 'LOGIN_FAILURE',
	payload: error,
});
export const LoginFailing = (logout) => ({
	type: 'LOGOUT_SUCCESS',
	payload: logout,
});

export const follow = (userId) => ({
	type: 'FOLLOW',
	payload: userId,
});

export const unfollow = (userId) => ({
	type: 'UNFOLLOW',
	payload: userId,
});
