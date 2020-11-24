import React, { Component } from 'react';
import { connect } from 'react-redux';
import { api } from '../api';
import { servicesFetchData } from '../actions/services';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import ServicesTable from './ServicesTable';
import { handleSelectedTab } from '../actions/app';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import validator from 'validator';

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
});

class Services extends Component {
  constructor(props) {
    super(props);

    this.state = {
      createServiceName: '',
      createServicePorts: '',
      createServiceProtocol: 'tcp',
      createServiceOpen: false,
      isErrored: true,
      serviceErrorOpen: false,
    };
  }

  componentDidMount() {
    this.props.handleSelectedTab(2);
  }

  createService = () => {
    if (
      this.state.isErrored ||
      this.state.createServiceName === '' ||
      this.state.createServiceName in this.props.services.serviceNames
    ) {
      this.setState({ serviceErrorOpen: true });
      return;
    }
    this.setState({ isLoading: true });

    api
      .post('service', {
        name: this.state.createServiceName,
        services: [
          {
            ports: [this.state.createServicePorts],
            protocol: this.state.createServiceProtocol,
          },
        ],
        version: 1,
      })
      .then((response) => {
        if (response.status === 201) {
          let re = /\/api\/service\/(.+)/;
          this.setState({ isLoading: false });
          let serviceId = response.headers.location;
          let newServiceId = serviceId.replace(re, '$1');
          return newServiceId;
        } else {
          throw Error(response.statusText);
        }
      })
      .then((serviceId) => {
        this.setState({ createServiceOpen: false });
        this.setState({ createServiceName: '' });
        this.props.fetchServices();
        this.props.history.push('/service/' + serviceId);
      })
      .catch(() => this.setState({ hasErrored: true }));
  };

  handleCreateServiceButton = () => {
    this.setState({ createServiceOpen: true });
  };

  handleServiceErrorButton = () => {
    this.setState({ serviceErrorOpen: false });
  };

  handleCreateServiceClose = () => {
    this.setState({ createServiceOpen: false });
  };

  handleCreateServiceName = (event) => {
    this.setState({ createServiceName: event.target.value });
  };

  handleCreateServicePorts = (event) => {
    const ports = event.target.value;
    const portList = ports.split(',');
    const isValid = portList
      .map((portString) => {
        const range = portString.split('-');
        if (range !== portString && range.length === 2) {
          return (
            validator.isPort(range[0]) &&
            validator.isPort(range[1]) &&
            parseInt(range[0], 10) < parseInt(range[1], 10)
          );
        } else {
          return validator.isPort(range[0]);
        }
      })
      .reduce((acc, curr) => {
        if (!curr) {
          return false;
        } else {
          return acc;
        }
      });
    this.setState({ isErrored: !isValid });
    this.setState({ createServicePorts: event.target.value });
  };

  handleCreateServiceProtocol = (event) => {
    this.setState({ createServiceProtocol: event.target.value });
  };

  render() {
    if (this.props.hasErrored) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (this.props.isLoading) {
      return (
        <div>
          {' '}
          <CircularProgress />
        </div>
      );
    }

    const { classes } = this.props;

    return (
      <div>
        <ServicesTable services={this.props.services.serviceList} />

        <Fab
          color="secondary"
          aria-label="Add"
          className={classes.speedDialButton}
          onClick={this.handleCreateServiceButton}
        >
          <AddIcon />
        </Fab>

        <Dialog
          open={this.state.createServiceOpen}
          onClose={this.handleCreateServiceClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create a New Service</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the name, ports, and protocol for the service.
            </DialogContentText>
            <form>
              <TextField
                autoFocus
                margin="dense"
                id="serviceName"
                label="Service Name"
                value={this.state.createServiceName}
                onChange={this.handleCreateServiceName}
                required
                fullWidth
              />
              <br />
              <TextField
                error={this.state.isErrored}
                fullWidth
                label="Service Ports (comma separated)"
                value={this.state.createServicePorts}
                margin="dense"
                onChange={this.handleCreateServicePorts}
                required
              />
              <br />
              <br />
              <Typography variant="body1">
                <strong>Service Protocol:</strong> &nbsp;&nbsp;
                <Select
                  required
                  value={this.state.createServiceProtocol}
                  onChange={this.handleCreateServiceProtocol}
                >
                  <MenuItem value={'tcp'}>tcp</MenuItem>
                  <MenuItem value={'udp'}>udp</MenuItem>
                  <MenuItem value={'icmp'}>icmp</MenuItem>
                </Select>
              </Typography>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCreateServiceClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.createService}
              variant="contained"
              color="primary"
            >
              Create Service
            </Button>
            &nbsp;&nbsp;{this.state.createServiceStatus}
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.serviceErrorOpen}
          onClose={this.handleServiceErrorButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Service Validation Errors
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              You have invalid port/port ranges defined or you have not entered
              a unique name. Please fix these before updating service.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleServiceErrorButton} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    services: state.services,
    hasErrored: state.servicesHasErrored,
    isLoading: state.servicesIsLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleSelectedTab: (value) => dispatch(handleSelectedTab(value)),
    fetchServices: () => dispatch(servicesFetchData()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Services));
