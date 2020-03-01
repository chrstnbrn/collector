import { createStyles, makeStyles } from '@material-ui/core';

const drawerWidth = 240;

export const useAuthenticatedAppStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: 'flex',
      minHeight: '100vh',
      background: theme.palette.background.default
    },
    drawer: {
      [theme.breakpoints.up('lg')]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    drawerPaper: {
      width: drawerWidth
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
