import React from 'react';
import { NavLink } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Home } from '@material-ui/icons';

const MessengerNavbar = () => {
	return (
		<AppBar position="static">
			<Toolbar>
				<NavLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
					<span className="HomeBack">
						<Home style={{ fontSize: 30 }} />
					</span>
				</NavLink>

				<span className="logo">Messenger </span>
			</Toolbar>
		</AppBar>
	);
};

export default MessengerNavbar;
