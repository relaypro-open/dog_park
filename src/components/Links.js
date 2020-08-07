import React, { Component } from 'react';
import { connect } from 'react-redux';
import { api } from '../api';
import { withStyles } from '@material-ui/core/styles';
import { linksFetchData } from '../actions/links';
import { handleSelectedTab } from '../actions/app';
import { CircularProgress } from '@material-ui/core';
import LinksTable from './LinksTable';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    maxWidth: 700,
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
});

class Links extends Component {
  constructor(props) {
    super(props);

    this.state = {
      createLinkName: '',
      createLinkProfile: '',
      createLinkStatus: '',
      createLinkOpen: false,
    };
  }

  componentDidMount() {
    if (this.props.links === []) {
      this.props.fetchLinks();
    }
    this.props.handleSelectedTab(4);
  }

  //  createLink = () => {
  //    this.setState({ isLoading: true });
  //
  //    api
  //      .post('link', {
  //        name: this.state.createLinkName,
  //            connection_type: linkConnectionType,
  //            direction: linkDirection,
  //            enabled: linkEnabled,
  //            "connection.api_port": linkApiPort,
  //            "connection.host": linkHost,
  //            "connection.password": linkPassword,
  //            "connection.port": linkPort,
  //            "connection.ssl_options.cacertfile": linkCACertFile,
  //            "connection.ssl_options.certfile": linkCertFile,
  //            "connection.ssl_options.fail_if_no_peer_cert": linkFailIfNoPeerCert,
  //            "connection.ssl_options.server_name_indication": linkServerNameIndication,
  //            "connection.ssl_options.verify": linkVerify,
  //      })
  //      .then(response => {
  //        if (response.status === 201) {
  //          let re = /\/api\/link\/(.+)/;
  //          this.setState({ isLoading: false });
  //          let linkId = response.headers.location;
  //          let newLinkId = linkId.replace(re, '$1');
  //          return newLinkId;
  //        } else {
  //          throw Error(response.statusText);
  //        }
  //      })
  //      .then(linkId => {
  //        this.setState({ createLinkOpen: false });
  //        this.setState({ createLinkName: '' });
  //        this.setState({ createLinkLink: '' });
  //        this.props.history.push('/link/' + linkId);
  //        this.props.fetchLinks();
  //      })
  //      .catch(() => this.setState({ hasErrored: true }));
  //  };

  createLink = () => {
    if (this.state.createLinkName === '' ||
        this.state.createLinkName in this.props.links[1]) {
          this.setState({createLinkStatus: "Please enter a valid/unused link name!"});
    } else {
      this.setState({ isLoading: true });

      api
        .post('link', {
          name: this.state.createLinkName,
          ipv4_addresses: [],
          ipv6_addresses: [],
        })
        .then(response => {
          if (response.status === 201) {
            let re = /\/api\/link\/(.+)/;
            this.setState({ isLoading: false });
            let linkId = response.headers.location;
            let newLinkId = linkId.replace(re, '$1');
            return newLinkId;
          } else {
            throw Error(response.statusText);
          }
        })
        .then(linkId => {
          this.setState({ createLinkOpen: false });
          this.setState({ createLinkName: '' });
          this.props.fetchLinks();
          this.props.history.push('/link/' + linkId);
        })
        .catch(() => this.setState({ hasErrored: true }));
    }
  };

  handleCreateLinkButton = () => {
    this.setState({ createLinkOpen: true });
  };

  handleCreateLinkClose = () => {
    this.setState((state, props) => {
      return {
        createLinkOpen: false,
        createLinkStatus: '',
      }
    });
  };

  handleCreateLinkName = event => {
    this.setState({ createLinkName: event.target.value });
  };

  render() {
    if (this.props.hasErrored) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (this.props.isLoading) {
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
        <LinksTable links={this.props.links[0]} />
        <Fab
          color="secondary"
          aria-label="Add"
          className={classes.speedDialButton}
          onClick={this.handleCreateLinkButton}
        >
          <AddIcon />
        </Fab>

        <Dialog
          open={this.state.createLinkOpen}
          onClose={this.handleCreateLinkClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create a New Link</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the name of the link.
            </DialogContentText>
            <form>
              <TextField
                autoFocus
                margin="dense"
                id="linkName"
                label="Link Name"
                value={this.state.createLinkName}
                onChange={this.handleCreateLinkName}
                required
                fullWidth
              />
              <br />
              <br />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCreateLinkClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.createLink}
              variant="contained"
              color="primary"
            >
              Create Link
            </Button>
            &nbsp;&nbsp;{this.state.createLinkStatus}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    links: state.links,
    hasErrored: state.linksHasErrored,
    isLoading: state.linksIsLoading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchLinks: () => dispatch(linksFetchData()),
    handleSelectedTab: value => dispatch(handleSelectedTab(value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Links));
