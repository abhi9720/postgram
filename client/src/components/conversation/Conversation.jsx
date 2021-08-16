import axios from 'axios';
import { useEffect, useState } from 'react';
import './conversation.css';

export default function Conversation({ conversation, currentuser, Online }) {
	const [user, setUser] = useState(null);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;

	useEffect(() => {
		const friendId = conversation.members.find((m) => m !== currentuser._id);
		console.log(`Friend Id :  ${friendId}`);

		const getUser = async () => {
			try {
				const res = await axios('/user?userId=' + friendId);
				setUser(res.data);
			} catch (err) {
				console.log(err);
			}
		};
		getUser();
	}, [currentuser, conversation]);

	return (
		<div className="conversation">
			<div className="ConversationUser">
				<img
					className="conversationImg"
					src={
						user?.profilePicture
							? user.profilePicture.replace('/upload', '/upload/w_230,h_250')
							: PF + 'person/noAvatar.png'
					}
					alt=""
				/>

				{Online.includes(user?._id) && <span className="rightbarOnline"> </span>}
			</div>
			<span className="conversationName">{user?.username}</span>
		</div>
	);
}
