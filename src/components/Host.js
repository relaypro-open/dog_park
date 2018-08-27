import React, { Component } from 'react';
import { api } from '../api';
import { groupsFetchData } from '../actions/groups';
import { hostsFetchData } from '../actions/hosts';
import { handleSelectedTab } from '../actions/app';
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

class Host extends Component {
  constructor(props) {
    super(props);

    this.state = {
      host: null,
      hasErrored: false,
      isLoading: false,
      noExist: false,
      hostName: '',
      hostId: '',
      hostEnv: '',
      hostIntf: '',
      hostLocation: '',
      hostProvider: '',
      hostUpdateType: '',
      hostVersion: '',
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
    };
  }

  componentDidMount = () => {
    if (this.props.groups === {}) {
      this.props.fetchGroups();
    }
    this.fetchHost(this.props.match.params.id);
    this.props.handleSelectedTab(3);
  };

  componentDidUpdate = prevProps => {
    if (this.props !== prevProps) {
      this.setState({ isLoading: false });
      this.setState({ hasErrored: false });
      this.setState({ noExist: false });
      this.fetchHost(this.props.match.params.id);
      this.setState({ isDeleting: false });
      this.setState({ deleteHasErrored: false });
      this.setState({ editHostStatus: '' });
      this.setState({ deleteHostStatus: '' });
      this.setState({ saveButtonDisabled: true });
    }
  };

  fetchHost = hostId => {
    this.setState({ isLoading: true });

    api
      .get('host/' + hostId)
      .then(response => {
        if (response.status === 200) {
          this.setState({ isLoading: false });
          return response.data;
        } else if (response.status === 404) {
          this.setState({ noExist: true });
          throw Error(response.statusText);
        } else {
          console.log('here!!');
          throw Error(response.statusText);
        }
      })
      .then(host => {
        console.log(host);
        this.setState(host);
        this.setState({ hostName: host.hostname });
        this.setState({ hostId: host.id });
        this.setState({ hostEnv: host.environment });
        this.setState({ hostIntf: host.interfaces });
        this.setState({ hostLocation: host.location });
        this.setState({ hostProvider: host.provider });
        this.setState({ hostUpdateType: host.updatetype });
        this.setState({ hostVersion: host.version });
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
      .then(response => {
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
      .then(hostId => {
        this.setState({ createHostOpen: false });
        this.setState({ createHostName: '' });
        this.setState({ createHostGroup: '' });
        this.props.history.push('/host/' + hostId);
        this.props.fetchHosts();
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
        hostname: this.state.hostName,
        group: this.state.hostGroupName,
      })
      .then(response => {
        if (response.status === 200) {
          this.setState({ isLoading: false });
          this.setState({ editHostStatus: '' });
          this.setState({ defaultGroupId: this.state.hostGroupId });
          this.setState({ saveButtonDisabled: true });
          this.handleCloseButton();
          this.fetchHost(this.state.hostId);
          //this.props.handleCloseButton();
          return response.data;
        } else {
          throw Error(response.statusText);
        }
      })
      .then(host => {
        console.log(host);
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
      .then(response => {
        if (response.status === 204) {
          this.setState({ isDeleting: false });
          this.setState({ deleteHostStatus: <div>Deleted!</div> });
          this.fetchHost(this.props.match.params.id);
          this.props.fetchHosts();
        } else {
          throw Error(response.statusText);
        }
      })
      .catch(() => {
        this.setState({ deleteHostStatus: <div>An error has occurred!</div> });
        this.setState({ deleteHasErrored: true });
      });
  };

  handleNameInput = event => {
    this.setState({ hostName: event.target.value });
  };

  handleIdInput = event => {
    this.setState({ hostId: event.target.value });
  };

  handleGroupNameInput = event => {
    this.setState({ hostGroupName: event.target.value });
  };

  handleGroupSelect = event => {
    this.setState({ hostGroupName: event.target.value });
    if (event.target.value !== this.state.defaultGroupName) {
      this.setState({ saveButtonDisabled: false });
    } else {
      this.setState({ saveButtonDisabled: true });
    }
  };

  handleGroupVersionInput = event => {
    this.setState({ hostGroupVersion: event.target.value });
  };

  handleEditButton = event => {
    this.setState({ editHostOpen: !this.state.editHostOpen });
  };

  handleSaveButton = event => {
    this.setState({ saveHostOpen: !this.state.saveHostOpen });
  };

  handleDeleteButton = event => {
    this.setState({ deleteHostOpen: !this.state.deleteHostOpen });
  };

  handleCloseButton = event => {
    this.setState({ saveHostOpen: false });
  };

  handleDeleteCloseButton = event => {
    this.setState({ deleteHostOpen: false });
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
      this.state.isDeleting
    ) {
      return (
        <div>
          {' '}
          <CircularProgress className={this.props.classes.progress} />
        </div>
      );
    }

    const { classes } = this.props;

    const groups = this.props.groups.map(group => {
      //let profileName = this.props.groups[profile][0];
      return (
        <MenuItem key={group.id} value={group.name}>
          {group.name}
        </MenuItem>
      );
    });

    return (
      <div>
        <form autoComplete="off">
          <Paper className={this.props.classes.root} elevation={1}>
            <Typography variant="title">
              <strong>Host:</strong> {this.state.hostName}
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
              fullWidth
            >
              {groups}
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    groups: state.groups,
    groupsHasErrored: state.groupsHasErrored,
    groupsIsLoading: state.groupsIsLoading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchGroups: () => dispatch(groupsFetchData()),
    fetchHosts: () => dispatch(hostsFetchData()),
    handleSelectedTab: value => dispatch(handleSelectedTab(value)),
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
