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
  Avatar
} from '@material-ui/core';
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

const HostsTable = pure(props => {
  const { classes, hosts, flanIps } = props;

  const flanEventsStyle = {
    backgroundColor: '#FD6864',
  };

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Host Name</TableCell>
            <TableCell>Host ID</TableCell>
            <TableCell>Host Group</TableCell>
            <TableCell>Flan Events</TableCell>
            <TableCell>Open Apps</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {hosts.map(host => {
            let flanEventCount = 0;
            let openAppCount = 0;
            let flanEvent = '';
            if (host.name in flanIps[0]) {
              flanIps[0][host.name].forEach(app => {
                flanEventCount += app['vulns'].length;
                openAppCount += 1;
              });
            }
            if(flanEventCount > 0) {
              flanEvent = <Avatar aria-label="recipe" style={flanEventsStyle}>
                  {flanEventCount}
                </Avatar>
            }
            return (
              <TableRow
                key={host.id}
                hover
                title={"Click to view host: " + host.name}
                onClick={event => {
                  props.history.push('/host/' + host.id);
                }}
              >
                <TableCell>{host.name}</TableCell>
                <TableCell>{host.id}</TableCell>
                <TableCell title={"Click to view group: " + host.group} Style="text-decoration:underline; cursor: pointer;" onClick={event => {event.stopPropagation(); props.history.push('/groupByName/' + host.group)}}>{host.group}</TableCell>
                <TableCell>{flanEvent}</TableCell>
                <TableCell>{openAppCount}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
});

export default withRouter(withStyles(styles)(HostsTable));
