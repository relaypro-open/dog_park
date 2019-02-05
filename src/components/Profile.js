import React, { Component } from 'react';
import { api } from '../api';
import { profilesFetchData } from '../actions/profiles';
import { servicesFetchData } from '../actions/services';
import { zonesFetchData } from '../actions/zones';
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
import ProfileHistory from './ProfileHistory';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import IptablesView from './IptablesView';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { SortableContainer} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import update from 'immutability-helper';
import moment from 'moment';

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
  close: {
    padding: theme.spacing.unit / 2,
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  cellWidth: {
    width: '50px',
  }
});

const TableBodySortable = SortableContainer(
  ({
    children,
    ruleType,
    groups,
    services,
    zones,
    handleActiveCheckbox,
    handleIntfSelect,
    handleGroupSelect,
    handleGroupTypeSelect,
    handleServiceSelect,
    handleActionSelect,
    handleLogCheckbox,
    handleLogPrefixInput,
    handleCommentInput,
    handleAddProfile,
    handleRemoveProfile,
    handleStatesSelection,
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
              zones={zones}
              services={services}
              handleActiveCheckbox={handleActiveCheckbox}
              handleIntfSelect={handleIntfSelect}
              handleGroupSelect={handleGroupSelect}
              handleGroupTypeSelect={handleGroupTypeSelect}
              handleServiceSelect={handleServiceSelect}
              handleActionSelect={handleActionSelect}
              handleLogCheckbox={handleLogCheckbox}
              handleLogPrefixInput={handleLogPrefixInput}
              handleCommentInput={handleCommentInput}
              handleAddProfile={handleAddProfile}
              handleRemoveProfile={handleRemoveProfile}
              handleStatesSelection={handleStatesSelection}
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
      snackBarMsg: '',
      iptablesOutput: '',
      iptablesViewOpen: false,
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
    if (this.props.location !== prevProps.location) {
      this.setState({ saveProfileOpen: false });
      this.fetchProfile(this.props.match.params.id);
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
        this.setState((state,props) => {
          let inboundRules, outboundRules;
          let profileVersion;
          if ('rules' in profile) {
            inboundRules = profile.rules.inbound;
            outboundRules = profile.rules.outbound;
          } else {
            inboundRules = [];
            outboundRules = [];
          }
          if ('version' in profile) {
            profileVersion = profile.version;
          } else {
            profileVersion = '';
          }

          return {
            profileName: profile.name,
            profileId: profile.id,
            inboundRules,
            outboundRules,
            profileVersion,
          }
        });
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
          this.setState({
            snackBarMsg:
              this.state.profileName + ' has been modified successfully!',
          });
          return response.data;
        } else if (response.status === 404) {
          this.setState({ noExist: true });
          throw Error(response.statusText);
        } else {
          throw Error(response.statusText);
        }
      })
      .then(profile => {
        this.setState({ snackBarOpen: true });
        this.setState({ saveProfileOpen: false });
        this.setState({ saveProfileStatus: '' });
        this.props.fetchProfiles();
        this.setState({ profileId: profile.id });
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
          let error_msg = response.data.error_msg + ":" + response.data.groups;
          throw Error(error_msg);
        }
      })
      .catch((error) => {
        this.setState({
          deleteProfileStatus: <div style={{color:"red"}}><br/><br/>{error.message}</div>,
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
  };

  handleGroupTypeSelect = (index, value, ruleType) => {
    let newState = [];
    if (ruleType === 'inbound') {
      newState = update(this.state.inboundRules, {
        [index]: { group_type: { $set: value } },
      });
      this.setState({ inboundRules: newState });
    } else {
      newState = update(this.state.outboundRules, {
        [index]: { group_type: { $set: value } },
      });
      this.setState({ outboundRules: newState });
    }
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
  };

  handleCommentInput = (index, value, ruleType) => {
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
  };

  handleStatesSelection = (index, value, ruleType) => {
    let newState = [];
    if (ruleType === 'inbound') {
      newState = update(this.state.inboundRules, {
        [index]: { states: { $set: value } },
      });
      this.setState({ inboundRules: newState });
    } else {
      newState = update(this.state.outboundRules, {
        [index]: { states: { $set: value } },
      });
      this.setState({ outboundRules: newState });
    }
  };

  handleAddProfile = (index, ruleType) => {
    if (ruleType === 'inbound') {
      let newState = this.state.inboundRules.splice(0);
      newState.splice(index + 1, 0, {
        order: 1,
        active: false,
        states: [],
        environments: [],
        interface: 'ANY',
        group: 'ANY',
        group_type: 'ANY',
        service: 'ANY',
        action: 'ACCEPT',
        log: false,
        log_prefix: '',
        comment: '',
        type: 'BASIC',
      });
      this.setState({ inboundRules: newState });
    } else {
      let newState = this.state.outboundRules.splice(0);
      newState.splice(index + 1, 0, {
        order: 1,
        active: false,
        states: [],
        environments: [],
        interface: 'ANY',
        group: 'ANY',
        group_type: 'ANY',
        service: 'ANY',
        action: 'ACCEPT',
        log: false,
        log_prefix: '',
        comment: '',
        type: 'BASIC',
      });
      this.setState({ outboundRules: newState });
    }
  };

  handleRemoveProfile = (index, ruleType) => {
    let newState = [];
    if (ruleType === 'inbound') {
      newState = update(this.state.inboundRules, { $unset: [index] });
      newState.splice(index, 1);
      if (newState.length === 0) {
        newState.push({
          order: 1,
          active: false,
          states: [],
          environments: [],
          interface: 'ANY',
          group: 'ANY',
          group_type: 'ANY',
          service: 'ANY',
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
          states: [],
          environments: [],
          interface: 'ANY',
          group: 'ANY',
          group_type: 'ANY',
          service: 'ANY',
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
    this.setState({deleteProfileStatus: ""});
    this.setState({ deleteProfileOpen: false });
  };

  handleSnackBarOpen = () => {
    this.setState({ snackBarOpen: true });
  };

  handleSnackBarClose = (event, reason) => {
    this.setState({ snackBarOpen: false });
  };

  handleIptablesViewButton = event => {
    const iptablesOutput = (
      <IptablesView
        id={this.state.profileId}
        version={"ipv4"}
      />
    );

    this.setState({ iptablesOutput });
    this.setState({ iptablesViewOpen: !this.state.iptablesViewOpen });
  };

  handleIptablesViewCloseButton = event => {
    this.setState({ iptablesViewOpen: false });
  };

  render() {
    console.log(
      this.state.isLoading + ' ' +
      this.props.servicesIsLoading + ' ' +
      this.props.groupsIsLoading + ' ' +
      this.props.profilesIsLoading + ' ' +
      this.props.zonesIsLoading);
    if (this.state.hasErrored && this.state.noExist) {
      return <p>This profile no longer exists!</p>;
    } else if (
      this.state.hasErrored ||
      this.props.servicesHasErrored ||
      this.props.groupsHasErrored ||
      this.props.profilesHasErrored ||
      this.props.zonesHasErrored
    ) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (
      this.state.isLoading ||
      this.props.servicesIsLoading ||
      this.props.groupsIsLoading ||
      this.props.profilesIsLoading ||
      this.props.zonesIsLoading ||
      this.props.groups === []
    ) {
      return (
        <div>
          {' '}
          <CircularProgress />
        </div>
      );
    } else {
    const { classes } = this.props;

    return (
      <div>
        <Typography variant="headline">
          Profile {this.state.profileName}
        </Typography>
        <br />
        <br />
        <span className={classes.wrapper}>
        <Typography variant="title">Inbound Rules</Typography>
        <Button
          onClick={this.handleIptablesViewButton}
          variant="contained"
          color="primary"
        >
          View Iptables Rules
        </Button>
        </span>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell padding='none'>Active</TableCell>
                <TableCell padding='none'>Interface</TableCell>
                <TableCell padding='none'>Source Type</TableCell>
                <TableCell padding='none'>Source</TableCell>
                <TableCell padding='none'>Service</TableCell>
                <TableCell padding='none'>Conn. State(s)</TableCell>
                <TableCell padding='none'>Action</TableCell>
                <TableCell padding='none'>Log</TableCell>
                <TableCell>Log Prefix</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell padding='none'>Add or Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBodySortable
              children={this.state.inboundRules}
              ruleType={'inbound'}
              onSortEnd={this.onSortEndInbound}
              groups={this.props.groups}
              zones={this.props.zones}
              services={this.props.services}
              useDragHandle
              handleActiveCheckbox={this.handleActiveCheckbox}
              handleIntfSelect={this.handleIntfSelect}
              handleGroupSelect={this.handleGroupSelect}
              handleGroupTypeSelect={this.handleGroupTypeSelect}
              handleServiceSelect={this.handleServiceSelect}
              handleActionSelect={this.handleActionSelect}
              handleLogCheckbox={this.handleLogCheckbox}
              handleLogPrefixInput={this.handleLogPrefixInput}
              handleCommentInput={this.handleCommentInput}
              handleAddProfile={this.handleAddProfile}
              handleRemoveProfile={this.handleRemoveProfile}
              handleStatesSelection={this.handleStatesSelection}
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
                <TableCell padding='none'>Active</TableCell>
                <TableCell padding='none'>Interface</TableCell>
                <TableCell padding='none'>Source</TableCell>
                <TableCell padding='none'>Source Type</TableCell>
                <TableCell padding='none'>Service</TableCell>
                <TableCell padding='none'>Conn. State(s)</TableCell>
                <TableCell padding='none'>Action</TableCell>
                <TableCell padding='none'>Log</TableCell>
                <TableCell>Log Prefix</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell padding='none'>Add or Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBodySortable
              children={this.state.outboundRules}
              ruleType={'outbound'}
              onSortEnd={this.onSortEndOutbound}
              groups={this.props.groups}
              zones={this.props.zones}
              services={this.props.services}
              useDragHandle
              handleActiveCheckbox={this.handleActiveCheckbox}
              handleIntfSelect={this.handleIntfSelect}
              handleGroupSelect={this.handleGroupSelect}
              handleGroupTypeSelect={this.handleGroupTypeSelect}
              handleServiceSelect={this.handleServiceSelect}
              handleActionSelect={this.handleActionSelect}
              handleLogCheckbox={this.handleLogCheckbox}
              handleLogPrefixInput={this.handleLogPrefixInput}
              handleCommentInput={this.handleCommentInput}
              handleAddProfile={this.handleAddProfile}
              handleRemoveProfile={this.handleRemoveProfile}
              handleStatesSelection={this.handleStatesSelection}
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
        <br />
        <br />
        <Typography variant="title">Revision History</Typography>
        <ProfileHistory
          profiles={this.props.profiles[this.state.profileName]}
        />

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
              {this.state.deleteProfileStatus}
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
          </DialogActions>
        </Dialog>
        <Dialog
          maxWidth={false}
          fullWidth={false}
          open={this.state.iptablesViewOpen}
          onClose={this.handleiptablesViewCloseButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Iptables output for profile {this.state.profileName}:
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              iptables {this.props.version}:
            </DialogContentText>
            {this.state.iptablesOutput}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleIptablesViewCloseButton} color="primary">
              Close
            </Button>
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
    );}
  }
}

const mapStateToProps = state => {
  return {
    services: state.services,
    profiles: state.profiles,
    profilesHasErrored: state.profilesHasErrored,
    profilesIsLoading: state.profilesIsLoading,
    groups: state.groups,
    servicessHasErrored: state.servicesHasErrored,
    servicesIsLoading: state.servicesIsLoading,
    groupsHasErrored: state.groupssHasErrored,
    groupsIsLoading: state.groupsIsLoading,
    zones: state.zones,
    zonesHasErrored: state.zonesHasErrored,
    zonesIsLoading: state.zonesIsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchServices: () => dispatch(servicesFetchData()),
    fetchProfiles: () => dispatch(profilesFetchData()),
    fetchZones: () => dispatch(zonesFetchData()),
    handleSelectedTab: value => dispatch(handleSelectedTab(value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Profile)));
