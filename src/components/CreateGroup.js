import React, { Component } from 'react';
import { connect } from 'react-redux';
import withRouter from '../withRouter';
import { withStyles } from '@mui/styles';
import { api, getErrorMessage } from '../api';
import { groupsFetchData } from '../actions/groups';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const styles = (theme) => ({
  root: {
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
    if (this.state.groupName !== '' && this.state.selectedProfile !== '') {
      this.createGroup();
    }
  }

  createGroup() {
    this.setState({ isLoading: true, hasErrored: false });

    api
      .post('group', {
        name: this.state.groupName,
        profile_name: this.state.selectedProfile,
        profile_version: 'latest',
      })
      .then((response) => {
        if (response.status === 201) {
          let re = /\/api\/group\/(.+)/;
          this.setState({ isLoading: false });
          let groupId = response.headers.location;
          let newGroupId = groupId.replace(re, '$1');
          return newGroupId;
        } else {
          throw Error(getErrorMessage(response));
        }
      })
      .then((groupId) => {
        this.props.history.push('/group/' + groupId);
        this.props.fetchGroups();
      })
      .catch((err) => {
        this.setState({ hasErrored: err.message || true, isLoading: false });
      });
  }

  handleCancel() {
    this.props.history.push('/groups');
  }

  render() {
    const profiles = Object.keys(this.props.profiles.profileList)
      .sort()
      .map((profile) => {
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
            <Typography variant="h2" component="h2">
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
              Add Group
            </Button>
            <Button size="large" onClick={this.handleCancel}>
              Cancel
            </Button>
            <br />
            <br />
            {this.state.isLoading && (
              <CircularProgress size={24} />
            )}
            {this.state.hasErrored && (
              <Typography variant="body1" color="error">
                {typeof this.state.hasErrored === 'string'
                  ? this.state.hasErrored
                  : 'An error has occurred while creating the group.'}
              </Typography>
            )}
          </Paper>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profiles: state.profiles,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGroups: () => dispatch(groupsFetchData()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(CreateGroup)));
