import React, { Component } from 'react';
import { connect } from 'react-redux';
import { api, getErrorMessage } from '../api';
import withRouter from '../withRouter';
import { groupsFetchData } from '../actions/groups';
import { profilesFetchData } from '../actions/profiles';
import { zonesFetchData } from '../actions/zones';
import { hostsFetchData } from '../actions/hosts';
import { servicesFetchData } from '../actions/services';
import { linksFetchData } from '../actions/links';
import { handleSelectedTab } from '../actions/app';
import { withStyles } from '@mui/styles';
import { CircularProgress } from '@mui/material';
import ServicesTable from './ServicesTable';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import validator from 'validator';

const styles = (theme) => ({
  root: {
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
    this.props.fetchServices();
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
          throw Error(getErrorMessage(response));
        }
      })
      .then((serviceId) => {
        this.setState({ createServiceOpen: false });
        this.setState({ createServiceName: '' });
        this.props.fetchGroups();
        this.props.fetchProfiles();
        this.props.fetchZones();
        this.props.fetchServices();
        this.props.fetchHosts();
        this.props.fetchLinks();
        this.props.history.push('/service/' + serviceId);
      })
      .catch((err) => this.setState({ hasErrored: err.message || true }));
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
    fetchGroups: () => dispatch(groupsFetchData()),

    fetchProfiles: () => dispatch(profilesFetchData()),
    fetchZones: () => dispatch(zonesFetchData()),
    fetchHosts: () => dispatch(hostsFetchData()),
    fetchServices: () => dispatch(servicesFetchData()),
    fetchLinks: () => dispatch(linksFetchData()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Services)));
