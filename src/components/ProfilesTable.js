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

const ProfilesTable = pure(props => {
  const { classes, profiles } = props;

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
          {Object.keys(profiles).sort().map(profile => {
            return (
              <TableRow
                key={profile}
                hover
                onClick={event => {
                  props.history.push('/profile/' + profiles[profile][0].id);
                }}
              >
                <TableCell>{profile}</TableCell>
                <TableCell>{profiles[profile][0].id}</TableCell>
                <TableCell>{moment(profiles[profile][0].created * 1000).format()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
});

export default withRouter(withStyles(styles)(ProfilesTable));
