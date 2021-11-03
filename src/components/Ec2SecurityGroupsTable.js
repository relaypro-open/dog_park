import React from 'react';
import { withRouter } from 'react-router';
import withStyles from '@mui/styles/withStyles';
//import { DataGrid } from '@mui/data-grid';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
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

const Ec2SecurityGroupsTable = pure((props) => {
  const { classes, groups, expand } = props;

  console.debug(groups);

  const flanEventsStyle = {
    backgroundColor: '#FD6864',
  };
  const certEventsStyle = {
    backgroundColor: '#34CDF9',
  };

  const [open, setOpen] = React.useState(expand);

  const handleClick = () => {
    setOpen(!open);
  };

  const columns = [
         { field: 'region', headerName: 'Region', editable: true },
         { field: 'sgid', headerName: 'SgId', editable: true }
   ];

//  return (
//    <Paper className={classes.root}>
//      <Collapse in={open} timeout="auto" unmountOnExit>
//        <DataGrid>
//          <DataGrid rows={groups} columns={columns} />
//        </DataGrid>
//      </Collapse>
//    </Paper>
//  );
//});

  return (
    <Paper className={classes.root}>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Table className={classes.table}>
          <TableBody>
              {groups.map((mapping) => 
                  (
                          <TableRow>
                            <TableCell>{mapping.region}</TableCell>
                            <TableCell>{mapping.sgid}</TableCell>
                          </TableRow>
              ))}
           </TableBody>
        </Table>
      </Collapse>
    </Paper>
  );
});
           // <TableRow>
           // <TableCell>test</TableCell>
           // </TableRow>
                        //        <p key={i}>
                        //          <span>Key Name: {key}</span>
                        //          <span>Value: {this.state.groupEc2SecurityGroups[key]}</span>
                        //        </p>
                        //      )
          //<TableHead>
          //  <TableRow>
          //    <TableCell>Region</TableCell>
          //    <TableCell align="right">Ec2 Security Group</TableCell>
          //  </TableRow>
          //</TableHead>
              //<TextField
              //  multiline
              //  fullWidth
              //  placeholder="\{'region':'security_group_id'\}"
              //  margin="dense"
              //  id="comment"
              //  ///value={JSON.stringify(this.state.groupEc2SecurityGroups)}
              //  //value={this.state.groupEc2SecurityGroups}
              //  //Value = Object.keys(this.state.groupEc2SecurityGroups).map((key, i) => (
              //  //                          <p key={i}>
              //  //                            <span>Key Name: {key}</span>
              //  //                            <span>Value: {this.state.groupEc2SecurityGroups[key]}</span>
              //  //                          </p>
              //  //                        )
              //  onChange={this.handleEc2SecurityGroups}
              ///>

export default withRouter(withStyles(styles)(Ec2SecurityGroupsTable));
