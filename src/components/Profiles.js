import React, { Component } from 'react';
import { connect } from 'react-redux';
import { api } from '../api';
import { withStyles } from '@material-ui/core/styles';
import { profilesFetchData } from '../actions/profiles';
import { handleSelectedTab } from '../actions/app';
import { CircularProgress, Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import ProfilesTable from './ProfilesTable';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
  speedDialButton: {
    right: theme.spacing.unit * 3,
    bottom: theme.spacing.unit * 3,
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
    };
  }

  componentDidMount() {
    if (this.props.profiles === {}) {
      this.props.fetchProfiles();
    }
    this.props.handleSelectedTab(1);
  }

  createProfile = () => {
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
              interface: '',
              group: ' ',
              group_type: 'ANY',
              service: ' ',
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
              interface: '',
              group: ' ',
              group_type: 'ANY',
              service: ' ',
              action: 'ACCEPT',
              log: false,
              log_prefix: '',
              comment: '',
              type: 'BASIC',
            },
          ],
        },
      })
      .then(response => {
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
      .then(profileId => {
        this.setState({ createProfileOpen: false });
        this.setState({ createProfileName: '' });
        this.props.history.push('/profile/' + profileId);
        this.props.fetchProfiles();
      })
      .catch(() => this.setState({ hasErrored: true }));
  };

  handleCreateProfileOpen = () => {
    this.setState({ createProfileOpen: true });
  };

  handleCreateProfileClose = () => {
    this.setState({ createProfileOpen: false });
  };

  handleCreateProfileName = event => {
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

    console.log(this.props.profiles);

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
        <Button
          variant="fab"
          color="secondary"
          aria-label="Add"
          className={classes.speedDialButton}
          onClick={this.handleCreateProfileOpen}
        >
          <AddIcon />
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    profiles: state.profiles,
    hasErrored: state.profilesHasErrored,
    isLoading: state.profilesIsLoading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchProfiles: () => dispatch(profilesFetchData()),
    handleSelectedTab: value => dispatch(handleSelectedTab(value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Profiles));
