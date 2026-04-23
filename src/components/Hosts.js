import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CircularProgress } from '@mui/material';
import HostsTable from './HostsTable';
import { handleSelectedTab } from '../actions/app';
import { hostsFetchData } from '../actions/hosts';

class Hosts extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.fetchHosts();
    this.props.handleSelectedTab(3);
  }

  render() {
    if (this.props.hasErrored) {
      return <p>{typeof this.state.hasErrored === 'string' ? this.state.hasErrored : (typeof this.props.profilesHasErrored === 'string' ? this.props.profilesHasErrored : (typeof this.props.hostsHasErrored === 'string' ? this.props.hostsHasErrored : 'Sorry! There was an error loading the items'))}</p>;
    }
    if (this.props.isLoading) {
      return (
        <div>
          {' '}
          <CircularProgress />
        </div>
      );
    }

    return (
      <div>
        <HostsTable
          hosts={this.props.hosts.hostList}
          expand={true}
        />
        <br />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    hosts: state.hosts,
    hasErrored: state.hostsHasErrored,
    isLoading: state.hostsIsLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchHosts: () => dispatch(hostsFetchData()),
    handleSelectedTab: (value) => dispatch(handleSelectedTab(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Hosts);
