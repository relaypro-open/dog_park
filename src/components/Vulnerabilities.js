import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { handleSelectedTab } from '../actions/app';
//import { DatePicker } from "@material-ui/pickers";
//import FlanCVE from './FlanCVE';
import HostsTable from './HostsTable';
import moment from 'moment';
import { flan_api } from '../flan_api';
import {
  CircularProgress,
  Typography,
  Avatar,
  Collapse,
  IconButton,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import {
  CloudOff,
  Check,
  Error,
  Help,
  ExpandLess,
  ExpandMore,
} from '@material-ui/icons';
import FlanCVE from './FlanCVE';

const styles = (theme) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    maxWidth: '100%',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  progress: {
    margin: 'auto',
    width: '50%',
  },
  speedDialButton: {
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    position: 'fixed',
    color: 'secondary',
  },
  close: {
    padding: theme.spacing(0.5),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

class Vulnerabilities extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasErrored: false,
      isLoading: false,
      noExist: false,
      scan: {},
      selectedDate: moment(),
      open: false,
      scanLocation: 'external',
    };
  }

  componentDidMount() {
    this.props.handleSelectedTab(5);
    this.fetchScans();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.scanLocation !== this.state.scanLocation) {
      this.fetchScans();
    }
  }

  handleDateChange = (event) => {
    this.setState({ selectedDate: event });
  };

  fetchScans = () => {
    this.setState({ isLoading: true });

    flan_api
      .get(
        this.state.scanLocation +
          '/' +
          process.env.REACT_APP_DOG_API_ENV +
          '/vulners_by_hostname'
      )
      .then((response) => {
        if (response.status === 200) {
          this.setState({ isLoading: false });
          return response.data;
        } else if (response.status === 404) {
          this.setState({ isLoading: false });
          throw Error(response.statusText);
        } else {
          this.setState({ isLoading: false });
          throw Error(response.statusText);
        }
      })
      .then((scan) => {
        this.setState({ scan: scan });
      })
      .catch(() => this.setState({ hasErrored: true }));
  };

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  handleChange = (event) => {
    this.setState({ scanLocation: event.target.value });
  };

  render() {
    if (
      this.state.hasErrored ||
      this.props.profilesHasErrored ||
      this.props.hostsHasErrored ||
      this.props.flanIpsHasErrored
    ) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (
      this.state.isLoading ||
      this.props.profilesIsLoading ||
      this.props.hostsIsLoading ||
      this.props.flanIpsIsLoading ||
      Object.keys(this.props.flanIps.hosts).length === 0
    ) {
      return (
        <div>
          {' '}
          <CircularProgress className={this.props.classes.progress} />
        </div>
      );
    }

    const { scan, open, scanLocation } = this.state;

    const { hosts, flanIps, classes } = this.props;

    let output = [];
    Object.keys(scan).forEach((key) => {
      let application = scan[key];
      if ('locations' in application) {
        application['hosts'] = [];
        Object.keys(application['locations']).forEach((h) => {
          if (h in hosts.hostObjects) {
            application['hosts'].push(hosts.hostObjects[h]);
          }
        });
      }
      application['name'] = key;
      if ('vulns' in application) {
        output.push(application);
      }
    });

    return (
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="scan-location-input">Scan Location</InputLabel>
          <Select
            labelId="scan-location-input-label"
            id="scan-location-input"
            value={scanLocation}
            onChange={this.handleChange}
          >
            <MenuItem value={'external'}>External</MenuItem>
            <MenuItem value={'internal'}>Internal</MenuItem>
          </Select>
        </FormControl>
        {output.map((app) => (
          <div>
            <Paper className={classes.root}>
              <IconButton aria-label="settings" onClick={this.handleClick}>
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
                <HostsTable
                  hosts={app.hosts}
                  flanIps={flanIps}
                  expand={false}
                />
              </Collapse>
            </Paper>
            <br />
            <br />
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profilesHasErrored: state.profilesHasErrored,
    profilesIsLoading: state.profilesIsLoading,
    hosts: state.hosts,
    hostsHasErrored: state.hostsHasErrored,
    hostsIsLoading: state.hostsIsLoading,
    flanIps: state.flanIps,
    flanIpsHasErrored: state.flanIpsHasErrored,
    flanIpsIsLoading: state.flanIpsIsLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleSelectedTab: (value) => dispatch(handleSelectedTab(value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Vulnerabilities)));

//      <FlanCVE key={'key_' + vuln.name} title={vuln.name} app={vuln.app} description={vuln.description} severity={vuln.severity} link={'https://nvd.nist.gov/vuln/detail/' + vuln.name} />
//{app.vulns.map(vuln => (
//  <div>
//  <FlanCVE key={'key_' + vuln.name} title={vuln.name} app={vuln.app} description={vuln.description} severity={vuln.severity} link={'https://nvd.nist.gov/vuln/detail/' + vuln.name} />
//  <br/>
//  </div>
//))}

//<Fragment>
// <DatePicker
//   label="Choose Date to View:"
//   value={this.state.selectedDate}
//   onChange={this.handleDateChange}
//   animateYearScrolling
// />
//</Fragment>
//<br/>
//<br/>
