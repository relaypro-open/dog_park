import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { handleSelectedTab } from '../actions/app';
import { handleSelectedScanLocation } from '../actions/app';
import { flanIpsFetchData } from '../actions/flan_ips';
import HostsTable from './HostsTable';
import moment from 'moment';
import { flan_api } from '../flan_api';
import {
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import FlanCert from './FlanCert';

const styles = theme => ({
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

class Certificates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasErrored: false,
      isLoading: false,
      noExist: false,
      scan: {},
      selectedDate: moment(),
    };
  }

  componentDidMount() {
    this.props.handleSelectedTab(6);
    this.fetchScans();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.scanLocation !== this.props.scanLocation) {
      this.props.fetchFlanIps();
      this.fetchScans();
    }
  }

  handleDateChange = event => {
    this.setState({ selectedDate: event });
  };

  handleChange = event => {
    this.props.handleSelectedScanLocation(event.target.value);
  };

  fetchScans = () => {
    this.setState({ isLoading: true });

    flan_api
      .get(
        this.props.scanLocation +
          '/' +
          process.env.REACT_APP_DOG_API_ENV +
          '/certs_by_hostname'
      )
      .then(response => {
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
      .then(scan => {
        this.setState({ scan: scan });
      })
      .catch(() => this.setState({ hasErrored: true }));
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

    const { scan } = this.state;

    const { hosts, flanIps, classes, scanLocation } = this.props;

    let output = [];
    Object.keys(scan).forEach(key => {
      let certificate = scan[key];
      if ('locations' in certificate) {
        certificate['hosts'] = [];
        Object.keys(certificate['locations']).forEach(h => {
          if (h in hosts.hostObjects) {
            certificate['hosts'].push(hosts.hostObjects[h]);
          }
        });
      }
      certificate['name'] = key;
      if ('certs' in certificate) {
        certificate['cert'] = certificate['certs'][0];
        output.push(certificate);
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
        {output.map(cert => (
          <div>
            <Paper className={classes.root}>
              <FlanCert key={'key_' + cert.name} cert={cert.cert} />
              <HostsTable hosts={cert.hosts} flanIps={flanIps} expand={false} />
            </Paper>
            <br />
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    profilesHasErrored: state.profilesHasErrored,
    profilesIsLoading: state.profilesIsLoading,
    hosts: state.hosts,
    hostsHasErrored: state.hostsHasErrored,
    hostsIsLoading: state.hostsIsLoading,
    flanIps: state.flanIps,
    flanIpsHasErrored: state.flanIpsHasErrored,
    flanIpsIsLoading: state.flanIpsIsLoading,
    scanLocation: state.scanLocation,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleSelectedTab: value => dispatch(handleSelectedTab(value)),
    handleSelectedScanLocation: value =>
      dispatch(handleSelectedScanLocation(value)),
    fetchFlanIps: () => dispatch(flanIpsFetchData()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Certificates)));
