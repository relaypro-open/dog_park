import React, { Component } from 'react';
import { api } from '../api';
import { profilesFetchData } from '../actions/profiles';
import { servicesFetchData } from '../actions/services';
import { handleSelectedTab } from '../actions/app';
import ProfileRow from './ProfileRow';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { SortableContainer, arrayMove } from 'react-sortable-hoc';
import update from 'immutability-helper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    width: '100%',
  },
  sortableHelper: {
    zIndex: 100000000000000,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  speedDialButton: {
    right: theme.spacing.unit * 3,
    bottom: theme.spacing.unit * 3,
    position: 'fixed',
    color: 'secondary',
  },
});

const TableBodySortable = SortableContainer(
  ({
    children,
    ruleType,
    groups,
    services,
    handleActiveCheckbox,
    handleIntfSelect,
    handleGroupSelect,
    handleServiceSelect,
    handleActionSelect,
    handleLogCheckbox,
    handleLogPrefixInput,
    handleCommentInput,
    handleAddProfile,
    handleRemoveProfile,
  }) => {
    return (
      <TableBody>
        {children.map((row, index) => {
          return (
            <ProfileRow
              index={index}
              key={index}
              pIndex={index}
              ruleType={ruleType}
              data={row}
              groups={groups}
              services={services}
              handleActiveCheckbox={handleActiveCheckbox}
              handleIntfSelect={handleIntfSelect}
              handleGroupSelect={handleGroupSelect}
              handleServiceSelect={handleServiceSelect}
              handleActionSelect={handleActionSelect}
              handleLogCheckbox={handleLogCheckbox}
              handleLogPrefixInput={handleLogPrefixInput}
              handleCommentInput={handleCommentInput}
              handleAddProfile={handleAddProfile}
              handleRemoveProfile={handleRemoveProfile}
            />
          );
        })}
      </TableBody>
    );
  }
);

TableBodySortable.muiName = 'TableBody';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      hasErrored: false,
      noExist: false,
      profileName: '',
      profileId: '',
      profileVersion: '',
      inboundRules: [],
      outboundRules: [],
      saveProfileOpen: false,
      saveProfileStatus: '',
      deleteProfileOpen: false,
      deleteProfileStatus: '',
      isDeleting: false,
      deleteHasErrored: false,
    };
  }

  componentDidMount = () => {
    if (this.props.services === []) {
      this.props.fetchServices();
    }
    this.fetchProfile(this.props.match.params.id);
    this.props.handleSelectedTab(1);
  };

  componentDidUpdate = prevProps => {
    if (this.props !== prevProps) {
      this.setState({ saveProfileOpen: false });
    }
  };

  fetchProfile = profileId => {
    this.setState({ isLoading: true });

    api
      .get('profile/' + profileId)
      .then(response => {
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
      .then(profile => {
        this.setState({ profileName: profile.name });
        this.setState({ profileId: profile.id });
        if ('rules' in profile) {
          this.setState({ inboundRules: profile.rules.inbound });
          this.setState({ outboundRules: profile.rules.outbound });
        } else {
          this.setState({ inboundRules: [] });
          this.setState({ outboundRules: [] });
        }
        if ('version' in profile) {
          this.setState({ profileVersion: profile.version });
        } else {
          this.setState({ profileVersion: '' });
        }
      })
      .catch(() => this.setState({ hasErrored: true }));
  };

  updateProfile = () => {
    this.setState({ isLoading: true });
    this.setState({
      saveProfileStatus: (
        <div>
          <CircularProgress />
        </div>
      ),
    });

    let inboundRules = this.state.inboundRules.slice(0);
    let outboundRules = this.state.outboundRules.slice(0);

    inboundRules.map((rule, index) => {
      rule['order'] = index + 1;
      return true;
    });

    outboundRules.map((rule, index) => {
      rule['order'] = index + 1;
      return true;
    });

    api
      .put('profile/' + this.state.profileId, {
        name: this.state.profileName,
        rules: {
          inbound: inboundRules,
          outbound: outboundRules,
        },
      })
      .then(response => {
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
      .then(profile => {
        console.log(profile);
        this.setState({ saveProfileOpen: false });
        this.setState({ saveProfileStatus: '' });
        this.props.fetchProfiles();
        this.props.history.push('/profile/' + profile.id);
      })
      .catch(() => this.setState({ hasErrored: true }));
  };

  deleteProfile = () => {
    this.setState({ isDeleting: true });
    this.setState({
      deleteProfileStatus: (
        <div>
          <CircularProgress />
        </div>
      ),
    });
    api
      .delete('/profile/' + this.props.match.params.id)
      .then(response => {
        if (response.status === 204) {
          this.setState({ isDeleting: false });
          this.setState({ deleteProfileStatus: <div>Deleted!</div> });
          this.fetchProfile(this.props.match.params.id);
          this.props.fetchProfiles();
        } else {
          throw Error(response.statusText);
        }
      })
      .catch(() => {
        this.setState({
          deleteProfileStatus: <div>An error has occurred!</div>,
        });
        this.setState({ deleteHasErrored: true });
      });
  };

  onSortEndInbound = ({ oldIndex, newIndex }) => {
    this.setState({
      inboundRules: arrayMove(this.state.inboundRules, oldIndex, newIndex),
    });
  };

  onSortEndOutbound = ({ oldIndex, newIndex }) => {
    this.setState({
      outboundRules: arrayMove(this.state.outboundRules, oldIndex, newIndex),
    });
  };

  handleSaveButton = () => {
    this.setState({ saveProfileOpen: true });
  };

  handleDeleteButton = () => {
    this.setState({ deleteProfileOpen: true });
  };

  handleActiveCheckbox = (index, value, ruleType) => {
    let newState = [];
    if (ruleType === 'inbound') {
      newState = update(this.state.inboundRules, {
        [index]: { active: { $set: value } },
      });
      this.setState({ inboundRules: newState });
    } else {
      newState = update(this.state.outboundRules, {
        [index]: { active: { $set: value } },
      });
      this.setState({ outboundRules: newState });
    }
  };

  handleIntfSelect = (index, value, ruleType) => {
    let newState = [];
    if (ruleType === 'inbound') {
      newState = update(this.state.inboundRules, {
        [index]: { interface: { $set: value } },
      });
      this.setState({ inboundRules: newState });
    } else {
      newState = update(this.state.outboundRules, {
        [index]: { interface: { $set: value } },
      });
      this.setState({ outboundRules: newState });
    }
    //this.setState({intf: event.target.value});
  };

  handleGroupSelect = (index, value, ruleType) => {
    let newState = [];
    if (ruleType === 'inbound') {
      newState = update(this.state.inboundRules, {
        [index]: { group: { $set: value } },
      });
      this.setState({ inboundRules: newState });
    } else {
      newState = update(this.state.outboundRules, {
        [index]: { group: { $set: value } },
      });
      this.setState({ outboundRules: newState });
    }
    //this.setState({group: event.target.value});
  };

  handleServiceSelect = (index, value, ruleType) => {
    let newState = [];
    if (ruleType === 'inbound') {
      newState = update(this.state.inboundRules, {
        [index]: { service: { $set: value } },
      });
      this.setState({ inboundRules: newState });
    } else {
      newState = update(this.state.outboundRules, {
        [index]: { service: { $set: value } },
      });
      this.setState({ outboundRules: newState });
    }
    //this.setState({service: event.target.value});
  };

  handleActionSelect = (index, value, ruleType) => {
    let newState = [];
    if (ruleType === 'inbound') {
      newState = update(this.state.inboundRules, {
        [index]: { action: { $set: value } },
      });
      this.setState({ inboundRules: newState });
    } else {
      newState = update(this.state.outboundRules, {
        [index]: { action: { $set: value } },
      });
      this.setState({ outboundRules: newState });
    }
    //this.setState({action: event.target.value});
  };

  handleLogCheckbox = (index, value, ruleType) => {
    let newState = [];
    if (ruleType === 'inbound') {
      newState = update(this.state.inboundRules, {
        [index]: { log: { $set: value } },
      });
      this.setState({ inboundRules: newState });
    } else {
      newState = update(this.state.outboundRules, {
        [index]: { log: { $set: value } },
      });
      this.setState({ outboundRules: newState });
    }
    //this.setState({log: event.target.checked});
  };

  handleLogPrefixInput = (index, value, ruleType) => {
    let newState = [];
    if (ruleType === 'inbound') {
      newState = update(this.state.inboundRules, {
        [index]: { log_prefix: { $set: value } },
      });
      this.setState({ inboundRules: newState });
    } else {
      newState = update(this.state.outboundRules, {
        [index]: { log_prefix: { $set: value } },
      });
      this.setState({ outboundRules: newState });
    }
    //this.setState({logPrefix: event.target.value});
  };

  handleCommentInput = (index, value, ruleType) => {
    console.log('here');
    let newState = [];
    if (ruleType === 'inbound') {
      newState = update(this.state.inboundRules, {
        [index]: { comment: { $set: value } },
      });
      this.setState({ inboundRules: newState });
    } else {
      newState = update(this.state.outboundRules, {
        [index]: { comment: { $set: value } },
      });
      this.setState({ outboundRules: newState });
    }
    //this.setState({comment: event.target.value});
  };

  handleAddProfile = ruleType => {
    let newState = [];
    if (ruleType === 'inbound') {
      newState = update(this.state.inboundRules, {
        $push: [
          {
            order: 1,
            active: false,
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
      });
      this.setState({ inboundRules: newState });
    } else {
      newState = update(this.state.outboundRules, {
        $push: [
          {
            order: 1,
            active: false,
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
      });
      this.setState({ outboundRules: newState });
    }
  };

  handleRemoveProfile = (index, ruleType) => {
    let newState = [];
    if (ruleType === 'inbound') {
      newState = update(this.state.inboundRules, { $unset: [index] });
      newState.splice(index, 1);
      console.log(newState);
      if (newState.length === 0) {
        newState.push({
          order: 1,
          active: false,
          interface: '',
          group: ' ',
          group_type: 'ANY',
          service: ' ',
          action: 'ACCEPT',
          log: false,
          log_prefix: '',
          comment: '',
          type: 'BASIC',
        });
      }
      this.setState({ inboundRules: newState });
    } else {
      newState = update(this.state.outboundRules, { $unset: [index] });
      newState.splice(index, 1);
      if (newState.length === 0) {
        newState.push({
          order: 1,
          active: false,
          interface: '',
          group: ' ',
          group_type: 'ANY',
          service: ' ',
          action: 'ACCEPT',
          log: false,
          log_prefix: '',
          comment: '',
          type: 'BASIC',
        });
      }
      this.setState({ outboundRules: newState });
    }
  };

  handleCloseButton = () => {
    this.setState({ saveProfileOpen: false });
  };

  handleDeleteCloseButton = () => {
    this.setState({ deleteProfileOpen: false });
  };

  render(props) {
    const { classes } = this.props;

    if (this.state.hasErrored && this.state.noExist) {
      return <p>This profile no longer exists!</p>;
    } else if (
      this.state.hasErrored ||
      this.props.servicesHasErrored ||
      this.props.groupsHasErrored
    ) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (
      this.state.isLoading ||
      this.props.servicesIsLoading ||
      this.props.groupsIsLoading
    ) {
      return (
        <div>
          {' '}
          <CircularProgress />
        </div>
      );
    }

    return (
      <div>
        <Typography variant="headline">
          Profile {this.state.profileName}
        </Typography>
        <br />
        <br />
        <Typography variant="title">Inbound Rules</Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Active</TableCell>
                <TableCell>Interface</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Log</TableCell>
                <TableCell>Log Prefix</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Add or Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBodySortable
              children={this.state.inboundRules}
              ruleType={'inbound'}
              onSortEnd={this.onSortEndInbound}
              groups={this.props.groups}
              services={this.props.services}
              useDragHandle
              handleActiveCheckbox={this.handleActiveCheckbox}
              handleIntfSelect={this.handleIntfSelect}
              handleGroupSelect={this.handleGroupSelect}
              handleServiceSelect={this.handleServiceSelect}
              handleActionSelect={this.handleActionSelect}
              handleLogCheckbox={this.handleLogCheckbox}
              handleLogPrefixInput={this.handleLogPrefixInput}
              handleCommentInput={this.handleCommentInput}
              handleAddProfile={this.handleAddProfile}
              handleRemoveProfile={this.handleRemoveProfile}
            />
          </Table>
        </Paper>
        <br />
        <br />
        <Typography variant="title">Outbound Rules</Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Active</TableCell>
                <TableCell>Interface</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Log</TableCell>
                <TableCell>Log Prefix</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Add or Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBodySortable
              children={this.state.outboundRules}
              ruleType={'outbound'}
              onSortEnd={this.onSortEndOutbound}
              groups={this.props.groups}
              services={this.props.services}
              useDragHandle
              handleActiveCheckbox={this.handleActiveCheckbox}
              handleIntfSelect={this.handleIntfSelect}
              handleGroupSelect={this.handleGroupSelect}
              handleServiceSelect={this.handleServiceSelect}
              handleActionSelect={this.handleActionSelect}
              handleLogCheckbox={this.handleLogCheckbox}
              handleLogPrefixInput={this.handleLogPrefixInput}
              handleCommentInput={this.handleCommentInput}
              handleAddProfile={this.handleAddProfile}
              handleRemoveProfile={this.handleRemoveProfile}
            />
          </Table>
        </Paper>
        <br />
        <Button
          onClick={this.handleSaveButton}
          variant="contained"
          color="primary"
          disabled={this.state.saveButtonDisabled}
        >
          Save
        </Button>
        <Button onClick={this.handleDeleteButton}>
          Delete
          <DeleteIcon className={classes.rightIcon} />
        </Button>

        <Dialog
          open={this.state.saveProfileOpen}
          onClose={this.handleCloseButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Confirm save of profile: {this.state.profileName}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to save the changes to profile:{' '}
              {this.state.profileName}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseButton} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.updateProfile}
              variant="contained"
              color="primary"
            >
              Submit Change
            </Button>
            &nbsp;&nbsp;{this.state.saveProfileStatus}
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.deleteProfileOpen}
          onClose={this.handleDeleteCloseButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Confirm delete of profile: {this.state.profileName}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete profile: {this.state.profileName}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeleteCloseButton} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.deleteProfile}
              variant="contained"
              color="primary"
            >
              Delete
              <DeleteIcon className={classes.rightIcon} />
            </Button>
            &nbsp;&nbsp;{this.state.deleteProfileStatus}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    services: state.services,
    groups: state.groups,
    servicessHasErrored: state.servicesHasErrored,
    servicesIsLoading: state.servicesIsLoading,
    groupsHasErrored: state.groupssHasErrored,
    groupsIsLoading: state.groupsIsLoading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchServices: () => dispatch(servicesFetchData()),
    fetchProfiles: () => dispatch(profilesFetchData()),
    handleSelectedTab: value => dispatch(handleSelectedTab(value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Profile)));
