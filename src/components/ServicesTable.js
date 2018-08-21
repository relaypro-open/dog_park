import React from 'react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';

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

const ServicesTable = (props) => {
  const { classes, services } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Service Name</TableCell>
            <TableCell>Service ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {services.map(service => {
            return (
              <TableRow
                key={service.id}
                hover
                onClick={(event) => {
                  props.history.push("/service/" + service.id);
                }}>

                <TableCell>{service.name}</TableCell>
                <TableCell>{service.id}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default withRouter(withStyles(styles)(ServicesTable));
