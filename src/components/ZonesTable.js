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

const ZonesTable = React.memo((props) => {
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
