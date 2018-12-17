import React from 'react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    width: '100%',
  },
});

const HostsTable = props => {
  const { classes, hosts } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Host Name</TableCell>
            <TableCell>Host ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {hosts.map(host => {
            return (
              <TableRow
                key={host.id}
                hover
                onClick={event => {
                  props.history.push('/host/' + host.id);
                }}
              >
                <TableCell>{host.name}</TableCell>
                <TableCell>{host.id}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default withRouter(withStyles(styles)(HostsTable));
