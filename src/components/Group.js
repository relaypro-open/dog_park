import React, { Component } from 'react';
import { api } from '../api';
import { groupsFetchData } from '../actions/groups';
import { flanIpsFetchData } from '../actions/flan_ips';
import { profilesFetchData } from '../actions/profiles';
import { zonesFetchData } from '../actions/zones';
import { hostsFetchData } from '../actions/hosts';
import { servicesFetchData } from '../actions/services';
import { linksFetchData } from '../actions/links';
import { handleSelectedTab } from '../actions/app';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Button } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import HostsTable from './HostsTable';
import GitDiff from './GitDiff';
import GitChanges from './GitChanges';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

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
  close: {
    padding: theme.spacing(0.5),
  },
});

class Group extends Component {
  constructor(props) {
    super(props);

    this.state = {
      group: null,
      hasErrored: false,
      isLoading: false,
      noExist: false,
      groupName: '',
      groupId: '',
      groupCreated: '',
      groupProfileName: '',
      groupProfileId: '',
      groupProfileVersion: '',
      groupHosts: [],
      saveGroupOpen: false,
      isDeleting: false,
      deleteHasErrored: false,
      deleteGroupStatus: '',
      deleteGroupOpen: false,
      saveButtonDisabled: true,
      defaultGroupName: '',
      defaultProfileName: '',
      defaultProfileId: '',
      editGroupStatus: '',
      isProfileDiff: false,
      profileDiffOpen: false,
      snackBarOpen: false,
      snackBarMsg: '',
    };
  }

  componentDidMount = () => {
    if (this.props.profiles === {}) {
      this.props.fetchProfiles();
    }
    if (this.props.match.path === '/groupByName/:id') {
      this.fetchGroupByName(this.props.match.params.id);
    } else {
      this.fetchGroup(this.props.match.params.id);
    }
    this.props.handleSelectedTab(0);
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.fetchGroup(this.props.match.params.id);
      this.fetchGroupHosts(this.props.match.params.id);
      this.props.handleSelectedTab(0);
      this.setState({ isLoading: false });
      this.setState({ hasErrored: false });
      this.setState({ noExist: false });
      this.setState({ isDeleting: false });
      this.setState({ deleteHasErrored: false });
      this.setState({ editGroupStatus: '' });
      this.setState({ deleteGroupStatus: '' });
      this.setState({ saveButtonDisabled: true });
    }
  };

  fetchGroupByName = (groupName) => {
    this.setState({ isLoading: true });

    api
      .get('group?name=' + groupName)
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
      .then((group) => {
        this.groupId = group.id;
        this.setState(group);
        this.setState({ groupName: group.name });
        this.setState({ defaultGroupName: group.name });
        this.setState({ groupId: group.id });
        this.setState({ groupCreated: group.created });
        if ('profile_name' in group) {
          this.setState({ groupProfileName: group.profile_name });
          this.setState({ defaultProfileName: group.profile_name });
        } else {
          this.setState({ groupProfileName: '' });
        }
        if ('profile_version' in group) {
          this.setState({ groupProfileVersion: group.profile_version });
        } else {
          this.setState({ groupProfileVersion: '' });
        }
        if ('profile_id' in group) {
          this.setState({ groupProfileId: group.profile_id });
          this.setState({ defaultProfileId: group.profile_id });
        } else {
          this.setState({ groupProfileVersion: '' });
        }
        return group.id;
      })
      .then((id) => {
        this.fetchGroupHosts(id);
      })
      .catch(() => this.setState({ hasErrored: true }));
  };

  fetchGroup = (groupId) => {
    this.setState({ isLoading: true });

    api
      .get('group/' + groupId)
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
      .then((group) => {
        this.setState(group);
        this.setState({ groupName: group.name });
        this.setState({ defaultGroupName: group.name });
        this.setState({ groupId: group.id });
        this.setState({ groupCreated: group.created });
        if ('profile_name' in group) {
          this.setState({ groupProfileName: group.profile_name });
          this.setState({ defaultProfileName: group.profile_name });
        } else {
          this.setState({ groupProfileName: '' });
        }
        if ('profile_version' in group) {
          this.setState({ groupProfileVersion: group.profile_version });
        } else {
          this.setState({ groupProfileVersion: '' });
        }
        if ('profile_id' in group) {
          this.setState({ groupProfileId: group.profile_id });
          this.setState({ defaultProfileId: group.profile_id });
        } else {
          this.setState({ groupProfileVersion: '' });
        }
        return group.id;
      })
      .then((id) => {
        this.fetchGroupHosts(id);
      })
      .catch(() => this.setState({ hasErrored: true }));
  };

  fetchGroupHosts = (groupId) => {
    //this.setState({ isLoading: true });

    api
      .get('group/' + groupId + '/hosts')
      .then((response) => {
        if (response.status === 200) {
          //this.setState({ isLoading: false });
          return response.data;
        } else if (response.status === 404) {
          this.setState({ noExist: true });
          throw Error(response.statusText);
        } else {
          throw Error(response.statusText);
        }
      })
      .then((group) => {
        this.setState({ groupHosts: group });
      })
      .catch(() => this.setState({ hasErrored: true }));
  };

  fetchHostGroup = (hostId) => {
    return api.get('host/' + hostId);
  };

  updateGroup = () => {
    this.setState({ isLoading: true });
    this.setState({
      editGroupStatus: (
        <div>
          <CircularProgress className={this.props.classes.progress} />
        </div>
      ),
    });
    api
      .put('/group/' + this.state.groupId, {
        name: this.state.groupName,
        profile_name: this.state.groupProfileName,
        profile_id: this.props.profiles[this.state.groupProfileName][0].id,
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ isLoading: false });
          this.setState({ editGroupStatus: '' });
          this.setState({
            defaultProfileId: this.props.profiles[
              this.state.groupProfileName
            ][0].id,
          });
          this.setState({ defaultProfileName: this.state.groupProfileName });
          this.setState({ saveButtonDisabled: true });
          this.handleCloseButton();
          this.fetchGroup(this.state.groupId);
          this.props.fetchGroups();
          this.props.fetchProfiles();
          this.props.fetchZones();
          this.props.fetchServices();
          this.props.fetchHosts();
          this.props.fetchLinks();
          this.setState({
            snackBarMsg:
              this.state.groupName + ' has been modified successfully!',
          });
          return response.data;
        } else {
          throw Error(response.statusText);
        }
      })
      .then((group) => {
        this.setState({ snackBarOpen: true });
      })
      .catch(() => {
        this.setState({ editGroupStatus: <div>An error has occurred!</div> });
        this.setState({ hasErrored: true });
      });
  };

  updateProfile = () => {
    this.setState({ isLoading: true });
    this.setState({
      editGroupStatus: (
        <div>
          <CircularProgress className={this.props.classes.progress} />
        </div>
      ),
    });
    api
      .put('/group/' + this.state.groupId, {
        name: this.state.groupName,
        profile_name: this.state.groupProfileName,
        profile_id: this.props.profiles[this.state.groupProfileName][0].id,
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ isLoading: false });
          this.setState({ editGroupStatus: '' });
          this.setState({
            defaultProfileId: this.props.profiles[
              this.state.groupProfileName
            ][0].id,
          });
          this.setState({ defaultProfileName: this.state.groupProfileName });
          this.setState({ saveButtonDisabled: true });
          this.handleProfileDiffCloseButton();
          this.fetchGroup(this.state.groupId);
          this.props.fetchGroups();
          this.props.fetchProfiles();
          this.props.fetchZones();
          this.props.fetchServices();
          this.props.fetchHosts();
          this.props.fetchLinks();
          return response.data;
        } else {
          throw Error(response.statusText);
        }
      })
      .then((group) => {})
      .catch(() => {
        this.setState({ editGroupStatus: <div>An error has occurred!</div> });
        this.setState({ hasErrored: true });
      });
  };

  deleteGroup = () => {
    this.setState({ isDeleting: true });
    this.setState({
      deleteGroupStatus: (
        <div>
          <CircularProgress className={this.props.classes.progress} />
        </div>
      ),
    });
    api
      .delete('/group/' + this.props.match.params.id)
      .then((response) => {
        if (response.status === 204) {
          this.setState({ isDeleting: false });
          this.setState({ deleteGroupStatus: <div>Deleted!</div> });
          this.fetchGroup(this.props.match.params.id);
          this.props.fetchGroups();
          this.props.fetchProfiles();
          this.props.fetchZones();
          this.props.fetchServices();
          this.props.fetchHosts();
          this.props.fetchLinks();
        } else {
          throw Error(response.statusText);
        }
      })
      .catch(() => {
        this.setState({ deleteGroupStatus: <div>An error has occurred!</div> });
        this.setState({ deleteHasErrored: true });
      });
  };

  checkProfileDiff = () => {
    if (
      this.state.defaultProfileId !==
      this.props.profiles[this.state.groupProfileName][0].id
    ) {
      this.setState({ isProfileDiff: true });
    }
  };

  handleNameInput = (event) => {
    this.setState({ groupName: event.target.value });
  };

  handleIdInput = (event) => {
    this.setState({ groupId: event.target.value });
  };

  handleProfileNameInput = (event) => {
    this.setState({ groupProfileName: event.target.value });
  };

  handleProfileSelect = (event) => {
    this.setState({ groupProfileName: event.target.value });
    if (event.target.value !== this.state.defaultProfileName) {
      this.setState({ saveButtonDisabled: false });
    } else {
      this.setState({ saveButtonDisabled: true });
    }
  };

  handleProfileVersionInput = (event) => {
    this.setState({ groupProfileVersion: event.target.value });
  };

  handleEditButton = (event) => {
    this.setState({ editGroupOpen: !this.state.editGroupOpen });
  };

  handleSaveButton = (event) => {
    this.setState({ saveGroupOpen: !this.state.saveGroupOpen });
  };

  handleDeleteButton = (event) => {
    this.setState({ deleteGroupOpen: !this.state.deleteGroupOpen });
  };

  handleCloseButton = (event) => {
    this.setState({ saveGroupOpen: false });
  };

  handleDeleteCloseButton = (event) => {
    this.setState({ deleteGroupOpen: false });
  };

  handleProfileDiffButton = (event) => {
    const diffOutput = (
      <GitDiff
        profile1={this.state.defaultProfileId}
        profile2={this.props.profiles[this.state.groupProfileName][0].id}
      />
    );

    const diffChanges = (
      <GitChanges
        profile1={this.state.defaultProfileId}
        profile2={this.props.profiles[this.state.groupProfileName][0].id}
      />
    );

    this.setState({ diffOutput });
    this.setState({ diffChanges });
    this.setState({ profileDiffOpen: !this.state.profileDiffOpen });
  };

  handleProfileDiffCloseButton = (event) => {
    this.setState({ profileDiffOpen: false });
  };

  handleSnackBarOpen = () => {
    this.setState({ snackBarOpen: true });
  };

  handleSnackBarClose = (event, reason) => {
    this.setState({ snackBarOpen: false });
  };

  handleNameInput = (event) => {
    this.setState({ groupName: event.target.value });
    if (event.target.value !== this.state.defaultGroupName) {
      this.setState({ saveButtonDisabled: false });
    } else {
      this.setState({ saveButtonDisabled: true });
    }
  };

  render() {
    if (this.state.hasErrored && this.state.noExist) {
      return <p>This group no longer exists!</p>;
    } else if (
      this.state.hasErrored ||
      this.props.profilesHasErrored ||
      this.props.hostsHasErrored
    ) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (
      this.state.isLoading ||
      this.props.profilesIsLoading ||
      this.state.isDeleting ||
      this.props.hostsIsLoading ||
      this.props.flanIpsIsLoading
    ) {
      return (
        <div>
          {' '}
          <CircularProgress className={this.props.classes.progress} />
        </div>
      );
    }

    const { classes, hosts, flanIps } = this.props;
    let isDiff = '';

    let groupHosts = [];

    this.state.groupHosts.forEach((host) => {
      if (
        !host.name.includes('.phonebooth.net') &&
        !host.name.includes('.phoneboothdev.info')
      ) {
        if (host.name.includes('-qa-')) {
          host.name = host.name + '.phoneboothdev.info';
        } else if (host.name.includes('-pro-')) {
          host.name = host.name + '.phonebooth.net';
        }
      }
      groupHosts.push(hosts.hostObjects[host.name]);
    });

    const profiles = Object.keys(this.props.profiles)
      .sort()
      .map((profile) => {
        let value = this.props.profiles[profile][0].id;
        if (
          this.state.groupProfileId !== value &&
          profile === this.state.defaultProfileName
        ) {
          isDiff = (
            <div>
              <Typography variant="body1">
                <strong>
                  The profile {this.state.groupProfileName} has been updated!
                </strong>
              </Typography>
              <Button
                onClick={this.handleProfileDiffButton}
                variant="contained"
                color="primary"
              >
                Review Changes
              </Button>
              <br />
              <br />
            </div>
          );
        }
        return (
          <MenuItem key={profile} value={profile}>
            {profile}
          </MenuItem>
        );
      });

    return (
      <div>
        <form autoComplete="off">
          <Paper className={this.props.classes.root} elevation={1}>
            <Typography variant="subtitle1">
              <strong>Group:</strong>&nbsp;&nbsp;
              <TextField
                margin="dense"
                id="comment"
                value={this.state.groupName}
                onChange={this.handleNameInput}
              />
            </Typography>
            <br />
            <Typography variant="body1">
              <strong>Group ID:</strong> {this.state.groupId}{' '}
              <strong>Created:</strong> {this.state.groupCreated}
            </Typography>
            <br />
            <Typography variant="body1">
              <strong>Group Hosts:</strong>
            </Typography>
            <HostsTable hosts={groupHosts} flanIps={flanIps} />
            <br />
            {isDiff}
            <Typography variant="body1">
              <strong>Group Profile:</strong>
            </Typography>
            <Select
              value={this.state.groupProfileName}
              onChange={this.handleProfileSelect}
              fullWidth
            >
              {profiles}
            </Select>
            <br />
          </Paper>
        </form>
        <br />
        <Button
          onClick={this.handleSaveButton}
          variant="contained"
          color="primary"
          disabled={this.state.saveButtonDisabled}
        >
          Save
        </Button>
        <Button onClick={this.handleDeleteButton} color="primary">
          Delete
          <DeleteIcon className={classes.rightIcon} />
        </Button>
        {this.state.deleteGroupStatus}

        <Dialog
          open={this.state.saveGroupOpen}
          onClose={this.handleCloseButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Confirm edit of group: {this.state.groupName}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to change the profile to:{' '}
              {this.state.groupProfileName}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseButton} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.updateGroup}
              variant="contained"
              color="primary"
            >
              Submit Change
            </Button>
            &nbsp;&nbsp;{this.state.editGroupStatus}
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.deleteGroupOpen}
          onClose={this.handleDeleteCloseButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Confirm delete of: {this.state.groupName}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete: {this.state.groupName}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeleteCloseButton} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.deleteGroup}
              variant="contained"
              color="primary"
            >
              Delete
              <DeleteIcon className={classes.rightIcon} />
            </Button>
            &nbsp;&nbsp;{this.state.deleteGroupStatus}
          </DialogActions>
        </Dialog>

        <Dialog
          maxWidth={false}
          fullWidth={true}
          open={this.state.profileDiffOpen}
          onClose={this.handleProfileDiffCloseButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Do you want to update the profile {this.state.groupProfileName} to
            the latest version?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <span styles="in">
                Please review the differences before updating:{' '}
                {this.state.diffChanges}
              </span>
            </DialogContentText>
            {this.state.diffOutput}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleProfileDiffCloseButton} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.updateProfile}
              variant="contained"
              color="primary"
            >
              Update
            </Button>
            &nbsp;&nbsp;{this.state.updateProfileStatus}
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
    profilesHasErrored: state.profilesHasErrored,
    profilesIsLoading: state.profilesIsLoading,
    hosts: state.hosts,
    hostsHasErrored: state.hostsHasErrored,
    hostsIsLoading: state.hostsIsLoading,
    flanIps: state.flanIps,
    flanIpsHasErrored: state.flanIpsHasErrored,
    flanIpsIsLoading: state.flanIpsIsLoading,
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
)(withRouter(withStyles(styles)(Group)));

/*<pre>
              From --> To
              <br />
              <br />
              <code>{this.state.diff}</code>
            </pre>*/
