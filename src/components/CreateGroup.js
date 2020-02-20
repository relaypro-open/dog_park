import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import { api } from '../api';
import { groupsFetchData } from '../actions/groups';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    maxWidth: 700,
  },
});

class CreateGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupName: '',
      selectedProfile: '',
      createGroupProgress: '',
      isLoading: false,
      hasErrored: false,
    };

    this.handleGroupName = this.handleGroupName.bind(this);
    this.handleProfileSelect = this.handleProfileSelect.bind(this);
    this.handleCreateGroup = this.handleCreateGroup.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleGroupName(event) {
    this.setState({ groupName: event.target.value });
  }

  handleProfileSelect(event) {
    this.setState({ selectedProfile: event.target.value });
  }

  handleCreateGroup() {
    this.setState({
      createGroupProgress: (
        <span>
          &nbsp;&nbsp;<CircularProgress size={20} />
        </span>
      ),
    });
    if (this.state.groupName !== '' && this.state.selectedProfile !== '') {
      this.createGroup();
    }
  }

  createGroup() {
    this.setState({ isLoading: true });

    api
      .post('group', {
        name: this.state.groupName,
        profile_name: this.props.profiles[this.state.selectedProfile],
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
        this.props.history.push('/group/' + groupId);
        this.props.fetchGroups();
      })
      .catch(() => this.setState({ hasErrored: true }));
  }

  handleCancel() {
    this.props.history.push('/groups');
  }

  render() {
    const profiles = Object.keys(this.props.profiles).sort().map(profile => {
      let profileName = this.props.profiles[profile];
      return (
        <MenuItem key={profile} value={profile}>
          {profileName}
        </MenuItem>
      );
    });

    return (
      <div>
        <form autoComplete="off">
          <Paper className={this.props.classes.root} elevation={1}>
            <Typography variant="headline" component="h2">
              Create a New Group
            </Typography>
            <Typography component="p">
              Enter in the name of the group and the profile that you want to
              attach it to.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              id="groupName"
              label="Group Name"
              value={this.state.groupName}
              onChange={this.handleGroupName}
              required
              fullWidth
            />
            <br />
            <br />
            <FormControl required fullWidth>
              <InputLabel>Group Profile</InputLabel>
              <Select
                value={this.state.selectedProfile}
                onChange={this.handleProfileSelect}
                fullWidth
              >
                {profiles}
              </Select>
            </FormControl>
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={this.handleCreateGroup}
            >
              Add Group{this.state.createGroupProgress}
            </Button>
            <Button size="large" onClick={this.handleCancel}>
              Cancel
            </Button>
          </Paper>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    profiles: state.profiles,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchGroups: () => dispatch(groupsFetchData()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(CreateGroup)));
