import React, { Component } from 'react';
import { api } from '../api';
import { servicesFetchData } from '../actions/services'
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom'
import { CircularProgress, Button } from '@material-ui/core'
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { handleSelectedTab } from '../actions/app'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DeleteIcon from '@material-ui/icons/Delete';
import update from 'immutability-helper';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    maxWidth: 700,
  },
  button: {
    margin: theme.spacing.unit,
  },
  form: {
    width: 700,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

export class ServiceRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      servicePorts: props.ports,
      serviceProtocol: props.protocol,
    }

  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps ) {
      this.setState({servicePorts: this.props.ports});
      this.setState({serviceProtocol: this.props.protocol});
    }
  }

  handlePortsField = (event) => {
    this.setState({servicePorts: event.target.value});
    console.log(this.props.sIndex);
    this.props.updateServicePorts(this.props.sIndex, event.target.value);
  }

  handleProtocolSelect = (event) => {
    this.setState({serviceProtocol: event.target.value});
    console.log(event.target.id);
    this.props.updateServiceProtocol(this.props.sIndex, event.target.value);
  }

  handleRemoveService = () => {
    this.props.handleRemoveService(this.props.sIndex);
  }

  render() {

    const { classes, sIndex, address, handleRemoveService, handleAddService, updateServicePorts, updateServiceProtocol } = this.props;

    return (
      <TableRow>
        <TableCell>
          <TextField
            id={sIndex}
            key={'field-' + sIndex}
            fullWidth
            value={this.state.servicePorts}
            margin="dense"
            onChange={this.handlePortsField}
            />
        </TableCell>
        <TableCell>
          <Select
            id={sIndex}
            value={this.state.serviceProtocol}
            onChange={this.handleProtocolSelect}
            key={'protocol-' + sIndex}>
              <MenuItem id={sIndex} value={""}><em>None</em></MenuItem>
              <MenuItem id={sIndex} value={"tcp"}>tcp</MenuItem>
              <MenuItem id={sIndex} value={"udp"}>udp</MenuItem>
              <MenuItem id={sIndex} value={"icmp"}>icmp</MenuItem>
          </Select>
        </TableCell>
        <TableCell>
          <Button key={'add-' + sIndex} variant="fab" mini color="secondary" aria-label="Add" className={classes.button} onClick={handleAddService}>
            <AddIcon />
          </Button>
          <Button id={sIndex} key={'remove-' + sIndex } variant="fab" mini  aria-label="Remove" className={classes.button} onClick={this.handleRemoveService}>
            <RemoveIcon id={sIndex}/>
          </Button>
        </TableCell>
      </TableRow>
    )
  }

}

class Service extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serviceId: '',
      serviceName: '',
      serviceServices: [],
      noExist: false,
      isLoading: false,
      hasErrored: false,
      isDeleting: false,
      deleteHasErrored: false,
      deleteServiceStatus: '',
      deleteServiceOpen: false,
      updateServiceStatus: '',
      updateServiceOpen: false,
    }

  }

  componentDidMount() {
    this.fetchService(this.props.match.params.id);
    this.props.handleSelectedTab(2);
  }

  componentDidUpdate = (prevProps) => {
    if (this.props !== prevProps) {
      this.setState({saveServiceOpen: false});
    }
  }

  fetchService(serviceId) {
    this.setState({isLoading: true});
    api.get('service/' + serviceId )
    .then((response) => {
      if (response.status === 200) {
        this.setState({isLoading: false});
        return response.data;
      } else if (response.status === 404) {
        this.setState({noExist: true});
        throw Error(response.statusText);
      } else {
        console.log("here!!");
        throw Error(response.statusText);
      }
    })
    .then((service) => {
      this.setState({serviceName: service.name});
      this.setState({serviceId: service.id});
      if ('services' in service) {
        this.setState({serviceServices: service.services});
      } else {
        this.setState({serviceServices: []});
      }
    })
    .catch(() => this.setState({hasErrored:true}));
  }

  updateService = () => {
    this.setState({isLoading: true});
    this.setState({updateServiceStatus: <div><CircularProgress className={this.props.classes.progress}/></div>});
    api.put('/service/' + this.state.serviceId, {
      'services': this.state.serviceServices
    }).then((response) => {
      if (response.status === 200) {
        this.setState({isLoading: false});
        this.setState({updateServiceStatus: ''});
        this.handleUpdateCloseButton();
        this.fetchService(this.state.serviceId);
        return response.data;
      } else {
        throw Error(response.statusText);
      }
    })
    .then((service) => {
      console.log(service);
    })
    .catch(() => {
      this.setState({updateServiceStatus: <div>An error has occurred!</div>});
      this.setState({hasErrored:true})
    });
  }

  deleteService = () => {
    this.setState({isDeleting: true});
    this.setState({deleteServiceStatus: <div><CircularProgress className={this.props.classes.progress}/></div>});
    api.delete('/service/' + this.props.match.params.id
    ).then((response) => {
      if (response.status === 204) {
        this.setState({isDeleting: false});
        this.setState({deleteServiceStatus: <div>Deleted!</div>});
        this.fetchService(this.props.match.params.id);
        this.props.fetchServices();
      } else {
        throw Error(response.statusText);
      }
    })
    .catch(() => {
      this.setState({deleteServiceStatus: <div>An error has occurred!</div>});
      this.setState({deleteHasErrored:true})
    });
  }

  handleDeleteButton = (event) => {
    this.setState({deleteServiceOpen: !this.state.deleteServiceOpen});
  }

  handleDeleteCloseButton = (event) => {
    this.setState({deleteServiceOpen: false});
  }

  updateServices = (index, value) => {
    let services = this.state.serviceServices;
    console.log("Index: " + index.toString());
    services[index] = value;
    console.log(services);
    this.setState({serviceServices: services});
  }

  updateServicePorts = (index, value) => {
    console.log(index);
    console.log(this.state.serviceServices);
    let newState = update(this.state.serviceServices, {[index]: {'ports': [{$set: value}]}});
    this.setState({serviceServices: newState});
  }

  updateServiceProtocol = (index, value) => {
    console.log(index);
    console.log(this.state.serviceServices);
    let newState = update(this.state.serviceServices, {[index]: {'protocol': {$set: value}}});
    this.setState({serviceServices: newState});
  }

  handleRemoveService = (index) => {
    let newServices = update(this.state.serviceServices, {$unset: [index]});
    newServices.splice(index, 1);
    console.log(newServices);
    if (newServices.length === 0) {
      newServices.push({'ports': [""], 'protocol': ""});
    }
    this.setState({serviceServices: newServices});
  }

  handleAddService = (event) => {
    this.setState({serviceServices: [...this.state.serviceServices, {'ports': [""], 'protocol': ""}]});
  }

  handleUpdateCloseButton = () => {
    this.setState({updateServiceOpen: false});
  }

  handleUpdateButton = () => {
    this.setState({updateServiceOpen: true});
  }

  render() {

    if (this.state.hasErrored && this.state.noExist) {
        return <p>This service no longer exists!</p>;
    } else if (this.state.hasErrored) {
        return <p>Sorry! There was an error loading the items</p>;
    }
    if (this.state.isLoading) {
        return <div> <CircularProgress/></div>;
    }

    const { classes } = this.props;

    console.log(this.state.serviceServices);

    return (
      <div>
      <Typography variant="title">
        Service {this.state.serviceName}
      </Typography>
      <br/>
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
            <ServiceRow classes={classes} sIndex={index} ports={service.ports} protocol={service.protocol} handleRemoveService={this.handleRemoveService} handleAddService={this.handleAddService} updateServicePorts={this.updateServicePorts} updateServiceProtocol={this.updateServiceProtocol}/>
        )})}
      </TableBody>
      </Table>
      </Paper>
      </form>
      <br/>
      <Button variant='contained' onClick={this.handleUpdateButton} color="primary">
        Save
      </Button>
      <Button onClick={this.handleDeleteButton} color="primary">
        Delete
        <DeleteIcon className={classes.rightIcon}/>
      </Button>

      <Dialog
        open={this.state.deleteServiceOpen}
        onClose={this.handleDeleteCloseButton}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Confirm delete of: {this.state.serviceName}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete: {this.state.serviceName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDeleteCloseButton} color="primary">
            Cancel
          </Button>
          <Button onClick={this.deleteService} variant="contained" color="primary">
            Delete
            <DeleteIcon className={classes.rightIcon}/>
          </Button>
          &nbsp;&nbsp;{this.state.deleteServiceStatus}
        </DialogActions>
      </Dialog>
      <Dialog
        open={this.state.updateServiceOpen}
        onClose={this.handleUpdateCloseButton}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Confirm update of service: {this.state.serviceName}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to modify the service: {this.state.serviceName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleUpdateCloseButton} color="primary">
            Cancel
          </Button>
          <Button onClick={this.updateService} variant="contained" color="primary">
            Submit Change
          </Button>
          &nbsp;&nbsp;{this.state.updateServiceStatus}
        </DialogActions>
      </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
    return {

    }
}


const mapDispatchToProps = (dispatch) => {
  return {
    handleSelectedTab: (value) => dispatch(handleSelectedTab(value)),
    fetchServices: () => dispatch(servicesFetchData()),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(withStyles(styles)(Service)));
