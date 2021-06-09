import React from 'react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
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
} from '@material-ui/core';
import {
  CloudOff,
  Check,
  Error,
  Help,
  ExpandLess,
  ExpandMore,
} from '@material-ui/icons';
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

const HostsTable = pure((props) => {
  const { classes, hosts, flanIps, expand } = props;

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

  return (
    <Paper className={classes.root}>
      <IconButton aria-label="settings" onClick={handleClick}>
        {open ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
      <Typography variant="Heading1" color="textPrimary">
        Host List
      </Typography>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Active</TableCell>
              <TableCell>Host Name</TableCell>
              <TableCell>Host Key</TableCell>
              <TableCell>Host Group</TableCell>
              <TableCell>Vulnerabilities</TableCell>
              <TableCell>Certificates</TableCell>
              <TableCell>Open Apps</TableCell>
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
              let flanEventCount = 0;
              let openAppCount = 0;
              let flanEvent = '';
              let certCount = 0;
              let certEvent = '';
              if (host.name in flanIps.hosts) {
                flanIps.hosts[host.name].forEach((app) => {
                  flanEventCount += app['vulns'].length;
                  certCount += app['certs'].length;
                  openAppCount += 1;
                });
              }
              if (flanEventCount > 0) {
                flanEvent = (
                  <Avatar aria-label="recipe" style={flanEventsStyle}>
                    {flanEventCount}
                  </Avatar>
                );
              }
              if (certCount > 0) {
                certEvent = (
                  <Avatar aria-label="recipe" style={certEventsStyle}>
                    {certCount}
                  </Avatar>
                );
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
                    Style="text-decoration:underline; cursor: pointer;"
                    onClick={(event) => {
                      event.stopPropagation();
                      props.history.push('/groupByName/' + host.group);
                    }}
                  >
                    {host.group}
                  </TableCell>
                  <TableCell>{flanEvent}</TableCell>
                  <TableCell>{certEvent}</TableCell>
                  <TableCell>{openAppCount}</TableCell>
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
