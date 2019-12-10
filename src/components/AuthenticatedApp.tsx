import { AppBar, Container, createStyles, Drawer, Hidden, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, NavLink, Route, Switch } from 'react-router-dom';

import { createConfiguration } from '../configuration/create-configuration';
import { getConfiguration } from '../configuration/get-configuration';
import { updateConfiguration } from '../configuration/update-configuration';
import { useAuth } from '../context/auth-context';
import { CollectionConfiguration } from '../models/collection-configuration';
import { CollectorConfiguration } from '../models/collector-configuration';
import { CollectionDetails } from './CollectionDetails';
import { Header } from './Header';
import { Setup } from './Setup';
import { SideBar } from './SideBar';

const drawerWidth = 240;

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: 'flex'
    },
    drawer: {
      [theme.breakpoints.up('lg')]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    appBar: {
      [theme.breakpoints.up('lg')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth
      }
    },
    drawerPaper: {
      width: drawerWidth
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
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
  const [configuration, setConfiguration] = useState<CollectorConfiguration | null>(null);

  useEffect(() => {
    async function getConfig(): Promise<CollectorConfiguration> {
      let config = await getConfiguration();

      if (config) {
        return config;
      }

      const configId = await createConfiguration();
      return { fileId: configId, collections: [] };
    }

    async function setConfig() {
      const config = await getConfig();
      setConfiguration(config);
    }

    setConfig();
  }, []);

  async function handleSetupCompleted(spreadsheetId: string, spreadsheetName: string) {
    if (!configuration) {
      return;
    }

    const newCollection: CollectionConfiguration = {
      id: spreadsheetId,
      sheetName: spreadsheetName
    };
    const updatedConfiguration: CollectorConfiguration = {
      ...configuration,
      collections: [...configuration.collections, newCollection]
    };
    await updateConfiguration(updatedConfiguration.fileId, updatedConfiguration);
    setConfiguration(updatedConfiguration);
  }

  function Collections({ collections }: { collections: CollectionConfiguration[] }) {
    return (
      <>
        {collections.map(collection => (
          <NavLink to={'/collection/' + collection.id} key={collection.id}>
            {collection.sheetName}
          </NavLink>
        ))}
      </>
    );
  }

  return (
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
        <nav className={classes.drawer}>
          <Hidden lgUp implementation="css">
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper
              }}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
            >
              <SideBar collections={configuration ? configuration.collections : []}></SideBar>
            </Drawer>
          </Hidden>
          <Hidden mdDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper
              }}
              variant="permanent"
              open
            >
              <SideBar collections={configuration ? configuration.collections : []}></SideBar>
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Container maxWidth="lg">
            <Switch>
              <Route path="/collection/:id">
                <CollectionDetails configuration={configuration} />
              </Route>
              <Route path="/create-collection">
                <Setup accessToken={getAccessToken()} handleSetupCompleted={handleSetupCompleted} />
              </Route>
              <Route path="/">
                <Collections collections={configuration ? configuration.collections : []} />
              </Route>
            </Switch>
          </Container>
        </main>
      </Router>
    </div>
  );
}
