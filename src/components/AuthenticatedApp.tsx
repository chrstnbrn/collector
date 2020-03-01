import { AppBar, Container, createStyles, makeStyles } from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { useAuth } from '../context/auth-context';
import { ConfigurationProvider } from '../context/configuration-context';
import { CollectionDetails } from './CollectionDetails';
import { Collections } from './Collections';
import { Header } from './Header';
import { Setup } from './Setup';
import { SideBar } from './SideBar';

const drawerWidth = 240;

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: 'flex',
      minHeight: '100vh',
      background: theme.palette.background.default
    },
    appBar: {
      [theme.breakpoints.up('lg')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth
      }
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      width: '100%',
      [theme.breakpoints.up('lg')]: {
        width: `calc(100% - ${drawerWidth}px)`
      }
    }
  })
);

export function AuthenticatedApp() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const { signIn, signOut, getAccessToken } = useAuth();

  return (
    <ConfigurationProvider>
      <div className={classes.root}>
        <Router>
          <AppBar position="fixed" className={classes.appBar}>
            <Header
              isLoggedIn={true}
              handleLogin={signIn}
              handleLogout={signOut}
              handleMenuIconClick={handleDrawerToggle}
            ></Header>
          </AppBar>
          <SideBar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}></SideBar>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Container maxWidth="lg">
              <Switch>
                <Route path="/collection/:id">
                  <CollectionDetails />
                </Route>
                <Route path="/create-collection">
                  <Setup accessToken={getAccessToken()} />
                </Route>
                <Route path="/">
                  <Collections />
                </Route>
              </Switch>
            </Container>
          </main>
        </Router>
      </div>
    </ConfigurationProvider>
  );
}
