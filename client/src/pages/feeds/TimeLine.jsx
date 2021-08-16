import Feed from '../../components/feed/Feed.jsx';
import Topbar from '../../components/topbar/Topbar.jsx';

import './TimeLine.css';

const TimeLine = () => {
	return (
		<>
			<Topbar />
			<div className="feedsContainer">
				<Feed />
			</div>
		</>
	);
};

export default TimeLine;
