import { Drawer, Hidden } from '@material-ui/core';
import React from 'react';

import { useConfiguration } from '../../context/configuration-context';
import { useAuthenticatedAppStyles } from './AuthenticatedAppStyles';
import { SideBarContent } from './SideBarContent';

interface SideBarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export const SideBar = (props: SideBarProps) => {
  const classes = useAuthenticatedAppStyles();

  const { collectionConfigurations } = useConfiguration();

  return (
    <nav className={classes.drawer}>
      <Hidden lgUp implementation="css">
        <Drawer
          variant="temporary"
          open={props.mobileOpen}
          onClose={props.handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          <SideBarContent collections={collectionConfigurations}></SideBarContent>
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
          <SideBarContent collections={collectionConfigurations}></SideBarContent>
        </Drawer>
      </Hidden>
    </nav>
  );
};
