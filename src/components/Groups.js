import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { api } from '../api';
import { profilesFetchData } from '../actions/profiles';
import { groupsFetchData } from '../actions/groups';
import { CircularProgress } from '@material-ui/core';
import GroupsTable from './GroupsTable';
import { handleSelectedTab } from '../actions/app';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    maxWidth: 700,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  progress: {
    margin: 'auto',
    width: '50%',
  },
  speedDialButton: {
    right: theme.spacing.unit * 3,
    bottom: theme.spacing.unit * 3,
    position: 'fixed',
    color: 'secondary',
  },
});

class Groups extends Component {
  constructor(props) {
    super(props);

    this.state = {
      createGroupName: '',
      createGroupProfile: '',
      createGroupOpen: false,
    };
  }

  componentDidMount() {
    this.props.handleSelectedTab(0);
    //this.props.fetchGroups();
  }

  createGroup = () => {
    this.setState({ isLoading: true });

    api
      .post('group', {
        name: this.state.createGroupName,
        profile_name: this.state.createGroupProfile,
        profile_version: 'latest',
      })
      .then(response => {
        if (response.status === 201) {
          let re = /\/api\/group\/(.+)/;
          this.setState({ isLoading: false });
          let groupId = response.headers.location;
          let newGroupId = groupId.replace(re, '$1');
          return newGroupId;
        } else {
          throw Error(response.statusText);
        }
      })
      .then(groupId => {
        this.setState({ createGroupOpen: false });
        this.setState({ createGroupName: '' });
        this.setState({ createGroupProfile: '' });
        this.props.fetchGroups();
        this.props.history.push('/group/' + groupId);
      })
      .catch(() => this.setState({ hasErrored: true }));
  };

  handleCreateGroupOpen = () => {
    this.setState({ createGroupOpen: true });
  };

  handleCreateGroupClose = () => {
    this.setState({ createGroupOpen: false });
  };

  handleCreateGroupName = event => {
    this.setState({ createGroupName: event.target.value });
  };

  handleCreateGroupProfile = event => {
    this.setState({ createGroupProfile: event.target.value });
  };

  render() {
    if (this.props.hasErrored || this.props.profilesHasErrored) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (this.props.isLoading || this.props.profilesIsLoading) {
      return (
        <div>
          {' '}
          <CircularProgress />
        </div>
      );
    }

    const { classes } = this.props;

    const profiles = Object.keys(this.props.profiles).map(profile => {
      let profileId = this.props.profiles[profile][0].id;
      return (
        <MenuItem key={profileId} value={profile}>
          {profile}
        </MenuItem>
      );
    });

    return (
      <div>
        <GroupsTable groups={this.props.groups} />
        <Button
          variant="fab"
          color="secondary"
          aria-label="Add"
          className={classes.speedDialButton}
          onClick={this.handleCreateGroupOpen}
        >
          <AddIcon />
        </Button>

        <Dialog
          open={this.state.createGroupOpen}
          onClose={this.handleCreateGroupClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create a New Group</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the name of the group and the profile that you would
              like associated with it.
            </DialogContentText>
            <form>
              <TextField
                autoFocus
                margin="dense"
                id="groupName"
                label="Group Name"
                value={this.state.createGroupName}
                onChange={this.handleCreateGroupName}
                required
                fullWidth
              />
              <br />
              <br />
              <FormControl required fullWidth>
                <InputLabel>Group Profile</InputLabel>
                <Select
                  value={this.state.createGroupProfile}
                  onChange={this.handleCreateGroupProfile}
                  fullWidth
                >
                  {profiles}
                </Select>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCreateGroupClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.createGroup}
              variant="contained"
              color="primary"
            >
              Create Group
            </Button>
            &nbsp;&nbsp;{this.state.createGroupStatus}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    groups: state.groups,
    hasErrored: state.groupsHasErrored,
    isLoading: state.groupsIsLoading,
    profiles: state.profiles,
    profilesHasErrored: state.profilesHasErrored,
    profilesIsLoading: state.profilesIsLoading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleSelectedTab: value => dispatch(handleSelectedTab(value)),
    fetchProfiles: () => dispatch(profilesFetchData()),
    fetchGroups: () => dispatch(groupsFetchData()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Groups));
