import { Container } from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { useAuth } from '../../context/auth-context';
import { ConfigurationProvider } from '../../context/configuration-context';
import { Routes } from './Routes';
import { useAuthenticatedAppStyles } from './AuthenticatedAppStyles';
import { Header } from './Header';
import { SideBar } from './SideBar';

export function AuthenticatedApp() {
  const classes = useAuthenticatedAppStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const { signOut } = useAuth();

  return (
    <ConfigurationProvider>
      <div className={classes.root}>
        <Router>
          <Header handleLogout={signOut} handleMenuIconClick={handleDrawerToggle}></Header>
          <SideBar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}></SideBar>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Container maxWidth="lg">
              <Routes />
            </Container>
          </main>
        </Router>
      </div>
    </ConfigurationProvider>
  );
}
