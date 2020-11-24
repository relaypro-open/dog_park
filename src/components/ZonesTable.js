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
import { pure } from 'recompose';

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    width: '100%',
  },
});

const ZonesTable = pure((props) => {
  const { classes, zones } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Zone Name</TableCell>
            <TableCell>Zone ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {zones.map((zone) => {
            return (
              <TableRow
                key={zone.id}
                hover
                onClick={(event) => {
                  props.history.push('/zone/' + zone.id);
                }}
              >
                <TableCell>{zone.name}</TableCell>
                <TableCell>{zone.id}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
});

export default withRouter(withStyles(styles)(ZonesTable));
