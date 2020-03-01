import {
  Button,
  IconButton,
  Link,
  makeStyles,
  Toolbar,
  Typography,
  AppBar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { useAuthenticatedAppStyles } from './AuthenticatedAppStyles';

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
  const authenticatedAppClasses = useAuthenticatedAppStyles();

  const HeaderLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => (
    <RouterLink innerRef={ref} {...props} />
  ));

  return (
    <AppBar position="fixed" className={authenticatedAppClasses.appBar}>
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
        <Button color="inherit" onClick={() => props.handleLogout()}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

interface HeaderProps {
  handleLogout: () => void;
  handleMenuIconClick: () => void;
}
