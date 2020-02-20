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
import GitChanges from './GitChanges';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    width: '100%',
  },
  high: {
    backgroundColor: '#FD6864' ,
  },
  medium: {
    backgroundColor: '#F8A102' ,
  },
  low: {
    backgroundColor: '#34CDF9' ,
  }
});

const GroupsTable = props => {
  const { classes, groups, flanIps } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Group Name</TableCell>
            <TableCell>Group ID</TableCell>
            <TableCell>Profile Name</TableCell>
            <TableCell>Profile ID</TableCell>
            <TableCell>Profile Version</TableCell>
            <TableCell>Profile Status</TableCell>
            <TableCell>Hosts</TableCell>
            <TableCell>Changes</TableCell>
            <TableCell>Flan Events</TableCell>
            <TableCell>Dog Validation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map(group => {
            let profileStatus = '';
            let gitChanges = '';
            let groupHostCount = 0;
            let flanEventCount = 0;
            let flanEvent = "";
            if (group.hasUpdated) {
              profileStatus = (
                <font color="red">
                  The current profile does not match the most recent profile
                  updated. Click to review changes.
                </font>
              );
              gitChanges = (
                <GitChanges profile1={group.currentProfileId} profile2={group.profile_id} />
              )
            }
            if (group.name in flanIps[1]) {
              groupHostCount = flanIps[1][group.name].length;
              if (flanIps[1][group.name].length > 0) {
                flanIps[1][group.name].forEach(host => {
                  host[Object.keys(host)[0]].forEach(app => {
                    flanEventCount += app['vulns'].length;
                  });
                });
              };
            }

            if (flanEventCount > 0) {
              flanEvent = <Avatar aria-label="recipe" className={classes.high}>
                    {flanEventCount}
                  </Avatar>;
            }
            return (
              <TableRow
                key={group.id}
                hover
                onClick={event => {
                  props.history.push('/group/' + group.id);
                }}
              >
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.id}</TableCell>
                <TableCell>{group.profile_name}</TableCell>
                <TableCell>{group.profile_id}</TableCell>
                <TableCell>{group.profile_version}</TableCell>
                <TableCell>{profileStatus}</TableCell>
                <TableCell>{groupHostCount}</TableCell>
                <TableCell>{gitChanges}</TableCell>
                <TableCell>{flanEvent}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default withRouter(withStyles(styles)(GroupsTable));
