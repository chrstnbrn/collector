import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListIcon from '@material-ui/icons/List';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { CollectionConfiguration } from '../models/collection-configuration';

const useStyles = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar,
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

interface Props {
  collections: CollectionConfiguration[];
}

export const SideBarContent = (props: Props) => {
  const classes = useStyles();

  const [collectionsOpen, setCollectionsOpen] = React.useState(true);

  const handleCollectionsToggle = () => {
    setCollectionsOpen(!collectionsOpen);
  };

  return (
    <>
      <div className={classes.toolbar}></div>
      <Divider />
      <List>
        <ListItem
          button
          component={NavLink}
          to="/collection"
          activeClassName="Mui-selected"
          onClick={handleCollectionsToggle}
        >
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="Collections" />
          {collectionsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={collectionsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {props.collections.map(collection => (
              <ListItem
                button
                key={collection.id}
                className={classes.nested}
                component={NavLink}
                to={`/collection/${collection.id}`}
                activeClassName="Mui-selected"
              >
                <ListItemText inset>{collection.sheetName}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Collapse>

        <ListItem
          button
          component={NavLink}
          to={'/create-collection'}
          activeClassName="Mui-selected"
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Create Collection" />
        </ListItem>
      </List>
    </>
  );
};
