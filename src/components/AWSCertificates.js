import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { handleSelectedTab } from '../actions/app';
import { handleSelectedScanLocation } from '../actions/app';
import { flanIpsFetchData } from '../actions/flan_ips';
import { flan_api } from '../flan_api';
import {
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import FlanAWSCert from './FlanAWSCert';

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

class AWSCertificates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasErrored: false,
      isLoading: false,
      noExist: false,
      scan: {},
      region: 'us-east-1',
    };
  }

  componentDidMount() {
    this.props.handleSelectedTab(7);
    this.fetchScans();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.region !== this.state.region) {
      this.props.fetchFlanIps();
      this.fetchScans();
    }
  }

  handleRegionChange = (event) => {
    this.setState({ region: event.target.value });
  };

  fetchScans = () => {
    this.setState({ isLoading: true });

    flan_api
      .get(
        'internal/' +
          process.env.REACT_APP_DOG_API_ENV +
          '/aws_certs_' +
          this.state.region
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
      this.props.flanIpsIsLoading
    ) {
      return (
        <div>
          {' '}
          <CircularProgress className={this.props.classes.progress} />
        </div>
      );
    }

    const { scan, region } = this.state;

    const { classes } = this.props;

    return (
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="scan-location-input">Scan Region</InputLabel>
          <Select
            labelId="scan-location-input-label"
            id="scan-location-input"
            value={region}
            onChange={this.handleRegionChange}
          >
            <MenuItem value={'us-east-1'}>us-east-1</MenuItem>
            <MenuItem value={'us-east-2'}>us-east-2</MenuItem>
            <MenuItem value={'us-west-1'}>us-west-1</MenuItem>
            <MenuItem value={'us-west-2'}>us-west-2</MenuItem>
          </Select>
        </FormControl>
        {Object.keys(scan)
          .sort()
          .map((cert) => (
            <div>
              <FlanAWSCert key={'key_' + cert} lb={cert} cert={scan[cert]} />
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
    handleSelectedScanLocation: (value) =>
      dispatch(handleSelectedScanLocation(value)),
    fetchFlanIps: () => dispatch(flanIpsFetchData()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(AWSCertificates)));
