import React, { Component } from 'react';
import { api, getErrorMessage } from '../api';
import { groupsFetchData } from '../actions/groups';
import { profilesFetchData } from '../actions/profiles';
import { zonesFetchData } from '../actions/zones';
import { hostsFetchData } from '../actions/hosts';
import { servicesFetchData } from '../actions/services';
import { linksFetchData } from '../actions/links';
import { handleSelectedTab } from '../actions/app';
import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import withRouter from '../withRouter';
import { CircularProgress, Button, Fab } from '@mui/material';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import debounce from 'lodash/debounce';
import ipRegex from '../libs/ip-regex';
import cidrRegex from '../libs/cidr-regex';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const styles = (theme) => ({
  root: {
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

export class V4ZoneAddress extends Component {
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

  handleAddressField = (event) => {
    if (
      ipRegex.v4({ exact: true }).test(event.target.value) ||
      cidrRegex.v4().test(event.target.value)
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
          <Fab
            key={'add-' + index}
            size="small"
            color="secondary"
            aria-label="Add"
            className={classes.button}
            onClick={handleAddAddress}
          >
            <AddIcon />
          </Fab>
          <Fab
            id={index}
            key={'remove-' + index}
            size="small"
            aria-label="Remove"
            className={classes.button}
            onClick={handleRemoveAddress}
          >
            <RemoveIcon id={index} />
          </Fab>
        </TableCell>
      </TableRow>
    );
  }
}

export class V6ZoneAddress extends Component {
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

  handleAddressField = (event) => {
    if (
      ipRegex.v6({ exact: true }).test(event.target.value) ||
      cidrRegex.v6().test(event.target.value)
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
          <Fab
            key={'add-' + index}
            size="small"
            color="secondary"
            aria-label="Add"
            className={classes.button}
            onClick={handleAddAddress}
          >
            <AddIcon />
          </Fab>
          <Fab
            id={index}
            key={'remove-' + index}
            size="small"
            aria-label="Remove"
            className={classes.button}
            onClick={handleRemoveAddress}
          >
            <RemoveIcon id={index} />
          </Fab>
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
      v4ZoneAddresses: [],
      v6ZoneAddresses: [],
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
      areV4AddressesErrored: [],
      areV6AddressesErrored: [],
      snackBarMsg: '',
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
      .then((response) => {
        if (response.status === 200) {
          this.setState({ isLoading: false });
          return response.data;
        } else if (response.status === 404) {
          this.setState({ noExist: true });
          throw Error(getErrorMessage(response));
        } else {
          throw Error(getErrorMessage(response));
        }
      })
      .then((zone) => {
        this.setState({ zoneName: zone.name });
        this.setState({ zoneId: zone.id });
        if ('ipv4_addresses' in zone) {
          if (zone.ipv4_addresses.length === 0) {
            this.setState({ v4ZoneAddresses: [''] });
            this.setState({ areV4AddressesErrored: [true] });
          } else {
            this.setState({ v4ZoneAddresses: zone.ipv4_addresses });
            const areV4AddressesErrored = [];
            zone.ipv4_addresses.map(() => {
              areV4AddressesErrored.push(false);
              return true;
            });
            this.setState({ areV4AddressesErrored });
          }
        } else {
          this.setState({ v4ZoneAddresses: [''] });
        }
        if ('ipv6_addresses' in zone) {
          if (zone.ipv6_addresses.length === 0) {
            this.setState({ v6ZoneAddresses: [''] });
            this.setState({ areV6AddressesErrored: [true] });
          } else {
            this.setState({ v6ZoneAddresses: zone.ipv6_addresses });
            const areV6AddressesErrored = [];
            zone.ipv6_addresses.map(() => {
              areV6AddressesErrored.push(false);
              return true;
            });
            this.setState({ areV6AddressesErrored });
          }
        } else {
          this.setState({ v6ZoneAddresses: [''] });
        }
      })
      .catch((err) => this.setState({ hasErrored: err.message || true }));
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
    let ipv4_addresses = this.state.v4ZoneAddresses;
    let ipv6_addresses = this.state.v6ZoneAddresses;
    if (ipv4_addresses[ipv4_addresses.length - 1] === '') {
      ipv4_addresses.pop();
    }
    if (ipv6_addresses[ipv6_addresses.length - 1] === '') {
      ipv6_addresses.pop();
    }
    api
      .put('/zone/' + this.state.zoneId, {
        name: this.state.zoneName,
        ipv4_addresses,
        ipv6_addresses,
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ isLoading: false });
          this.setState({ updateZoneStatus: '' });
          this.handleUpdateCloseButton();
          this.fetchZone(this.state.zoneId);
          this.props.fetchGroups();
          this.props.fetchProfiles();
          this.props.fetchZones();
          this.props.fetchServices();
          this.props.fetchHosts();
          this.props.fetchLinks();
          this.setState({
            snackBarMsg:
              this.state.zoneName + ' has been modified successfully!',
          });
          return response.data;
        } else {
          throw Error(getErrorMessage(response));
        }
      })
      .then((zone) => {
        this.setState({ snackBarOpen: true });
      })
      .catch((error) => {
        this.setState({ updateZoneStatus: <div>{error.message || 'An error has occurred!'}</div> });
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
      .then((response) => {
        if (response.status === 204) {
          this.setState({ isDeleting: false });
          this.setState({ deleteZoneStatus: <div>Deleted!</div> });
          this.props.history.push('/zones');
        } else if (response.status === 500 && response.data && response.data.errors) {
          let error_msg = Object.entries(response.data.errors).map(
            ([key, value]) => {
              return `${key}: ${value.map((entry) => {
                return this.props.profiles.profileIds[entry];
              })}`;
            }
          );
          throw Error(error_msg);
        } else {
          throw Error(getErrorMessage(response));
        }
      })
      .catch((error) => {
        this.setState({
          deleteZoneStatus: (
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
    this.setState({ deleteZoneOpen: !this.state.deleteZoneOpen });
  };

  handleDeleteCloseButton = (event) => {
    this.setState({ deleteZoneOpen: false });
  };

  updateV4Addresses = (index, value, isErrored) => {
    const v4ZoneAddresses = [...this.state.v4ZoneAddresses];
    const areV4AddressesErrored = [...this.state.areV4AddressesErrored];
    v4ZoneAddresses[index] = value;
    areV4AddressesErrored[index] = isErrored;
    this.setState({ v4ZoneAddresses });
    this.setState({ areV4AddressesErrored });
  };

  updateV6Addresses = (index, value, isErrored) => {
    const v6ZoneAddresses = [...this.state.v6ZoneAddresses];
    const areV6AddressesErrored = [...this.state.areV6AddressesErrored];
    v6ZoneAddresses[index] = value;
    areV6AddressesErrored[index] = isErrored;
    this.setState({ v6ZoneAddresses });
    this.setState({ areV6AddressesErrored });
  };

  handleRemoveV4Address = (event) => {
    const v4ZoneAddresses = [
      ...this.state.v4ZoneAddresses.slice(0, event.target.id),
      ...this.state.v4ZoneAddresses.slice(
        parseInt(event.target.id, 10) + 1,
        this.state.v4ZoneAddresses.length
      ),
    ];
    const areV4AddressesErrored = [
      ...this.state.areV4AddressesErrored.slice(0, event.target.id),
      ...this.state.areV4AddressesErrored.slice(
        parseInt(event.target.id, 10) + 1,
        this.state.areV4AddressesErrored.length
      ),
    ];
    if (v4ZoneAddresses.length === 0) {
      v4ZoneAddresses.push('');
      areV4AddressesErrored.push(true);
    }
    this.setState({ v4ZoneAddresses });
    this.setState({ areV4AddressesErrored });
  };

  handleRemoveV6Address = (event) => {
    const v6ZoneAddresses = [
      ...this.state.v6ZoneAddresses.slice(0, event.target.id),
      ...this.state.v6ZoneAddresses.slice(
        parseInt(event.target.id, 10) + 1,
        this.state.v6ZoneAddresses.length
      ),
    ];
    const areV6AddressesErrored = [
      ...this.state.areV6AddressesErrored.slice(0, event.target.id),
      ...this.state.areV6AddressesErrored.slice(
        parseInt(event.target.id, 10) + 1,
        this.state.areV6AddressesErrored.length
      ),
    ];
    if (v6ZoneAddresses.length === 0) {
      v6ZoneAddresses.push('');
      areV6AddressesErrored.push(true);
    }
    this.setState({ v6ZoneAddresses });
    this.setState({ areV6AddressesErrored });
  };

  handleAddV4Address = (event) => {
    this.setState({ v4ZoneAddresses: [...this.state.v4ZoneAddresses, ''] });
    this.setState({
      areV4AddressesErrored: [...this.state.areV4AddressesErrored, false],
    });
  };

  handleAddV6Address = (event) => {
    this.setState({ v6ZoneAddresses: [...this.state.v6ZoneAddresses, ''] });
    this.setState({
      areV6AddressesErrored: [...this.state.areV6AddressesErrored, false],
    });
  };

  handleUpdateCloseButton = () => {
    this.setState({ updateZoneOpen: false });
  };

  handleAddressErrorButton = () => {
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
    const v4IsErrored = this.state.areV4AddressesErrored.reduce(reducer);
    const v6IsErrored = this.state.areV6AddressesErrored.reduce(reducer);
    if (v4IsErrored && v6IsErrored) {
      this.setState({ addressErrorOpen: true });
    } else if (v4IsErrored && !v6IsErrored) {
      if (
        this.state.v4ZoneAddresses.length === 1 &&
        this.state.v4ZoneAddresses[0] === ''
      ) {
        this.setState({ updateZoneOpen: true });
      } else {
        this.setState({ addressErrorOpen: true });
      }
    } else if (v6IsErrored && !v4IsErrored) {
      if (
        this.state.v6ZoneAddresses.length === 1 &&
        this.state.v6ZoneAddresses[0] === ''
      ) {
        this.setState({ updateZoneOpen: true });
      } else {
        this.setState({ addressErrorOpen: true });
      }
    } else {
      this.setState({ updateZoneOpen: true });
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
      return <p>This zone no longer exists!</p>;
    } else if (this.state.hasErrored) {
      return <p>{typeof this.state.hasErrored === 'string' ? this.state.hasErrored : (typeof this.props.profilesHasErrored === 'string' ? this.props.profilesHasErrored : (typeof this.props.hostsHasErrored === 'string' ? this.props.hostsHasErrored : 'Sorry! There was an error loading the items'))}</p>;
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
        <Typography variant="subtitle1">Zone {this.state.zoneName}</Typography>
        <br />
        <form>
          <Typography variant="h4">IPv4 Addresses</Typography>
          <Paper className={classes.root}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>Add or Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.v4ZoneAddresses.map((address, index) => {
                  return (
                    <V4ZoneAddress
                      classes={classes}
                      key={'v4Address' + index}
                      index={index}
                      address={address}
                      handleRemoveAddress={this.handleRemoveV4Address}
                      handleAddAddress={this.handleAddV4Address}
                      updateAddresses={this.updateV4Addresses}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
          <br />
          <br />
          <Typography variant="h4">IPv6 Addresses</Typography>
          <Paper className={classes.root}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>Add or Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.v6ZoneAddresses.map((address, index) => {
                  return (
                    <V6ZoneAddress
                      classes={classes}
                      key={'v6Address' + index}
                      index={index}
                      address={address}
                      handleRemoveAddress={this.handleRemoveV6Address}
                      handleAddAddress={this.handleAddV6Address}
                      updateAddresses={this.updateV6Addresses}
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
              {this.state.deleteZoneStatus}
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
          onClose={this.handleAddressErrorButton}
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
            <Button onClick={this.handleAddressErrorButton} color="primary">
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
)(withRouter(withStyles(styles)(Zone)));
