import React from 'react';
import withRouter from '../withRouter';
import { withStyles } from '@mui/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
import {
  CloudOff,
  Check,
  Error,
  Help,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';


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

const HostsTable = React.memo((props) => {
  const { classes, hosts, expand } = props;

  const [open, setOpen] = React.useState(expand);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Paper className={classes.root}>
      <IconButton aria-label="settings" onClick={handleClick}>
        {open ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
      <Typography variant="subtitle1" color="textPrimary">
        <strong>Host List</strong>
      </Typography>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Active</TableCell>
              <TableCell>Host Name</TableCell>
              <TableCell>Host Key</TableCell>
              <TableCell>Host Group</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hosts.map((host) => {
              let activeIcon = null;

              switch (host.active) {
                case 'active':
                  activeIcon = <Check style={{ fill: 'green' }} />;
                  break;
                case 'inactive':
                  activeIcon = <Error style={{ fill: 'red' }} />;
                  break;
                case 'retired':
                  activeIcon = <CloudOff />;
                  break;
                default:
                  activeIcon = <Help />;
              }
              return (
                <TableRow
                  key={host.id}
                  hover
                  title={'Click to view host: ' + host.name}
                  onClick={(event) => {
                    props.history.push('/host/' + host.id);
                  }}
                >
                  <TableCell>{activeIcon}</TableCell>
                  <TableCell>{host.name}</TableCell>
                  <TableCell>{host.hostkey}</TableCell>
                  <TableCell
                    title={'Click to view group: ' + host.group}
                    //Style="text-decoration:underline; cursor: pointer;"
                    onClick={(event) => {
                      event.stopPropagation();
                      props.history.push('/groupByName/' + host.group);
                    }}
                  >
                    {host.group}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Collapse>
    </Paper>
  );
});

export default withRouter(withStyles(styles)(HostsTable));
