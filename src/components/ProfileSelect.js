import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import GitDiff from './GitDiff';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    width: '100%',
  },
});


class ProfileSelect extends Component {

  constructor(props) {
    super(props);

    this.state = {
      checkedState: {},
      profileDiffButtonDisabled: true,
      diffOutput: '',
      profileDiffOpen: false,
    };
  }

  componentDidMount = () => {
    if (this.props.profiles !== undefined) {
      let checkedState = this.state.checkedState;
      console.log("UPDATING!");
      this.props.profiles.map(profile => {
        checkedState[profile.id] = false;
        return true;
      });
      this.setState({checkedState});
    }
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.profiles !== prevProps.profiles) {
      if (this.props.profiles !== undefined) {
        this.props.handleCreateGroupButton(false);
        let checkedState = {};
        console.log("UPDATING!");
        this.props.profiles.map(profile => {
          checkedState[profile.id] = false;
          return true;
        });
        this.setState({checkedState});
      }
    }
  };

  handleCheckBoxes = name => event => {
    let checkedState = this.state.checkedState;
    checkedState[name] = event.target.checked;

    console.log(checkedState)

    const anyTrue = Object.values(checkedState).reduce((acc, checkbox) => {
        if (checkbox) {
          return acc + 1;
        } else {
          return acc;
        }
    }, 0);

    console.log(anyTrue);

    if (anyTrue === 2) {
      console.log("here");
      this.props.handleCreateGroupButton(false);
      this.setState({profileDiffButtonDisabled: false});
    } else if (anyTrue === 1) {
      this.props.handleCreateGroupButton(true);
      this.setState({profileDiffButtonDisabled: true});
    } else {
      this.props.handleCreateGroupButton(false);
      this.setState({profileDiffButtonDisabled: true});
    }

    this.setState({checkedState});
  }

  handleProfileDiffButton = event => {
    const checkedState = this.state.checkedState;
    console.log(checkedState);
    const profiles = Object.keys(checkedState).reduce((acc, key) => {
      console.log(key);
      console.log(acc);
      if (checkedState[key]) {
        acc.push(key);
        return acc;
      } else {
        return acc;
      }
    }, []);
    const diffOutput = <GitDiff profile1={profiles[0]} profile2={profiles[1]}/>;

    this.setState({ diffOutput });
    this.setState({ profileDiffOpen: !this.state.profileDiffOpen });
  };

  handleProfileDiffCloseButton = event => {
    this.setState({ profileDiffOpen: false });
  };

  render() {

    const { classes, profiles } = this.props;

    if (profiles === undefined) {
      return (
        <div>
          {'Please select a profile to see what versions are available.'}
        </div>
      );
    }

    return (
      <div>
      <FormLabel>Select the profile version that you want to apply to this group (select two to run a diff)</FormLabel>
      <Paper className={classes.root}>
        <FormControl>
            <FormGroup>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Select</TableCell>
                    <TableCell>Profile Name</TableCell>
                    <TableCell>Profile ID</TableCell>
                    <TableCell>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {profiles.map(profile => {
                    return (
                      <TableRow
                        key={'history' + profile.id}
                        hover
                      >
                        <TableCell><FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.checkedState[profile.id]}
                              onChange={this.handleCheckBoxes(profile.id)}
                              value={profile.id}
                            />
                          }
                          label=''
                        />
                        </TableCell>
                        <TableCell>{profile.name}</TableCell>
                        <TableCell>{profile.id}</TableCell>
                        <TableCell>{profile.created}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </FormGroup>
          </FormControl>
      </Paper>
      <br/>
      <Button
        onClick={this.handleProfileDiffButton}
        disabled={this.state.profileDiffButtonDisabled}
        variant="contained"
        color="primary"
      >
        Show Diff
      </Button>
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
            Please review the differences before updating:
          </DialogContentText>
          {this.state.diffOutput}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleProfileDiffCloseButton}
            variant="contained"
            color="primary"
          >
            Done
          </Button>
          &nbsp;&nbsp;{this.state.updateProfileStatus}
        </DialogActions>
      </Dialog>
      </div>
    );
  }
};

export default withRouter(withStyles(styles)(ProfileSelect));
