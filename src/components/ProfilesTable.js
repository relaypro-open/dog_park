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

const ProfilesTable = React.memo(props => {
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
                <TableCell>{new Date(profiles[profile][0].created * 1000).toISOString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
});

export default withRouter(withStyles(styles)(ProfilesTable));
