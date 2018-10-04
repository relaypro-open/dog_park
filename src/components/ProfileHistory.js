import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';

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

const ProfileHistory = props => {
  const { classes, profiles } = props;

  if (profiles === undefined) {
    return (
      <div>
        {' '}
        <CircularProgress />
      </div>
    );
  }

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Profile Name</TableCell>
            <TableCell>Profile ID</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {profiles.map(profile => {
            return (
              <TableRow
                key={'history' + profile.id}
                hover
                /*onClick={event => {
                  props.history.push('/profile/' + profile.id);
                }}*/
              >
                <TableCell>{profile.name}</TableCell>
                <TableCell>{profile.id}</TableCell>
                <TableCell>{profile.created}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default withRouter(withStyles(styles)(ProfileHistory));
