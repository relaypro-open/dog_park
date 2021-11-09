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
import FlanApp from './FlanApp';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Button } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { CloudOff, Check, Error, Help } from '@material-ui/icons';

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
    padding: theme.spacing(1) / 2,
  },
});

function StringList(props) {
      const strings = props.strings;
      const listItems = strings.map((string) =>
              <li key={string}>
                {string}
              </li>
            );
      return (
              <ul>{listItems}</ul>
            );
}

class Host extends Component {
  constructor(props) {
    super(props);

    this.state = {
      host: null,
      hasErrored: false,
      isLoading: false,
      noExist: false,
      hostActive: '',
      hostName: '',
      hostKey: '',
      hostId: '',
      hostEnv: '',
      hostIntf: '',
      hostLocation: '',
      hostProvider: '',
      hostUpdateType: '',
      hostVersion: '',
      hostEc2AvailabilityZone: '',
      hostEc2InstanceId: '',
      hostEc2OwnerId: '',
      hostEc2SecurityGroupIds: [],
      hostGroupName: '',
      hostGroupId: '',
      hostGroupVersion: '',
      saveHostOpen: false,
      isDeleting: false,
      deleteHasErrored: false,
      deleteHostStatus: '',
      deleteHostOpen: false,
      saveButtonDisabled: true,
      defaultGroupId: '',
      editHostStatus: '',
      snackBarMsg: '',
    };
  }

  componentDidMount = () => {
    if (this.props.groups === {}) {
      this.props.fetchGroups();
    }
    this.fetchHost(this.props.match.params.id);
    this.props.handleSelectedTab(3);
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.fetchHost(this.props.match.params.id);
    }
    if (this.props !== prevProps) {
      this.setState({
        isLoading: false,
        hasErrored: false,
        noExist: false,
        isDeleting: false,
        deleteHasErrored: false,
        editHostStatus: '',
        deleteHostStatus: '',
        saveButtonDisabled: true,
      });
    }
  };

  fetchHost = (hostId) => {
    this.setState({ isLoading: true });

    api
      .get('host/' + hostId)
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
      .then((host) => {
        this.setState(host);
        this.setState({
          hostActive: host.active,
          hostName: host.name,
          hostKey: host.hostkey,
          hostId: host.id,
          hostEnv: host.environment,
          hostIntf: host.interfaces,
          hostLocation: host.location,
          hostProvider: host.provider,
          hostUpdateType: host.updatetype,
          hostVersion: host.version,
          hostEc2AvailabilityZone: host.ec2_availability_zone,
          hostEc2InstanceId: host.ec2_instance_id,
          hostEc2OwnerId: host.ec2_owner_id,
          hostEc2SecurityGroupIds: host.ec2_security_group_ids
        });
        if ('group' in host) {
          this.setState({ hostGroupName: host.group });
        } else {
          this.setState({ hostGroupName: '' });
        }
      })
      .catch(() => this.setState({ hasErrored: true }));
  };

  createHost = () => {
    this.setState({ isLoading: true });

    api
      .post('host', {
        name: this.state.createHostName,
        profile_name: this.props.groups[this.state.createHostGroup],
        profile_version: 'latest',
      })
      .then((response) => {
        if (response.status === 201) {
          let re = /\/api\/host\/(.+)/;
          this.setState({ isLoading: false });
          let hostId = response.headers.location;
          let newHostId = hostId.replace(re, '$1');
          return newHostId;
        } else {
          throw Error(response.statusText);
        }
      })
      .then((hostId) => {
        this.setState({ createHostOpen: false });
        this.setState({ createHostName: '' });
        this.setState({ createHostGroup: '' });
        this.props.fetchGroups();
        this.props.fetchProfiles();
        this.props.fetchZones();
        this.props.fetchServices();
        this.props.fetchHosts();
        this.props.fetchLinks();
        this.props.history.push('/host/' + hostId);
      })
      .catch(() => this.setState({ hasErrored: true }));
  };

  updateHost = () => {
    this.setState({ isLoading: true });
    this.setState({
      editHostStatus: (
        <div>
          <CircularProgress className={this.props.classes.progress} />
        </div>
      ),
    });
    api
      .put('/host/' + this.state.hostId, {
        name: this.state.hostName,
        group: this.state.hostGroupName,
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ isLoading: false });
          this.setState({ editHostStatus: '' });
          this.setState({ defaultGroupId: this.state.hostGroupId });
          this.setState({ saveButtonDisabled: true });
          this.handleCloseButton();
          this.fetchHost(this.state.hostId);
          this.setState({
            snackBarMsg:
              this.state.hostName + ' has been modified successfully!',
          });
          return response.data;
        } else {
          throw Error(response.statusText);
        }
      })
      .then((host) => {
        this.setState({ snackBarOpen: true });
      })
      .catch(() => {
        this.setState({ editHostStatus: <div>An error has occurred!</div> });
        this.setState({ hasErrored: true });
      });
  };

  deleteHost = () => {
    this.setState({ isDeleting: true });
    this.setState({
      deleteHostStatus: (
        <div>
          <CircularProgress className={this.props.classes.progress} />
        </div>
      ),
    });
    api
      .delete('/host/' + this.props.match.params.id)
      .then((response) => {
        if (response.status === 204) {
          this.setState({ isDeleting: false });
          this.setState({ deleteHostStatus: <div>Deleted!</div> });
          this.props.history.push('/hosts');
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
        this.setState({ deleteHostStatus: <div>An error has occurred!</div> });
        this.setState({ deleteHasErrored: true });
      });
  };

  handleNameInput = (event) => {
    this.setState({ hostName: event.target.value });
  };

  handleIdInput = (event) => {
    this.setState({ hostId: event.target.value });
  };

  handleGroupNameInput = (event) => {
    this.setState({ hostGroupName: event.target.value });
  };

  handleGroupSelect = (event) => {
    this.setState({ hostGroupName: event.target.value });
    if (event.target.value !== this.state.defaultGroupName) {
      this.setState({ saveButtonDisabled: false });
    } else {
      this.setState({ saveButtonDisabled: true });
    }
  };

  handleGroupVersionInput = (event) => {
    this.setState({ hostGroupVersion: event.target.value });
  };

  handleEditButton = (event) => {
    this.setState({ editHostOpen: !this.state.editHostOpen });
  };

  handleSaveButton = (event) => {
    this.setState({ saveHostOpen: !this.state.saveHostOpen });
  };

  handleDeleteButton = (event) => {
    this.setState({ deleteHostOpen: !this.state.deleteHostOpen });
  };

  handleCloseButton = (event) => {
    this.setState({ saveHostOpen: false });
  };

  handleDeleteCloseButton = (event) => {
    this.setState({ deleteHostOpen: false });
  };

  handleSnackBarOpen = () => {
    this.setState({ snackBarOpen: true });
  };

  handleSnackBarClose = (event, reason) => {
    this.setState({ snackBarOpen: false });
  };

  render() {
    if (this.state.hasErrored && this.state.noExist) {
      return <p>This host no longer exists!</p>;
    } else if (this.state.hasErrored || this.props.groupsHasErrored) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (
      this.state.isLoading ||
      this.props.groupsIsLoading ||
      this.state.isDeleting ||
      this.props.flanIpsIsLoading
    ) {
      return (
        <div>
          {' '}
          <CircularProgress className={this.props.classes.progress} />
        </div>
      );
    }

    const { classes, flanIps } = this.props;

    const groups = this.props.groups.groupList.map((group) => {
      return (
        <MenuItem key={group.id} value={group.name}>
          {group.name}
        </MenuItem>
      );
    });

    let flanApps = [];
    let hostName = this.state.hostName;

    if (
      !hostName.includes('.phonebooth.net') &&
      !hostName.includes('.phoneboothdev.info')
    ) {
      if (hostName.includes('-qa-')) {
        hostName = hostName + '.phoneboothdev.info';
      } else if (hostName.includes('-pro-')) {
        hostName = hostName + '.phonebooth.net';
      }
    }
    if (hostName in flanIps.hosts) {
      flanApps = flanIps.hosts[hostName];
    }

    let activeIcon = null;

    switch (this.state.hostActive) {
      case 'active':
        activeIcon = <Check style={{ fill: 'green' }} />;
        break;
      case 'inactive':
        activeIcon = <Error style={{ fill: 'red' }} />;
        break;
      case 'retired':
        activeIcon = <CloudOff />;
        break;
      default:
        activeIcon = <Help />;
    }
      
    let ec2Detail = '';
    if (this.state.hostProvider === "ec2") {
        ec2Detail = (
                <React.Fragment>
                    <Typography variant="body2">
                      <strong>ec2 Availablility Zone:</strong> {this.state.hostEc2AvailabilityZone}
                    </Typography>
                    <br />
                    <Typography variant="body2">
                      <strong>ec2 Owner Id:</strong> {this.state.hostEc2OwnerId}
                    </Typography>
                    <br />
                    <Typography variant="body2">
                      <strong>ec2 Instance Id:</strong> {this.state.hostEc2InstanceId}
                    </Typography>
                    <br />
                    <Typography variant="body2">
                      <strong>ec2 Security Group Ids:</strong>
                          <StringList strings={this.state.hostEc2SecurityGroupIds} />
                    </Typography>
                </React.Fragment>
        )
    }

    return (
      <div>
        <form autoComplete="off">
          <Paper className={this.props.classes.root} elevation={1}>
            <Typography variant="subtitle1">
              <strong>Active:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{activeIcon}
            </Typography>
            <br />
            <Typography variant="subtitle1">
              <strong>Name:</strong> {this.state.hostName}
            </Typography>
            <br />
            <Typography variant="subtitle1">
              <strong>HostKey:</strong> {this.state.hostKey}
            </Typography>
            <br />
            <Typography variant="body1">
              <strong>Host ID:</strong> {this.state.hostId}
            </Typography>
            <br />
            <Typography variant="body1">
              <strong>Environment:</strong> {this.state.hostEnv}
            </Typography>
            <br />
            <Typography variant="body1">
              <strong>Interfaces:</strong> {this.state.hostIntf}
            </Typography>
            <br />
            <Typography variant="body1">
              <strong>Location:</strong> {this.state.hostLocation}
            </Typography>
            <br />
            <Typography variant="body1">
              <strong>Provider:</strong> {this.state.hostProvider}
            </Typography>
            <br />
            {ec2Detail}
            <Typography variant="body1">
              <strong>Update Type:</strong> {this.state.hostUpdateType}
            </Typography>
            <br />
            <Typography variant="body1">
              <strong>Version:</strong> {this.state.hostVersion}
            </Typography>
            <br />
            <Typography variant="body1">
              <strong>Host Group:</strong>
            </Typography>
            <Select
              value={this.state.hostGroupName}
              onChange={this.handleGroupSelect}
            >
              {groups}
            </Select>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              onClick={(event) => {
                event.stopPropagation();
                this.props.history.push(
                  '/groupByName/' + this.state.hostGroupName
                );
              }}
              variant="contained"
              color="primary"
            >
              View Group
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
        {this.state.deleteHostStatus}

        <Dialog
          open={this.state.saveHostOpen}
          onClose={this.handleCloseButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Confirm edit of host: {this.state.hostName}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to change the group to:{' '}
              {this.state.hostGroupName}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseButton} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.updateHost}
              variant="contained"
              color="primary"
            >
              Submit Change
            </Button>
            &nbsp;&nbsp;{this.state.editHostStatus}
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.deleteHostOpen}
          onClose={this.handleDeleteCloseButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Confirm delete of: {this.state.hostName}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete: {this.state.hostName}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeleteCloseButton} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.deleteHost}
              variant="contained"
              color="primary"
            >
              Delete
              <DeleteIcon className={classes.rightIcon} />
            </Button>
            &nbsp;&nbsp;{this.state.deleteHostStatus}
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
        <br />
        <br />
        <br />
        <Typography variant="subtitle1">
          <strong>Flan Discovered Apps</strong>
        </Typography>
        <br />

        {flanApps.map((a) => (
          <div>
            <FlanApp
              key={'appkey_' + a.app}
              app={a.app}
              ip={a.ip}
              port={a.port}
              vulns={a.vulns}
              certs={a.certs}
            />
            <br />
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    groups: state.groups,
    groupsHasErrored: state.groupsHasErrored,
    groupsIsLoading: state.groupsIsLoading,
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
)(withRouter(withStyles(styles)(Host)));

/*
<EditHost
  hostName={this.state.hostName}
  hostId={this.state.hostId}
  hostGroupId={this.state.hostGroupId}
  hostGroupName={this.state.hostGroupName}
  hostGroupVersion={this.state.hostGroupVersion}
  open={this.state.editHostOpen}
  groups={this.props.groups}
  handleCloseButton={this.handleEditButton}
  fetchHost={this.fetchHost}
  history={this.props.history}
/>*/
