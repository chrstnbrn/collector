import React from 'react';
import { Hidden, Drawer, makeStyles, createStyles } from '@material-ui/core';
import { useConfiguration } from '../context/configuration-context';
import { SideBarContent } from './SideBarContent';

const drawerWidth = 240;

const useStyles = makeStyles(theme =>
  createStyles({
    drawer: {
      [theme.breakpoints.up('lg')]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    drawerPaper: {
      width: drawerWidth
    }
  })
);

interface SideBarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export const SideBar = (props: SideBarProps) => {
  const classes = useStyles();

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
