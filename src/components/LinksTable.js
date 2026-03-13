import React from 'react';
import { withStyles } from '@mui/styles';
import withRouter from '../withRouter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { pure } from 'recompose';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    width: '100%',
  },
});

const LinksTable = pure(props => {
  const { classes, links } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Link Name</TableCell>
            <TableCell>Link ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {links.map(link => {
            return (
              <TableRow
                key={link.id}
                hover
                onClick={event => {
                  props.history.push('/link/' + link.id);
                }}
              >
                <TableCell>{link.name}</TableCell>
                <TableCell>{link.id}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
});

export default withRouter(withStyles(styles)(LinksTable));
