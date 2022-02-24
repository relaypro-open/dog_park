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
import Ec2SecurityGroupRow from './Ec2SecurityGroupRow';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { SortableContainer } from 'react-sortable-hoc';
import update from 'immutability-helper';

const styles = (theme) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    maxWidth: '100%',
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

const TableBodySortable = SortableContainer(
  ({
    children,
    handleRegionInput,
    handleSecurityGroupInput,
    handleAddSecurityGroup,
    handleRemoveSecurityGroup
  }) => {
    return (
      <TableBody>
        {children.map((row, index) => {
          return (
            <Ec2SecurityGroupRow
              index={index}
              key={'Ec2SecuritGroupTable' + index}
              pIndex={index}
              data={row}
              handleRegionInput={handleRegionInput}
              handleSecurityGroupInput={handleSecurityGroupInput}
              handleAddSecurityGroup={handleAddSecurityGroup}
              handleRemoveSecurityGroup={handleRemoveSecurityGroup}
            />
          );
        })}
      </TableBody>
    );
  }
);

TableBodySortable.muiName = 'TableBody';

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
      groupEc2SecurityGroups: [],
      saveGroupOpen: false,
      isDeleting: false,
      deleteHasErrored: false,
      deleteGroupStatus: '',
      deleteGroupOpen: false,
      saveButtonDisabled: false,
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
    if (
      this.props.profiles ===
      {
        profileList: {},
        profileIds: {},
      }
    ) {
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
      this.fetchGroupEc2SecurityGroups(this.props.match.params.id);
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
        if ('ec2_security_group_ids' in group) {
          this.setState({ groupEc2SecurityGroups: group.ec2_security_group_ids });
        } else {
          this.setState({ groupEc2SecurityGroups: [] });
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
        if ('ec2_security_group_ids' in group) {
          this.setState({ groupEc2SecurityGroups: group.ec2_security_group_ids });
        } else {
          this.setState({ groupEc2SecurityGroups: [] });
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

  fetchGroupEc2SecurityGroups = (groupId) => {
    //this.setState({ isLoading: true });

    api
      .get('group/' + groupId + '/ec2_security_group_ids')
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
      .then((ids) => {
        this.setState({ groupEc2SecurityGroups: ids });
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
        profile_id: this.props.profiles.profileList[
          this.state.groupProfileName
        ][0].id,
        ec2_security_group_ids: this.state.groupEc2SecurityGroups,
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ isLoading: false });
          this.setState({ editGroupStatus: '' });
          this.setState({
            defaultProfileId: this.props.profiles.profileList[
              this.state.groupProfileName
            ][0].id,
          });
          this.setState({ defaultProfileName: this.state.groupProfileName });
          this.setState({ saveButtonDisabled: false });
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
        profile_id: this.props.profiles.profileList[
          this.state.groupProfileName
        ][0].id,
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ isLoading: false });
          this.setState({ editGroupStatus: '' });
          this.setState({
            defaultProfileId: this.props.profiles.profileList[
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
          this.props.history.push('/groups');
          this.props.fetchGroups();
          this.props.fetchProfiles();
          this.props.fetchZones();
          this.props.fetchServices();
          this.props.fetchHosts();
          this.props.fetchLinks();
        } else if (response.status === 500) {
          let error_msg = Object.entries(response.data.errors).map(
            ([key, value]) => {
              return `${key}: ${value.map((entry) => {
                return this.props.profiles.profileIds[entry];
              })}`;
            }
          );
          throw Error(error_msg);
        } else {
          throw Error(response.statusText);
        }
      })
      .catch((error) => {
        this.setState({
          deleteGroupStatus: (
            <div style={{ color: 'red' }}>
              <br />
              {'Error: ' + error.message}
            </div>
          ),
        });
        this.setState({ deleteHasErrored: true });
      });
  };

  checkProfileDiff = () => {
    if (
      this.state.defaultProfileId !==
      this.props.profiles.profileList[this.state.groupProfileName][0].id
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
  
  handleEc2SecurityGroups = (event) => {
    this.setState({ groupEc2SecurityGroups: event.target.value });
  };

  handleEditButton = (event) => {
    this.setState({ editGroupOpen: !this.state.editGroupOpen });
  };

  handleSaveButton = (event) => {
    this.setState({ saveGroupOpen: !this.state.saveGroupOpen });
  };

  handleDeleteButton = (event) => {
    this.setState({ deleteGroupOpen: true });
  };

  handleCloseButton = (event) => {
    this.setState({ saveGroupOpen: false });
  };

  handleDeleteCloseButton = (event) => {
    this.setState({ deleteGroupStatus: '' });
    this.setState({ deleteGroupOpen: false });
  };

  handleProfileDiffButton = (event) => {
    const diffOutput = (
      <GitDiff
        profile1={this.state.defaultProfileId}
        profile2={
          this.props.profiles.profileList[this.state.groupProfileName][0].id
        }
      />
    );

    const diffChanges = (
      <GitChanges
        profile1={this.state.defaultProfileId}
        profile2={
          this.props.profiles.profileList[this.state.groupProfileName][0].id
        }
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

  handleRegionInput = (index, region, value) => {
    let newState = [];
      newState = update(this.state.groupEc2SecurityGroups, {
        [index]: { region: { $set: region } },
      });
      console.log(newState);
      this.setState({ groupEc2SecurityGroups: newState });
  };
  
  handleSecurityGroupInput = (index, sgid, value) => {
    let newState = [];
      console.log(index);
      console.log(sgid);
      console.log(value);
      //console.log(this.state.groupEc2SecurityGroups);
      newState = update(this.state.groupEc2SecurityGroups, {
        [index]: { sgid: { $set: sgid } },
      });
      console.log(newState);
      this.setState({ groupEc2SecurityGroups: newState });
  };
  
  handleAddSecurityGroup = (index) => {
      let newState = this.state.groupEc2SecurityGroups.splice(0);
      newState.splice(this.state.groupEc2SecurityGroups.length + 1, 0, {
            region: '',
            sgid: '',
      });
      console.log(newState);

      this.setState({ groupEc2SecurityGroups: newState });
  };

  handleRemoveSecurityGroup = (index) => {
    let newState = [];
      newState = update(this.state.groupEc2SecurityGroups, { $unset: [index] });
      newState.splice(index, 1);
      //if (newState.length === 0) {
      //  newState.push({
      //      region: '',
      //      sgid: '',
      //  });
      //}
      console.log(newState);

      this.setState({ groupEc2SecurityGroups : newState });
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

    //console.log("groupHosts: " + this.state.groupHosts);
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
      groupHosts.push(hosts.hostObjects[host.id]);
    });

    let groupEc2Sgs = [];
   
    //console.log("groupEc2SecurityGroups: " + this.state.groupEc2SecurityGroups);
    this.state.groupEc2SecurityGroups.forEach((mapping) => {
      groupEc2Sgs.push(mapping);
    });
    //console.log("groupEc2Sgs: " + groupEc2Sgs);

    const profiles = Object.keys(this.props.profiles.profileList)
      .sort()
      .map((profile) => {
        let value = this.props.profiles.profileList[profile][0].id;
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
    //console.log("this.state.groupEc2SecurityGroups" + this.state.groupEc2SecurityGroups);

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
            <HostsTable hosts={groupHosts} flanIps={flanIps} expand={true} />
            <br />
            <Typography variant="subtitle1">
              <strong>Ec2 Security Groups:</strong>&nbsp;&nbsp;
            </Typography>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell padding="none">Region</TableCell>
                  <TableCell padding="none">Security Group Id</TableCell>
                  <TableCell padding="none">
                    <Fab
                      size="small"
                      color="secondary"
                      aria-label="Add"
                      className={classes.button}
                      onMouseDown={this.handleAddSecurityGroup}
                    >
                      <AddIcon />
                    </Fab>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBodySortable
                children={this.state.groupEc2SecurityGroups}
                handleRegionInput={this.handleRegionInput}
                handleSecurityGroupInput={this.handleSecurityGroupInput}
                handleAddSecurityGroup={this.handleAddSecurityGroup}
                handleRemoveSecurityGroup={this.handleRemoveSecurityGroup}
              />
            </Table>
          </Paper>
          <br />

            {isDiff}
            <Typography variant="body1">
              <strong>Group Profile:</strong>
            </Typography>
            <Select
              value={this.state.groupProfileName}
              onChange={this.handleProfileSelect}
            >
              {profiles}
            </Select>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              onClick={(event) => {
                event.stopPropagation();
                this.props.history.push(
                  '/profile/' +
                    this.props.profiles.profileList[
                      this.state.groupProfileName
                    ][0].id
                );
              }}
              variant="contained"
              color="primary"
            >
              View Profile
            </Button>
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
            Confirm delete of: {this.state.groupName}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete: {this.state.groupName}?
              {this.state.deleteGroupStatus}
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
              size="medium">
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
