import React from 'react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Collapse, IconButton, Typography } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import FlanCVE from './FlanCVE';
import HostsTable from './HostsTable';
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

const VulnerableApp = pure((props) => {
  const { classes, app, flanIps } = props;

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Paper className={classes.root}>
      <IconButton aria-label="settings" onClick={handleClick}>
        {open ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
      <Typography variant="Heading1" color="textPrimary">
        {app.name}
      </Typography>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div>
          {app.vulns.map((vuln) => (
            <div>
              <br />
              <FlanCVE
                key={'key_' + vuln.name}
                title={vuln.name}
                app={vuln.app}
                description={vuln.description}
                severity={vuln.severity}
                link={'https://vulners.com/cve/' + vuln.name}
              />
            </div>
          ))}
        </div>
        <HostsTable hosts={app.hosts} flanIps={flanIps} expand={false} />
      </Collapse>
    </Paper>
  );
});

export default withRouter(withStyles(styles)(VulnerableApp));
