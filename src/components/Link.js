import React, { Component } from 'react';
import { api } from '../api';
import { linksFetchData } from '../actions/links';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { CircularProgress, Button, Fab } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { handleSelectedTab } from '../actions/app';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import debounce from 'lodash/debounce';
import ipRegex from '../libs/ip-regex';
import cidrRegex from '../libs/cidr-regex';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    maxWidth: 700,
  },
  button: {
    margin: theme.spacing(1),
  },
  form: {
    width: 700,
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  close: {
    padding: theme.spacing(0.5),
  },
});

class Link extends Component {
  constructor(props) {
    super(props);

    this.state = {
      linkId: '',
      linkName: '',
      noExist: false,
      isLoading: false,
      hasErrored: false,
      isDeleting: false,
      deleteHasErrored: false,
      deleteLinkStatus: '',
      deleteLinkOpen: false,
      updateLinkStatus: '',
      updateLinkOpen: false,
      addressErrorOpen: false,
      snackBarMsg: '',
    };
  }

  componentDidMount() {
    this.fetchLink(this.props.match.params.id);
    this.props.handleSelectedTab(4);
  }

  fetchLink(linkId) {
    this.setState({ isLoading: true });
    api
      .get('link/' + linkId)
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
      .then(link => {
        this.setState({ linkName: link.name });
        this.setState({ linkId: link.id });
      })
      .catch(() => this.setState({ hasErrored: true }));
  }

  updateLink = () => {
    this.setState({ isLoading: true });
    this.setState({
      updateLinkStatus: (
        <div>
          <CircularProgress className={this.props.classes.progress} />
        </div>
      ),
    });
    api
      .put('/link/' + this.state.linkId, {
        name: this.state.linkName,
      })
      .then(response => {
        if (response.status === 200) {
          this.setState({ isLoading: false });
          this.setState({ updateLinkStatus: '' });
          this.handleUpdateCloseButton();
          this.fetchLink(this.state.linkId);
          this.setState({
            snackBarMsg:
              this.state.linkName + ' has been modified successfully!',
          });
          return response.data;
        } else {
          throw Error(response.statusText);
        }
      })
      .then(link => {
        this.setState({ snackBarOpen: true });
      })
      .catch(() => {
        this.setState({ updateLinkStatus: <div>An error has occurred!</div> });
        this.setState({ hasErrored: true });
      });
  };

  deleteLink = () => {
    this.setState({ isDeleting: true });
    this.setState({
      deleteLinkStatus: (
        <div>
          <CircularProgress className={this.props.classes.progress} />
        </div>
      ),
    });
    api
      .delete('/link/' + this.props.match.params.id)
      .then(response => {
        if (response.status === 204) {
          this.setState({ isDeleting: false });
          this.setState({ deleteLinkStatus: <div>Deleted!</div> });
          this.fetchLink(this.props.match.params.id);
          this.props.fetchLinks();
        } else {
          throw Error(response.statusText);
        }
      })
      .catch(() => {
        this.setState({ deleteLinkStatus: <div>An error has occurred!</div> });
        this.setState({ deleteHasErrored: true });
      });
  };

  handleDeleteButton = event => {
    this.setState({ deleteLinkOpen: !this.state.deleteLinkOpen });
  };

  handleDeleteCloseButton = event => {
    this.setState({ deleteLinkOpen: false });
  };

  handleUpdateCloseButton = () => {
    this.setState({ updateLinkOpen: false });
  };

  handleUpdateButton = () => {
    const reducer = (acc, current) => {
      if (current) {
        return true;
      } else {
        return acc;
      }
    };
  };

  handleSnackBarOpen = () => {
    this.setState({ snackBarOpen: true });
  };

  handleSnackBarClose = (event, reason) => {
    this.setState({ snackBarOpen: false });
  };

  render() {
    if (this.state.hasErrored && this.state.noExist) {
      return <p>This link no longer exists!</p>;
    } else if (this.state.hasErrored) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (this.state.isLoading) {
      return (
        <div>
          {' '}
          <CircularProgress />
        </div>
      );
    }

    const { classes } = this.props;

    return (
      <div>
        <Typography variant="subtitle1">Link {this.state.linkName}</Typography>
        <br />
        <form>
          <Typography variant="h4">IPv4 Addresses</Typography>
          <Paper className={classes.root}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>Add or Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              </TableBody>
            </Table>
          </Paper>
          <br/>
          <br/>
          <Typography variant="h4">IPv6 Addresses</Typography>
          <Paper className={classes.root}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>Add or Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              </TableBody>
            </Table>
          </Paper>
        </form>
        <br />
        <Button
          variant="contained"
          onClick={this.handleUpdateButton}
          color="primary"
        >
          Save
        </Button>
        <Button onClick={this.handleDeleteButton} color="primary">
          Delete
          <DeleteIcon className={classes.rightIcon} />
        </Button>

        <Dialog
          open={this.state.deleteLinkOpen}
          onClose={this.handleDeleteCloseButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Confirm delete of: {this.state.linkName}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete: {this.state.linkName}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeleteCloseButton} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.deleteLink}
              variant="contained"
              color="primary"
            >
              Delete
              <DeleteIcon className={classes.rightIcon} />
            </Button>
            &nbsp;&nbsp;{this.state.deleteLinkStatus}
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.updateLinkOpen}
          onClose={this.handleUpdateCloseButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Confirm update of link: {this.state.linkName}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to change the profile to:{' '}
              {this.state.linkName}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleUpdateCloseButton} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.updateLink}
              variant="contained"
              color="primary"
            >
              Submit Change
            </Button>
            &nbsp;&nbsp;{this.state.updateLinkStatus}
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

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    handleSelectedTab: value => dispatch(handleSelectedTab(value)),
    fetchLinks: () => dispatch(linksFetchData()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Link)));
