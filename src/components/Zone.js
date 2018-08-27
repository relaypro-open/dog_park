import React, { Component } from 'react';
import { api } from '../api';
import { zonesFetchData } from '../actions/zones';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { CircularProgress, Button } from '@material-ui/core';
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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import debounce from 'lodash/debounce';
import ipRegex from 'ip-regex';
import cidrRegex from 'cidr-regex';

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

    let addressError = false;
    if (props.address === '') {
      addressError = true;
    }

    this.state = {
      zoneAddress: props.address,
      addressError,
    };

    this.addressField = debounce(this.props.updateAddresses, 500);
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({ zoneAddress: this.props.address });
    }
  }

  handleAddressField = event => {
    if (
      ipRegex({ exact: true }).test(event.target.value) ||
      cidrRegex({ exact: true }).test(event.target.value)
    ) {
      this.setState({ addressError: false });
      this.addressField(this.props.index, event.target.value, false);
    } else {
      this.setState({ addressError: true });
      this.addressField(this.props.index, event.target.value, true);
    }
    this.setState({ zoneAddress: event.target.value });
  };

  render() {
    const {
      classes,
      index,
      handleRemoveAddress,
      handleAddAddress,
    } = this.props;

    return (
      <TableRow>
        <TableCell>
          <TextField
            error={this.state.addressError}
            key={'field-' + index}
            fullWidth
            value={this.state.zoneAddress}
            margin="dense"
            onChange={this.handleAddressField}
          />
        </TableCell>
        <TableCell>
          <Button
            key={'add-' + index}
            variant="fab"
            mini
            color="secondary"
            aria-label="Add"
            className={classes.button}
            onClick={handleAddAddress}
          >
            <AddIcon />
          </Button>
          <Button
            id={index}
            key={'remove-' + index}
            variant="fab"
            mini
            aria-label="Remove"
            className={classes.button}
            onClick={handleRemoveAddress}
          >
            <RemoveIcon id={index} />
          </Button>
        </TableCell>
      </TableRow>
    );
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
      addressErrorOpen: false,
      areAddressesErrored: [],
    };
  }

  componentDidMount() {
    this.fetchZone(this.props.match.params.id);
    this.props.handleSelectedTab(4);
  }

  fetchZone(zoneId) {
    this.setState({ isLoading: true });
    api
      .get('zone/' + zoneId)
      .then(response => {
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
      .then(zone => {
        this.setState({ zoneName: zone.name });
        this.setState({ zoneId: zone.id });
        if ('addresses' in zone) {
          if (zone.addresses.length === 0) {
            this.setState({ zoneAddresses: [''] });
            this.setState({ areAddressesErrored: [true] });
          } else {
            this.setState({ zoneAddresses: zone.addresses });
            const areAddressesErrored = [];
            zone.addresses.map(() => {
              areAddressesErrored.push(false);
              return true;
            });
            this.setState({ areAddressesErrored });
          }
        } else {
          this.setState({ zoneAddresses: [''] });
        }
      })
      .catch(() => this.setState({ hasErrored: true }));
  }

  updateZone = () => {
    this.setState({ isLoading: true });
    this.setState({
      updateZoneStatus: (
        <div>
          <CircularProgress className={this.props.classes.progress} />
        </div>
      ),
    });
    api
      .put('/zone/' + this.state.zoneId, {
        name: this.state.zoneName,
        addresses: this.state.zoneAddresses,
      })
      .then(response => {
        if (response.status === 200) {
          this.setState({ isLoading: false });
          this.setState({ updateZoneStatus: '' });
          this.handleUpdateCloseButton();
          this.fetchZone(this.state.zoneId);
          return response.data;
        } else {
          throw Error(response.statusText);
        }
      })
      .then(group => {})
      .catch(() => {
        this.setState({ updateZoneStatus: <div>An error has occurred!</div> });
        this.setState({ hasErrored: true });
      });
  };

  deleteZone = () => {
    this.setState({ isDeleting: true });
    this.setState({
      deleteZoneStatus: (
        <div>
          <CircularProgress className={this.props.classes.progress} />
        </div>
      ),
    });
    api
      .delete('/zone/' + this.props.match.params.id)
      .then(response => {
        if (response.status === 204) {
          this.setState({ isDeleting: false });
          this.setState({ deleteZoneStatus: <div>Deleted!</div> });
          this.fetchZone(this.props.match.params.id);
          this.props.fetchZones();
        } else {
          throw Error(response.statusText);
        }
      })
      .catch(() => {
        this.setState({ deleteZoneStatus: <div>An error has occurred!</div> });
        this.setState({ deleteHasErrored: true });
      });
  };

  handleDeleteButton = event => {
    this.setState({ deleteZoneOpen: !this.state.deleteZoneOpen });
  };

  handleDeleteCloseButton = event => {
    this.setState({ deleteZoneOpen: false });
  };

  updateAddresses = (index, value, isErrored) => {
    const zoneAddresses = [...this.state.zoneAddresses];
    const areAddressesErrored = [...this.state.areAddressesErrored];
    zoneAddresses[index] = value;
    areAddressesErrored[index] = isErrored;
    this.setState({ zoneAddresses });
    this.setState({ areAddressesErrored });
  };

  handleRemoveAddress = event => {
    const zoneAddresses = [
      ...this.state.zoneAddresses.slice(0, event.target.id),
      ...this.state.zoneAddresses.slice(
        parseInt(event.target.id, 10) + 1,
        this.state.zoneAddresses.length
      ),
    ];
    const areAddressesErrored = [
      ...this.state.areAddressesErrored.slice(0, event.target.id),
      ...this.state.areAddressesErrored.slice(
        parseInt(event.target.id, 10) + 1,
        this.state.areAddressesErrored.length
      ),
    ];
    if (zoneAddresses.length === 0) {
      zoneAddresses.push('');
      areAddressesErrored.push(true);
    }
    this.setState({ zoneAddresses });
    this.setState({ areAddressesErrored });
  };

  handleAddAddress = event => {
    this.setState({ zoneAddresses: [...this.state.zoneAddresses, ''] });
    this.setState({
      areAddressesErrored: [...this.state.areAddressesErrored, false],
    });
  };

  handleUpdateCloseButton = () => {
    this.setState({ updateZoneOpen: false });
  };

  handleaddressErrorButton = () => {
    this.setState({ addressErrorOpen: false });
  };

  handleUpdateButton = () => {
    const reducer = (acc, current) => {
      if (current) {
        return true;
      } else {
        return acc;
      }
    };
    const isErrored = this.state.areAddressesErrored.reduce(reducer);
    if (isErrored) {
      this.setState({ addressErrorOpen: true });
    } else {
      this.setState({ updateZoneOpen: true });
    }
  };

  render() {
    if (this.state.hasErrored && this.state.noExist) {
      return <p>This zone no longer exists!</p>;
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
        <Typography variant="title">Zone {this.state.zoneName}</Typography>
        <br />
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
                    <ZoneAddress
                      classes={classes}
                      index={index}
                      address={address}
                      handleRemoveAddress={this.handleRemoveAddress}
                      handleAddAddress={this.handleAddAddress}
                      updateAddresses={this.updateAddresses}
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
          open={this.state.deleteZoneOpen}
          onClose={this.handleDeleteCloseButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Confirm delete of: {this.state.zoneName}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete: {this.state.zoneName}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeleteCloseButton} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.deleteZone}
              variant="contained"
              color="primary"
            >
              Delete
              <DeleteIcon className={classes.rightIcon} />
            </Button>
            &nbsp;&nbsp;{this.state.deleteZoneStatus}
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.updateZoneOpen}
          onClose={this.handleUpdateCloseButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Confirm update of zone: {this.state.zoneName}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to change the profile to:{' '}
              {this.state.zoneName}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleUpdateCloseButton} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.updateZone}
              variant="contained"
              color="primary"
            >
              Submit Change
            </Button>
            &nbsp;&nbsp;{this.state.updateZoneStatus}
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.addressErrorOpen}
          onClose={this.handleaddressErrorButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Zone Validation Errors
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              You have invalid ips/cidr ranges defined. Please fix these before
              updating zone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleaddressErrorButton} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    handleSelectedTab: value => dispatch(handleSelectedTab(value)),
    fetchZones: () => dispatch(zonesFetchData()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Zone)));
