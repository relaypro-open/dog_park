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
import { CircularProgress, Typography } from '@material-ui/core';
import FlanCVE from './FlanCVE';

const styles = (theme) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    maxWidth: 700,
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
    };
  }

  componentDidMount() {
    this.props.handleSelectedTab(5);
    this.fetchScans();
    //this.props.fetchGroups();
  }

  handleDateChange = (event) => {
    this.setState({ selectedDate: event });
  };

  fetchScans = () => {
    this.setState({ isLoading: true });

    flan_api
      .get('/vulners_by_hostname')
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

    const { hosts, flanIps } = this.props;

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

    console.log(flanIps);
    console.log(scan);
    console.log(output);

    return (
      <div>
        <a href="https://us-east-1.console.aws.amazon.com/s3/buckets/flan-scans/?region=us-east-1&tab=overview">
          Flan Scans
        </a>
        <br />
        <br />

        {output.map((app) => (
          <div>
            <Typography variant="h6">
              <strong>{app.name}</strong>
            </Typography>
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
