import React, { Component } from 'react';
import { connect } from 'react-redux';
import { api } from '../api';
import { withStyles } from '@material-ui/core/styles';
import { groupsFetchData } from '../actions/groups';
import { flanIpsFetchData } from '../actions/flan_ips';
import { profilesFetchData } from '../actions/profiles';
import { zonesFetchData } from '../actions/zones';
import { hostsFetchData } from '../actions/hosts';
import { servicesFetchData } from '../actions/services';
import { linksFetchData } from '../actions/links';
import { handleSelectedTab } from '../actions/app';
import { CircularProgress } from '@material-ui/core';
import ZonesTable from './ZonesTable';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';

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

class Zones extends Component {
  constructor(props) {
    super(props);

    this.state = {
      createZoneName: '',
      createZoneProfile: '',
      createZoneStatus: '',
      createZoneOpen: false,
    };
  }

  componentDidMount() {
    if (this.props.zones === []) {
      this.props.fetchZones();
    }
    this.props.handleSelectedTab(4);
  }

  createZone = () => {
    if (
      this.state.createZoneName === '' ||
      this.state.createZoneName in this.props.zones.zoneNames
    ) {
      this.setState({
        createZoneStatus: 'Please enter a valid/unused zone name!',
      });
    } else {
      this.setState({ isLoading: true });

      api
        .post('zone', {
          name: this.state.createZoneName,
          ipv4_addresses: [],
          ipv6_addresses: [],
        })
        .then((response) => {
          if (response.status === 201) {
            let re = /\/api\/zone\/(.+)/;
            this.setState({ isLoading: false });
            let zoneId = response.headers.location;
            let newZoneId = zoneId.replace(re, '$1');
            return newZoneId;
          } else {
            throw Error(response.statusText);
          }
        })
        .then((zoneId) => {
          this.setState({ createZoneOpen: false });
          this.setState({ createZoneName: '' });
          this.props.fetchGroups();
          this.props.fetchProfiles();
          this.props.fetchZones();
          this.props.fetchServices();
          this.props.fetchHosts();
          this.props.fetchLinks();
          this.props.history.push('/zone/' + zoneId);
        })
        .catch(() => this.setState({ hasErrored: true }));
    }
  };

  handleCreateZoneButton = () => {
    this.setState({ createZoneOpen: true });
  };

  handleCreateZoneClose = () => {
    this.setState((state, props) => {
      return {
        createZoneOpen: false,
        createZoneStatus: '',
      };
    });
  };

  handleCreateZoneName = (event) => {
    this.setState({ createZoneName: event.target.value });
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
        <ZonesTable zones={this.props.zones.zoneList} />
        <Fab
          color="secondary"
          aria-label="Add"
          className={classes.speedDialButton}
          onClick={this.handleCreateZoneButton}
        >
          <AddIcon />
        </Fab>

        <Dialog
          open={this.state.createZoneOpen}
          onClose={this.handleCreateZoneClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create a New Zone</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the name of the zone.
            </DialogContentText>
            <form>
              <TextField
                autoFocus
                margin="dense"
                id="zoneName"
                label="Zone Name"
                value={this.state.createZoneName}
                onChange={this.handleCreateZoneName}
                required
                fullWidth
              />
              <br />
              <br />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCreateZoneClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.createZone}
              variant="contained"
              color="primary"
            >
              Create Zone
            </Button>
            &nbsp;&nbsp;{this.state.createZoneStatus}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    zones: state.zones,
    hasErrored: state.zonesHasErrored,
    isLoading: state.zonesIsLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGroups: () => dispatch(groupsFetchData()),
    fetchFlanIps: () => dispatch(flanIpsFetchData()),
    fetchProfiles: () => dispatch(profilesFetchData()),
    fetchZones: () => dispatch(zonesFetchData()),
    fetchHosts: () => dispatch(hostsFetchData()),
    fetchServices: () => dispatch(servicesFetchData()),
    fetchLinks: () => dispatch(linksFetchData()),
    handleSelectedTab: (value) => dispatch(handleSelectedTab(value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Zones));
