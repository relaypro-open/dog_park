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
  items: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    maxWidth: '100%',
  },
  table: {
    width: '100%',
  },
  updateable: {
    color: 'green',
  },
  notUpdateable: {
    color: 'red',
  },
});

const VulnerableApp = pure((props) => {
  const { classes, app, flanIps } = props;

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  let updateable = '';

  if (app.is_updateable) {
    updateable = (
      <Typography variant="Heading1" className={classes.updateable}>
        {' - There is a newer version of this app available.'}
      </Typography>
    );
  } else if (
    app.name.toLowerCase().includes('openssh') &&
    app.name.includes('ubuntu')
  ) {
    updateable = (
      <Typography variant="Heading1" className={classes.notUpdateable}>
        {' - This is the latest version of the app!'}
      </Typography>
    );
  }

  return (
    <Paper className={classes.root}>
      <IconButton aria-label="settings" onClick={handleClick}>
        {open ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
      <Typography variant="Heading1" color="textPrimary">
        {app.name}
      </Typography>
      {updateable}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div className={classes.items}>
          <HostsTable hosts={app.hosts} flanIps={flanIps} expand={false} />
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
      </Collapse>
    </Paper>
  );
});

export default withRouter(withStyles(styles)(VulnerableApp));
