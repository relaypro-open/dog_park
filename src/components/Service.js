import React, { Component } from 'react';
import { api } from '../api';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { CircularProgress, Button, Fab } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { handleSelectedTab } from '../actions/app';
import { groupsFetchData } from '../actions/groups';
import { flanIpsFetchData } from '../actions/flan_ips';
import { profilesFetchData } from '../actions/profiles';
import { zonesFetchData } from '../actions/zones';
import { hostsFetchData } from '../actions/hosts';
import { servicesFetchData } from '../actions/services';
import { linksFetchData } from '../actions/links';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import update from 'immutability-helper';
import debounce from 'lodash/debounce';
import validator from 'validator';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = (theme) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    maxWidth: '100%',
  },
  button: {
    margin: theme.spacing(1),
  },
  form: {
    width: 700,
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  close: {
    padding: theme.spacing(0.5),
  },
});

export class ServiceRow extends Component {
  constructor(props) {
    super(props);

    let isErrored = false;
    if (props.ports[0] === '') {
      isErrored = true;
    }

    this.state = {
      servicePorts: props.ports,
      serviceProtocol: props.protocol,
      isErrored,
    };

    this.portsField = debounce(this.props.updateServicePorts, 500);
  }

  //componentDidUpdate(prevProps) {
  //  if (this.props.ports !== prevProps.ports || this.props.protocol !== prevProps.protocol) {
  //    this.setState({ servicePorts: this.props.ports });
  //    this.setState({ serviceProtocol: this.props.protocol });
  //  }
  //}

  handlePortsField = (event) => {
    const ports = event.target.value;
    const portList = ports.split(',');
    const isValid = portList
      .map((portString) => {
        const range = portString.split(':');
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
    this.setState({ servicePorts: event.target.value });
    this.portsField(this.props.sIndex, event.target.value, !isValid);
  };

  handleProtocolSelect = (event) => {
    this.setState({ serviceProtocol: event.target.value });
    this.props.updateServiceProtocol(this.props.sIndex, event.target.value);
  };

  handleRemoveService = () => {
    this.props.handleRemoveService(this.props.sIndex);
  };

  render() {
    const { classes, sIndex, handleAddService } = this.props;

    return (
      <TableRow>
        <TableCell>
          <TextField
            error={this.state.isErrored}
            required
            key={'field-' + sIndex.toString()}
            fullWidth
            value={this.state.servicePorts}
            margin="dense"
            onChange={this.handlePortsField}
          />
        </TableCell>
        <TableCell>
          <Select
            required
            value={this.state.serviceProtocol}
            onChange={this.handleProtocolSelect}
            key={'protocol-' + sIndex}
          >
            <MenuItem id={sIndex} value={'tcp'}>
              tcp
            </MenuItem>
            <MenuItem id={sIndex} value={'udp'}>
              udp
            </MenuItem>
            <MenuItem id={sIndex} value={'icmp'}>
              icmp
            </MenuItem>
          </Select>
        </TableCell>
        <TableCell>
          <Fab
            key={'add-' + sIndex}
            size="small"
            color="secondary"
            aria-label="Add"
            className={classes.button}
            onClick={handleAddService}
          >
            <AddIcon />
          </Fab>
          <Fab
            id={sIndex}
            key={'remove-' + sIndex}
            size="small"
            aria-label="Remove"
            className={classes.button}
            onClick={this.handleRemoveService}
          >
            <RemoveIcon id={sIndex} />
          </Fab>
        </TableCell>
      </TableRow>
    );
  }
}

class Service extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serviceId: '',
      serviceName: '',
      serviceServices: [],
      serviceErrors: [],
      noExist: false,
      isLoading: false,
      hasErrored: false,
      isDeleting: false,
      deleteHasErrored: false,
      deleteServiceStatus: '',
      deleteServiceOpen: false,
      updateServiceStatus: '',
      updateServiceOpen: false,
      serviceErrorOpen: false,
      snackBarMsg: '',
    };
  }

  componentDidMount() {
    this.fetchService(this.props.match.params.id);
    this.props.handleSelectedTab(2);
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.location !== prevProps.location) {
      this.setState({ saveServiceOpen: false });
    }
  };

  fetchService(serviceId) {
    this.setState({ isLoading: true });
    api
      .get('service/' + serviceId)
      .then((response) => {
        if (response.status === 200) {
          this.setState({ isLoading: false });
          return response.data;
        } else if (response.status === 404) {
          this.setState({ noExist: true });
          throw Error(response.statusText);
        } else {
          throw Error(response.statusText);
        }
      })
      .then((service) => {
        this.setState({ serviceName: service.name });
        this.setState({ serviceId: service.id });
        if ('services' in service) {
          this.setState({ serviceServices: service.services });
          const serviceErrors = [];
          service.services.map((service) => {
            serviceErrors.push(false);
            return true;
          });
          this.setState({ serviceErrors });
        } else {
          this.setState({ serviceServices: [''] });
          this.setState({ serviceErrors: [true] });
        }
      })
      .catch(() => this.setState({ hasErrored: true }));
  }

  updateService = () => {
    this.setState({ isLoading: true });
    this.setState({
      updateServiceStatus: (
        <div>
          <CircularProgress className={this.props.classes.progress} />
        </div>
      ),
    });
    api
      .put('/service/' + this.state.serviceId, {
        name: this.state.serviceName,
        services: this.state.serviceServices,
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ isLoading: false });
          this.setState({ updateServiceStatus: '' });
          this.handleUpdateCloseButton();
          this.fetchService(this.state.serviceId);
          this.props.fetchGroups();
          this.props.fetchProfiles();
          this.props.fetchZones();
          this.props.fetchServices();
          this.props.fetchHosts();
          this.props.fetchLinks();
          this.setState({
            snackBarMsg:
              this.state.serviceName + ' has been modified successfully!',
          });
          return response.data;
        } else {
          throw Error(response.statusText);
        }
      })
      .then((service) => {
        this.setState({ snackBarOpen: true });
      })
      .catch(() => {
        this.setState({
          updateServiceStatus: <div>An error has occurred!</div>,
        });
        this.setState({ hasErrored: true });
      });
  };

  deleteService = () => {
    this.setState({ isDeleting: true });
    this.setState({
      deleteServiceStatus: (
        <div>
          <CircularProgress className={this.props.classes.progress} />
        </div>
      ),
    });
    api
      .delete('/service/' + this.props.match.params.id)
      .then((response) => {
        if (response.status === 204) {
          this.setState({ isDeleting: false });
          this.setState({ deleteServiceStatus: <div>Deleted!</div> });
          this.props.history.push('/services');
          this.props.fetchGroups();
          this.props.fetchProfiles();
          this.props.fetchZones();
          this.props.fetchServices();
          this.props.fetchHosts();
          this.props.fetchLinks();
        } else if (response.status === 500) {
          let error_msg = Object.entries(response.data.errors).map(
            ([key, value]) => {
              return `${key}: ${value.map((entry) => {
                return this.props.profiles.profileIds[entry];
              })}`;
            }
          );
          throw Error(error_msg);
        } else {
          throw Error(response.statusText);
        }
      })
      .catch((error) => {
        this.setState({
          deleteServiceStatus: (
            <div style={{ color: 'red' }}>
              <br />
              {'Error: ' + error.message}
            </div>
          ),
        });
        this.setState({ deleteHasErrored: true });
      });
  };

  handleDeleteButton = (event) => {
    this.setState({ deleteServiceOpen: !this.state.deleteServiceOpen });
  };

  handleDeleteCloseButton = (event) => {
    this.setState({ deleteServiceStatus: '' });
    this.setState({ deleteServiceOpen: false });
  };

  updateServicePorts = (index, value, isErrored) => {
    const ports = value.split(',');
    const serviceServices = update(this.state.serviceServices, {
      [index]: { ports: { $set: ports } },
    });
    const serviceErrors = update(this.state.serviceErrors, {
      [index]: { $set: isErrored },
    });
    this.setState({ serviceServices });
    this.setState({ serviceErrors });
  };

  updateServiceProtocol = (index, value) => {
    let newState = update(this.state.serviceServices, {
      [index]: { protocol: { $set: value } },
    });
    this.setState({ serviceServices: newState });
  };

  handleRemoveService = (index) => {
    const serviceServices = update(this.state.serviceServices, {
      $unset: [index],
    });
    const serviceErrors = update(this.state.serviceErrors, { $unset: [index] });
    serviceServices.splice(index, 1);
    serviceErrors.splice(index, 1);
    if (serviceServices.length === 0) {
      serviceServices.push({ ports: [''], protocol: 'tcp' });
      serviceErrors.push(true);
    }
    this.setState({ serviceServices });
    this.setState({ serviceErrors });
  };

  handleAddService = (event) => {
    this.setState({
      serviceServices: [
        ...this.state.serviceServices,
        { ports: [''], protocol: 'tcp' },
      ],
    });
    this.setState({
      serviceErrors: [...this.state.serviceErrors, true],
    });
  };

  handleUpdateCloseButton = () => {
    this.setState({ updateServiceOpen: false });
  };

  handleServiceErrorButton = () => {
    this.setState({ serviceErrorOpen: false });
  };

  handleUpdateButton = () => {
    if (
      this.state.serviceErrors.reduce((acc, curr) => {
        if (curr) {
          return true;
        } else {
          return acc;
        }
      })
    ) {
      this.setState({ serviceErrorOpen: true });
    } else {
      this.setState({ updateServiceOpen: true });
    }
  };

  handleSnackBarOpen = () => {
    this.setState({ snackBarOpen: true });
  };

  handleSnackBarClose = (event, reason) => {
    this.setState({ snackBarOpen: false });
  };

  render() {
    if (this.state.hasErrored && this.state.noExist) {
      return <p>This service no longer exists!</p>;
    } else if (this.state.hasErrored) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (this.state.isLoading) {
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
        <Typography variant="subtitle1">
          Service {this.state.serviceName}
        </Typography>
        <br />
        <form>
          <Paper className={classes.root}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ports</TableCell>
                  <TableCell>Protocol</TableCell>
                  <TableCell>Add or Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.serviceServices.map((service, index) => {
                  return (
                    <ServiceRow
                      key={'serviceRow_' + index}
                      classes={classes}
                      sIndex={index}
                      ports={service.ports}
                      protocol={service.protocol}
                      handleRemoveService={this.handleRemoveService}
                      handleAddService={this.handleAddService}
                      updateServicePorts={this.updateServicePorts}
                      updateServiceProtocol={this.updateServiceProtocol}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </form>
        <br />
        <Button
          variant="contained"
          onClick={this.handleUpdateButton}
          color="primary"
        >
          Save
        </Button>
        <Button onClick={this.handleDeleteButton} color="primary">
          Delete
          <DeleteIcon className={classes.rightIcon} />
        </Button>

        <Dialog
          open={this.state.deleteServiceOpen}
          onClose={this.handleDeleteCloseButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Confirm delete of: {this.state.serviceName}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete: {this.state.serviceName}?
              {this.state.deleteServiceStatus}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeleteCloseButton} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.deleteService}
              variant="contained"
              color="primary"
            >
              Delete
              <DeleteIcon className={classes.rightIcon} />
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.updateServiceOpen}
          onClose={this.handleUpdateCloseButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Confirm update of service: {this.state.serviceName}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to modify the service:{' '}
              {this.state.serviceName}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleUpdateCloseButton} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.updateService}
              variant="contained"
              color="primary"
            >
              Submit Change
            </Button>
            &nbsp;&nbsp;{this.state.updateServiceStatus}
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
              You have invalid port/port ranges defined. Please fix these before
              updating service.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleServiceErrorButton} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleSnackBarClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.snackBarMsg}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleSnackBarClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profiles: state.profiles,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleSelectedTab: (value) => dispatch(handleSelectedTab(value)),
    fetchGroups: () => dispatch(groupsFetchData()),
    fetchFlanIps: () => dispatch(flanIpsFetchData()),
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
)(withRouter(withStyles(styles)(Service)));
