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
import { CircularProgress, Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import ProfilesTable from './ProfilesTable';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const styles = (theme) => ({
  speedDialButton: {
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    position: 'fixed',
    color: 'secondary',
  },
});

class Profiles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      createProfileName: '',
      createProfileOpen: false,
      profileErrorOpen: false,
    };
  }

  componentDidMount() {
    if (this.props.profiles === {}) {
      this.props.fetchProfiles();
    }
    this.props.handleSelectedTab(1);
  }

  createProfile = () => {
    if (this.state.createProfileName in this.props.profiles) {
      this.setState({ profileErrorOpen: true });
    } else {
      this.setState({ isLoading: true });

      api
        .post('profile', {
          name: this.state.createProfileName,
          rules: {
            inbound: [
              {
                order: 1,
                active: false,
                states: [],
                environments: [],
                interface: 'ANY',
                group: 'any',
                group_type: 'ANY',
                service: 'any',
                action: 'ACCEPT',
                log: false,
                log_prefix: '',
                comment: '',
                type: 'BASIC',
              },
            ],
            outbound: [
              {
                order: 1,
                active: false,
                states: [],
                environments: [],
                interface: 'ANY',
                group: 'any',
                group_type: 'ANY',
                service: 'any',
                action: 'ACCEPT',
                log: false,
                log_prefix: '',
                comment: '',
                type: 'BASIC',
              },
            ],
          },
        })
        .then((response) => {
          if (response.status === 201) {
            let re = /\/api\/profile\/(.+)/;
            this.setState({ isLoading: false });
            let profileId = response.headers.location;
            let newProfileId = profileId.replace(re, '$1');
            return newProfileId;
          } else {
            throw Error(response.statusText);
          }
        })
        .then((profileId) => {
          this.setState({ createProfileOpen: false });
          this.setState({ createProfileName: '' });
          this.props.history.push('/profile/' + profileId);
          this.props.fetchGroups();
          this.props.fetchProfiles();
          this.props.fetchZones();
          this.props.fetchServices();
          this.props.fetchHosts();
          this.props.fetchLinks();
        })
        .catch(() => this.setState({ hasErrored: true }));
    }
  };

  handleProfileErrorButton = () => {
    this.setState({ profileErrorOpen: false });
  };

  handleCreateProfileOpen = () => {
    this.setState({ createProfileOpen: true });
  };

  handleCreateProfileClose = () => {
    this.setState({ createProfileOpen: false });
  };

  handleCreateProfileName = (event) => {
    this.setState({ createProfileName: event.target.value });
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
        <ProfilesTable profiles={this.props.profiles} />

        <Dialog
          open={this.state.createProfileOpen}
          onClose={this.handleCreateProfileClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create a New Profile</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the name of the profile.
            </DialogContentText>
            <form>
              <TextField
                margin="dense"
                id="profileName"
                label="Profile Name"
                value={this.state.createProfileName}
                onChange={this.handleCreateProfileName}
                required
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCreateProfileClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.createProfile}
              variant="contained"
              color="primary"
            >
              Create Profile
            </Button>
            &nbsp;&nbsp;{this.state.createProfileStatus}
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.profileErrorOpen}
          onClose={this.handleProfileErrorButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Profile Validation Errors
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              The profile name you entered already exists, please choose a
              different name.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleProfileErrorButton} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        <Fab
          color="secondary"
          aria-label="Add"
          className={classes.speedDialButton}
          onClick={this.handleCreateProfileOpen}
        >
          <AddIcon />
        </Fab>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profiles: state.profiles,
    hasErrored: state.profilesHasErrored,
    isLoading: state.profilesIsLoading,
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
)(withStyles(styles)(Profiles));
