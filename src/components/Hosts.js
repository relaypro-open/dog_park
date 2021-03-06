import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import HostsTable from './HostsTable';
import { handleSelectedTab } from '../actions/app';

class Hosts extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.handleSelectedTab(3);
  }

  render() {
    if (this.props.hasErrored) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (this.props.isLoading || this.props.flanIpsIsLoading) {
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
          flanIps={this.props.flanIps}
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

export default connect(mapStateToProps, mapDispatchToProps)(Hosts);
