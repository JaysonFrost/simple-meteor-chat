import React from 'react'
import { Router, Route, Switch } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import App from '../../ui/containers/App'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ('typeface-karla')

const browserHistory = createBrowserHistory()

export const renderRoutes = () => (
	<MuiThemeProvider>
		<Router history={browserHistory}>
			<App />
		</Router>
	</MuiThemeProvider>
)