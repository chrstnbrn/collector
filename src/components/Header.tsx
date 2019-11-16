import { AppBar, Button, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';

export const Header = (props: HeaderProps) => {
  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  }));

  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Collector
        </Typography>
        {props.isLoggedIn ? (
          <Button color="inherit" onClick={() => props.handleLogout()}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" onClick={() => props.handleLogin()}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

interface HeaderProps {
  isLoggedIn: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
}
