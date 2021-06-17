import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { api } from '../api';
import { groupsFetchData } from '../actions/groups';
import { flanIpsFetchData } from '../actions/flan_ips';
import { profilesFetchData } from '../actions/profiles';
import { zonesFetchData } from '../actions/zones';
import { hostsFetchData } from '../actions/hosts';
import { servicesFetchData } from '../actions/services';
import { linksFetchData } from '../actions/links';
import { CircularProgress } from '@material-ui/core';
import GroupsTable from './GroupsTable';
import ProfileSelect from './ProfileSelect';
import { handleSelectedTab } from '../actions/app';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
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

class Groups extends Component {
  constructor(props) {
    super(props);

    this.state = {
      createGroupName: '',
      createGroupProfile: '',
      createGroupOpen: false,
      createGroupDisabled: true,
      isUsingLatest: true,
      groupErrorOpen: false,
    };
  }

  componentDidMount() {
    this.props.handleSelectedTab(0);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.scanLocation !== this.props.scanLocation) {
      this.props.fetchFlanIps();
    }
  }

  createGroup = () => {
    if (
      this.state.createGroupName === '' ||
      this.state.createGroupProfile === '' ||
      this.state.createGroupName in this.props.groups.groupNames
    ) {
      this.setState({ groupErrorOpen: true });
      return;
    }
    this.setState({ isLoading: true });

    let useLatest = 'latest';
    if (this.state.isUsingLatest === false) {
      useLatest = ' ';
    }

    api
      .post('group', {
        name: this.state.createGroupName,
        profile_name: this.state.createGroupProfile,
        profile_version: useLatest,
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
        this.props.fetchProfiles();
        this.props.fetchZones();
        this.props.fetchServices();
        this.props.fetchHosts();
        this.props.fetchLinks();
        this.props.history.push('/group/' + groupId);
      })
      .catch(() => this.setState({ hasErrored: true }));
  };

  handleCreateGroupOpen = () => {
    this.setState({ createGroupOpen: true });
  };

  handleCreateGroupButton = enabled => {
    if (
      this.state.createGroupName !== '' &&
      this.state.createGroupProfile !== '' &&
      enabled
    ) {
      this.setState({ createGroupDisabled: false });
    } else {
      this.setState({ createGroupDisabled: true });
    }
  };

  handleCreateGroupClose = () => {
    this.setState({ createGroupOpen: false });
  };

  handleCreateGroupName = event => {
    const createGroupName = event.target.value;
    if (createGroupName !== '' && this.state.createGroupProfile !== '') {
      this.setState({ createGroupDisabled: false });
    } else if (createGroupName === '') {
      this.setState({ createGroupDisabled: true });
    }
    this.setState({ createGroupName });
  };

  handleCreateGroupProfile = event => {
    const createGroupProfile = event.target.value;
    if (this.state.createGroupName !== '' && createGroupProfile !== '') {
      this.setState({ createGroupDisabled: false });
    } else if (createGroupProfile === '') {
      this.setState({ createGroupDisabled: true });
    }
    this.setState({ createGroupProfile: event.target.value });
  };

  handleLatestCheckbox = () => {
    this.setState({ isUsingLatest: !this.state.isUsingLatest });
  };

  handleGroupErrorButton = () => {
    this.setState({ groupErrorOpen: false });
  };

  render() {
    if (
      this.props.hasErrored ||
      this.props.profilesHasErrored ||
      this.props.hostsHasErrored
    ) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (
      this.props.isLoading ||
      this.props.profilesIsLoading ||
      this.props.flanIpsIsLoading
    ) {
      return (
        <div>
          {' '}
          <CircularProgress />
        </div>
      );
    }

    const { classes } = this.props;

    const profiles = Object.keys(this.props.profiles)
      .sort()
      .map(profile => {
        let profileId = this.props.profiles[profile][0].id;
        return (
          <MenuItem key={profileId} value={profile}>
            {profile}
          </MenuItem>
        );
      });

    let profileVersions = '';
    if (this.state.isUsingLatest === false) {
      profileVersions = (
        <ProfileSelect
          profiles={this.props.profiles[this.state.createGroupProfile]}
          handleCreateGroupButton={this.handleCreateGroupButton}
        />
      );
    }

    return (
      <div>
        <GroupsTable
          groups={this.props.groups.groupList}
          flanIps={this.props.flanIps}
        />
        <Fab
          color="secondary"
          aria-label="Add"
          className={classes.speedDialButton}
          onClick={this.handleCreateGroupOpen}
        >
          <AddIcon />
        </Fab>

        <Dialog
          maxWidth={false}
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
                  autoWidth
                >
                  {profiles}
                </Select>
              </FormControl>
              <br />
              <br />
              <FormControlLabel
                required
                fullwidth="true"
                label="Always update to latest profile? (Useful for QA rules, not recommended for PRO rules)"
                control={
                  <Checkbox
                    checked={this.state.isUsingLatest}
                    onChange={this.handleLatestCheckbox}
                  />
                }
              />
              <br />
              <br />
              {profileVersions}
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCreateGroupClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.createGroup}
              disabled={this.state.createGroupDisabled}
              variant="contained"
              color="primary"
            >
              Create Group
            </Button>
            &nbsp;&nbsp;{this.state.createGroupStatus}
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.groupErrorOpen}
          onClose={this.handleGroupErrorButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Group Validation Errors
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              You have not entered a valid/unused group name or defined a
              profile to use. Please make sure you enter all fields and create a
              group name that does not already exist.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleGroupErrorButton} color="primary">
              Ok
            </Button>
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
    flanIps: state.flanIps,
    flanIpsHasErrored: state.flanIpsHasErrored,
    flanIpsIsLoading: state.flanIpsIsLoading,
    hostsHasErrored: state.hostsHasErrored,
    hostsIsLoading: state.hostsIsLoading,
    scanLocation: state.scanLocation,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleSelectedTab: value => dispatch(handleSelectedTab(value)),
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
)(withStyles(styles)(Groups));
