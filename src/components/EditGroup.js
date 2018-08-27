import React, { Component } from 'react';
import { api } from '../api';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

class EditGroup extends Component {
  constructor(props) {
    super(props);

    let groupName = props.groupName;
    let groupProfileName = props.groupProfileId;
    let groupProfileVersion = props.groupVersion;

    this.state = {
      groupName,
      groupProfileName,
      groupProfileVersion,
      isLoading: false,
      hasErrored: false,
      editGroupStatus: '',
    };

    this.updateGroup = this.updateGroup.bind(this);
  }

  componentDidMount = () => {
    this.setState({ groupName: this.props.groupName });
    this.setState({ groupProfileName: this.props.groupProfileId });
    this.setState({ groupProfileVersion: this.props.groupProfileVersion });
    this.setState({ isLoading: false });
    this.setState({ hasErrored: false });
  };

  componentDidUpdate = prevProps => {
    if (this.props !== prevProps) {
      this.setState({ groupName: this.props.groupName });
      this.setState({ groupProfileName: this.props.groupProfileId });
      this.setState({ groupProfileVersion: this.props.groupProfileVersion });
      this.setState({ isLoading: false });
      this.setState({ hasErrored: false });
    }
  };

  updateGroup() {
    this.setState({ isLoading: true });
    this.setState({
      editGroupStatus: (
        <div>
          <CircularProgress />
        </div>
      ),
    });
    api
      .put('/group/' + this.props.groupId, {
        profile_name: this.props.profiles[this.state.groupProfileName],
        profile_id: this.state.groupProfileName,
      })
      .then(response => {
        if (response.status === 204) {
          this.setState({ isLoading: false });
          this.setState({ editGroupStatus: <div>Updated!</div> });
          this.props.handleCloseButton();
          this.props.fetchGroup(this.props.groupId);
          //this.props.handleCloseButton();
          return response.data;
        } else {
          throw Error(response.statusText);
        }
      })
      .then(group => {
        console.log(group);
      })
      .catch(() => {
        this.setState({ editGroupStatus: <div>An error has occurred!</div> });
        this.setState({ hasErrored: true });
      });
  }

  handleClose = () => {
    this.props.editGroupOpen(false);
  };

  handleProfileSelect = event => {
    this.setState({ groupProfileId: event.target.value });
  };

  handleSubmitChange = () => {
    this.handleClose();
  };

  render() {
    const profiles = Object.keys(this.props.profiles).map(profile => {
      let profileName = this.props.profiles[profile];
      return (
        <MenuItem key={profile} value={profile}>
          {profileName}
        </MenuItem>
      );
    });

    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleCloseButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Edit {this.props.groupName}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please attach the group to a profile.
            </DialogContentText>
            <form autoComplete="off">
              <br />
              <FormControl fullWidth>
                <InputLabel>Group Profile</InputLabel>
                <Select
                  value={this.state.groupProfileName}
                  onChange={this.handleProfileSelect}
                  fullWidth
                >
                  {profiles}
                </Select>
              </FormControl>
              <br />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleCloseButton} color="primary">
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
      </div>
    );
  }
}

/*const mapStateToProps = (state) => {
    return {
        profiles: state.profiles,
        group: state.group,
        hasErrored: state.groupHasErrored,
        isLoading: state.groupIsLoading,
        open: state.editGroupOpen,
    }
}*/

/*const mapDispatchToProps = (dispatch) => {
    return {
      updateGroup: (groupProfileName) => dispatch(updateGroup(groupProfileName)),
    };
};*/

//export default connect(mapDispatchToProps)(EditGroup);
export default EditGroup;
