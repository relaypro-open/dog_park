import React from 'react';
import moment from 'moment';
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
    marginTop: theme.spacing(3),
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
            const createdTime = moment(profile.created * 1000).format('llll');
            return (
              <TableRow
                key={'history' + profile.id}
                hover
                onClick={event => {
                  props.history.push('/profile/' + profile.id);
                }}
              >
                <TableCell>{profile.name}</TableCell>
                <TableCell>{profile.id}</TableCell>
                <TableCell>{createdTime}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default withRouter(withStyles(styles)(ProfileHistory));
