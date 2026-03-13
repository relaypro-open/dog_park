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
import { CircularProgress } from '@mui/material';

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
            const createdTime = new Date(profile.created * 1000).toLocaleString();
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
