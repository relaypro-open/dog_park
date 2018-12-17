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
import GitChanges from './GitChanges';

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

const GroupsTable = props => {
  const { classes, groups } = props;

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
            <TableCell>Changes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map(group => {
            let profileStatus = '';
            let gitChanges = '';
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
                <TableCell>{gitChanges}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default withRouter(withStyles(styles)(GroupsTable));
