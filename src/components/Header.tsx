import { Button, IconButton, Link, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

export const Header = (props: HeaderProps) => {
  const useStyles = makeStyles(theme => ({
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('lg')]: {
        display: 'none'
      }
    },
    title: {
      flexGrow: 1
    }
  }));

  const classes = useStyles();

  const HeaderLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => (
    <RouterLink innerRef={ref} {...props} />
  ));

  return (
    <Toolbar>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="menu"
        onClick={props.handleMenuIconClick}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" className={classes.title}>
        <Link component={HeaderLink} to="/" color="inherit" underline="none">
          Collector
        </Link>
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
  );
};

interface HeaderProps {
  isLoggedIn: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
  handleMenuIconClick: () => void;
}
