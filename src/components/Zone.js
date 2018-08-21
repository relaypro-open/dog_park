import React, { Component } from 'react';
import { api } from '../api';
import { zonesFetchData } from '../actions/zones'
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
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DeleteIcon from '@material-ui/icons/Delete';

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

export class ZoneAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      zoneAddress: props.address,
    }

  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps ) {
      this.setState({zoneAddress: this.props.address});
    }
  }

  handleAddressField = (event) => {
    this.setState({zoneAddress: event.target.value});
    this.props.updateAddresses(this.props.index, event.target.value);
  }

  render() {

    const { classes, index, address, handleRemoveAddress, handleAddAddress, handleAddressField } = this.props;

    return (
      <TableRow>
        <TableCell>
          <TextField
            key={'field-' + index}
            fullWidth
            value={this.state.zoneAddress}
            margin="dense"
            onChange={this.handleAddressField}
            />
        </TableCell>
        <TableCell>
          <Button key={'add-' + index} variant="fab" mini color="secondary" aria-label="Add" className={classes.button} onClick={handleAddAddress}>
            <AddIcon />
          </Button>
          <Button id={index} key={'remove-' + index } variant="fab" mini  aria-label="Remove" className={classes.button} onClick={handleRemoveAddress}>
            <RemoveIcon id={index}/>
          </Button>
        </TableCell>
      </TableRow>
    )
  }

}

class Zone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      zoneId: '',
      zoneName: '',
      zoneAddresses: [],
      noExist: false,
      isLoading: false,
      hasErrored: false,
      isDeleting: false,
      deleteHasErrored: false,
      deleteZoneStatus: '',
      deleteZoneOpen: false,
      updateZoneStatus: '',
      updateZoneOpen: false,
    }

  }

  componentDidMount() {
    this.fetchZone(this.props.match.params.id);
    this.props.handleSelectedTab(4);
  }

  fetchZone(zoneId) {
    this.setState({isLoading: true});
    api.get('zone/' + zoneId )
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
    .then((zone) => {
      this.setState({zoneName: zone.name});
      this.setState({zoneId: zone.id});
      if ('addresses' in zone) {
        if (zone.addresses.length === 0) {
          this.setState({zoneAddresses: ['']});
        } else {
          this.setState({zoneAddresses: zone.addresses});
        }
      } else {
        this.setState({zoneAddresses: ['']});
      }
    })
    .catch(() => this.setState({hasErrored:true}));
  }

  updateZone = () => {
    this.setState({isLoading: true});
    this.setState({updateZoneStatus: <div><CircularProgress className={this.props.classes.progress}/></div>});
    api.put('/zone/' + this.state.zoneId, {
      'addresses': this.state.zoneAddresses
    }).then((response) => {
      if (response.status === 200) {
        this.setState({isLoading: false});
        this.setState({updateZoneStatus: ''});
        this.handleUpdateCloseButton();
        this.fetchZone(this.state.zoneId);
        return response.data;
      } else {
        throw Error(response.statusText);
      }
    })
    .then((group) => {
      console.log(group);
    })
    .catch(() => {
      this.setState({updateZoneStatus: <div>An error has occurred!</div>});
      this.setState({hasErrored:true})
    });
  }

  deleteZone = () => {
    this.setState({isDeleting: true});
    this.setState({deleteZoneStatus: <div><CircularProgress className={this.props.classes.progress}/></div>});
    api.delete('/zone/' + this.props.match.params.id
    ).then((response) => {
      if (response.status === 204) {
        this.setState({isDeleting: false});
        this.setState({deleteZoneStatus: <div>Deleted!</div>});
        this.fetchZone(this.props.match.params.id);
        this.props.fetchZones();
      } else {
        throw Error(response.statusText);
      }
    })
    .catch(() => {
      this.setState({deleteZoneStatus: <div>An error has occurred!</div>});
      this.setState({deleteHasErrored:true})
    });
  }

  handleDeleteButton = (event) => {
    this.setState({deleteZoneOpen: !this.state.deleteZoneOpen});
  }

  handleDeleteCloseButton = (event) => {
    this.setState({deleteZoneOpen: false});
  }

  updateAddresses = (index, value) => {
    let addresses = this.state.zoneAddresses;
    console.log("Index: " + index.toString());
    addresses[index] = value;
    console.log(addresses);
    this.setState({zoneAddresses: addresses});
  }

  handleRemoveAddress = (event) => {
    //console.log("Addresses " + this.state.zoneAddresses.toString());
    //console.log("Length: " + this.state.zoneAddresses.length.toString());
    //console.log("Index: " + event.target.id.toString());
    //console.log("First " + [...this.state.zoneAddresses.slice(0, event.target.id)]);
    console.log((parseInt(event.target.id, 10) + 1));
    console.log("Second " + [...this.state.zoneAddresses.slice(3, this.state.zoneAddresses.length)]);
    let newAddresses = [...this.state.zoneAddresses.slice(0, event.target.id), ...this.state.zoneAddresses.slice((parseInt(event.target.id, 10) + 1), this.state.zoneAddresses.length)];
    console.log("After " + newAddresses);
    if (newAddresses.length === 0) {
      newAddresses.push('');
    }
    this.setState({zoneAddresses: newAddresses });
  }

  handleAddAddress = (event) => {
    console.log([...this.state.zoneAddresses, ' ']);
    this.setState({zoneAddresses: [...this.state.zoneAddresses, '']});
  }

  handleUpdateCloseButton = () => {
    this.setState({updateZoneOpen: false});
  }

  handleUpdateButton = () => {
    this.setState({updateZoneOpen: true});
  }

  render() {

    if (this.state.hasErrored && this.state.noExist) {
        return <p>This zone no longer exists!</p>;
    } else if (this.state.hasErrored) {
        return <p>Sorry! There was an error loading the items</p>;
    }
    if (this.state.isLoading) {
        return <div> <CircularProgress/></div>;
    }

    const { classes } = this.props;

    return (
      <div>
      <Typography variant="title">
        Zone {this.state.zoneName}
      </Typography>
      <br/>
      <form>
      <Paper className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>Add or Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
        {this.state.zoneAddresses.map((address, index) => {
          return (
            <ZoneAddress classes={classes} index={index} address={address} handleRemoveAddress={this.handleRemoveAddress} handleAddAddress={this.handleAddAddress} updateAddresses={this.updateAddresses}/>
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
        open={this.state.deleteZoneOpen}
        onClose={this.handleDeleteCloseButton}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Confirm delete of: {this.state.zoneName}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete: {this.state.zoneName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDeleteCloseButton} color="primary">
            Cancel
          </Button>
          <Button onClick={this.deleteZone} variant="contained" color="primary">
            Delete
            <DeleteIcon className={classes.rightIcon}/>
          </Button>
          &nbsp;&nbsp;{this.state.deleteZoneStatus}
        </DialogActions>
      </Dialog>
      <Dialog
        open={this.state.updateZoneOpen}
        onClose={this.handleUpdateCloseButton}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Confirm update of zone: {this.state.zoneName}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the profile to: {this.state.zoneName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleUpdateCloseButton} color="primary">
            Cancel
          </Button>
          <Button onClick={this.updateZone} variant="contained" color="primary">
            Submit Change
          </Button>
          &nbsp;&nbsp;{this.state.updateZoneStatus}
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
    fetchZones: () => dispatch(zonesFetchData()),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(withStyles(styles)(Zone)));
