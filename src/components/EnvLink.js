import React, { Component } from 'react';
import { api } from '../api';
import { linksFetchData } from '../actions/links';
import { handleSelectedTab } from '../actions/app';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Button } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
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
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

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

class EnvLink extends Component {
  static propTypes = {
    links: PropTypes.array.isRequired,
    //fetchLink: PropTypes.func.isRequired,
    fetchLinks: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    handleSelectedTab: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    linksHasErrored: PropTypes.bool.isRequired,
    linksIsLoading: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      link: null,
      hasErrored: false,
      isLoading: false,
      noExist: false,
      linkName: '',
      linkId: '',
      linkConnectionType: '',
      linkDirection: '',
      linkAddressHandling: '',
      linkEnabled: '',
      linkApiPort: '',
      linkHost: '',
      linkPassword: '',
      linkPort: '',
      linkUser: '',
      linkVirtualHost: '',
      linkCACertFile: '',
      linkKeyFile: '',
      linkCertFile: '',
      linkFailIfNoPeerCert: '',
      linkServerNameIndication: '',
      linkVerify: '',

      saveLinkOpen: false,
      isDeleting: false,
      deleteHasErrored: false,
      deleteLinkStatus: '',
      deleteLinkOpen: false,
      saveButtonDisabled: false,
      defaultLinkId: '',
      editLinkStatus: '',
      snackBarMsg: '',
    };
  }

  componentDidMount = () => {
    this.fetchLink(this.props.match.params.id);
    this.props.handleSelectedTab(6);
  };

  componentDidUpdate = (prevProps) => {
    if (this.props !== prevProps) {
      this.setState({
        isLoading: false,
        hasErrored: false,
        noExist: false,
        isDeleting: false,
        deleteHasErrored: false,
        editLinkStatus: '',
        deleteLinkStatus: '',
        saveButtonDisabled: false,
      });
    }
  };

  fetchLink(linkId) {
    this.setState({ isLoading: true });
    if (linkId !== undefined) {
      api
        .get('link/' + linkId)
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
        .then((link) => {
          this.setState(link);
          this.setState({
            linkName: link.name,
            linkId: link.id,
            linkConnectionType: link.connection_type,
            linkDirection: link.direction,
            linkAddressHandling: link.address_handling,
            linkEnabled: link.enabled,
            linkApiPort: link.connection.api_port,
            linkHost: link.connection.host,
            linkPassword: link.connection.password,
            linkPort: link.connection.port,
            linkUser: link.connection.user,
            linkVirtualHost: link.connection.virtual_host,
            linkCACertFile: link.connection.ssl_options.cacertfile,
            linkKeyFile: link.connection.ssl_options.keyfile,
            linkCertFile: link.connection.ssl_options.certfile,
            linkFailIfNoPeerCert:
              link.connection.ssl_options.fail_if_no_peer_cert,
            linkServerNameIndication:
              link.connection.ssl_options.server_name_indication,
            linkVerify: link.connection.ssl_options.verify,
          });
        })
        .catch(() => this.setState({ hasErrored: true }));
    }
  }

  createLink = () => {
    this.setState({ isLoading: true });

    api
      .post('link', {
        name: this.state.linkName,
        connection_type: this.state.linkConnectionType,
        direction: this.state.linkDirection,
        address_handling: this.state.linkAddressHandling,
        enabled: this.state.linkEnabled,
        connection: {
          api_port: this.state.linkApiPort,
          host: this.state.linkHost,
          password: this.state.linkPassword,
          port: this.state.linkPort,
          user: this.state.linkUser,
          virtual_host: this.state.linkVirtualHost,
          ssl_options: {
            cacertfile: this.state.linkCACertFile,
            keyfile: this.state.linkKeyFile,
            certfile: this.state.linkCertFile,
            fail_if_no_peer_cert: this.state.linkFailIfNoPeerCert,
            server_name_indication: this.state.linkServerNameIndication,
            verify: this.state.linkVerify,
          },
        },
      })
      .then((response) => {
        if (response.status === 201) {
          let re = /\/api\/link\/(.+)/;
          this.setState({ isLoading: false });
          let linkId = response.headers.location;
          let newLinkId = linkId.replace(re, '$1');
          this.setState({ createLinkOpen: false });
          this.setState({ createLinkName: '' });
          this.setState({ createLinkLink: '' });
          this.props.fetchLinks();
          this.props.history.push('/links');
          return newLinkId;
        } else {
          throw Error(response.statusText);
        }
      })
      .catch(() => this.setState({ hasErrored: true }));
  };

  updateLink = () => {
    this.setState({ isLoading: true });
    this.setState({
      editLinkStatus: (
        <div>
          <CircularProgress className={this.props.classes.progress} />
        </div>
      ),
    });
    api
      .put('/link/' + this.state.linkId, {
        name: this.state.linkName,
        connection_type: this.state.linkConnectionType,
        direction: this.state.linkDirection,
        address_handling: this.state.linkAddressHandling,
        enabled: this.state.linkEnabled,
        connection: {
          api_port: this.state.linkApiPort,
          host: this.state.linkHost,
          password: this.state.linkPassword,
          port: this.state.linkPort,
          user: this.state.linkUser,
          virtual_host: this.state.linkVirtualHost,
          ssl_options: {
            cacertfile: this.state.linkCACertFile,
            keyfile: this.state.linkKeyFile,
            certfile: this.state.linkCertFile,
            fail_if_no_peer_cert: this.state.linkFailIfNoPeerCert,
            server_name_indication: this.state.linkServerNameIndication,
            verify: this.state.linkVerify,
          },
        },
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ isLoading: false });
          this.setState({ editLinkStatus: '' });
          this.setState({ defaultLinkId: this.state.linkLinkId });
          this.setState({ saveButtonDisabled: false });
          this.handleCloseButton();
          this.setState({
            snackBarMsg:
              this.state.linkName + ' has been modified successfully!',
          });
          this.props.fetchLinks();
          this.props.history.push('/links');
          return response.data;
        } else {
          throw Error(response.statusText);
        }
      })
      .catch(() => {
        this.setState({ editLinkStatus: <div>An error has occurred!</div> });
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
      .then((response) => {
        if (response.status === 204) {
          this.setState({ isDeleting: false });
          this.setState({ deleteLinkStatus: <div>Deleted!</div> });
          this.props.fetchLinks();
          this.props.history.push('/links');
        } else {
          throw Error(response.statusText);
        }
      })
      .catch(() => {
        this.setState({ deleteLinkStatus: <div>An error has occurred!</div> });
        this.setState({ deleteHasErrored: true });
      });
  };

  handleNameInput = (event) => {
    this.setState({ linkName: event.target.value });
  };

  handleIdInput = (event) => {
    this.setState({ linkId: event.target.value });
  };

  handleLinkNameInput = (event) => {
    this.setState({ linkName: event.target.value });
  };

  handleLinkEnabled = (event) => {
    this.setState({ linkEnabled: event.target.value });
  };

  handleLinkAddressHandling = (event) => {
    this.setState({ linkAddressHandling: event.target.value });
  };

  handleLinkFailIfNoPeerCert = (event) => {
    this.setState({ linkFailIfNoPeerCert: event.target.value });
  };

  handleLinkConnectionType = (event) => {
    this.setState({ linkConnectionType: event.target.value });
  };

  handleLinkDirection = (event) => {
    this.setState({ linkDirection: event.target.value });
  };

  handleLinkAddressHandling = (event) => {
    this.setState({ linkAddressHandling: event.target.value });
  };

  handleLinkApiPort = (event) => {
    this.setState({ linkApiPort: Number(event.target.value) });
  };

  handleLinkHost = (event) => {
    this.setState({ linkHost: event.target.value });
  };

  handleLinkPassword = (event) => {
    this.setState({ linkPassword: event.target.value });
  };

  handleLinkPort = (event) => {
    this.setState({ linkPort: Number(event.target.value) });
  };

  handleLinkUser = (event) => {
    this.setState({ linkUser: event.target.value });
  };

  handleLinkVirtualHost = (event) => {
    this.setState({ linkVirtualHost: event.target.value });
  };

  handleLinkCACertFile = (event) => {
    this.setState({ linkCACertFile: event.target.value });
  };

  handleLinkKeyFile = (event) => {
    this.setState({ linkKeyFile: event.target.value });
  };

  handleLinkCertFile = (event) => {
    this.setState({ linkCertFile: event.target.value });
  };

  handleLinkVersionInput = (event) => {
    this.setState({ linkVersion: event.target.value });
  };

  handleLinkServerNameIndication = (event) => {
    this.setState({ linkServerNameIndication: event.target.value });
  };

  handleLinkVerify = (event) => {
    this.setState({ linkVerify: event.target.value });
  };

  handleEditButton = (event) => {
    this.setState({ editLinkOpen: !this.state.editLinkOpen });
  };

  handleSaveButton = (event) => {
    this.setState({ saveLinkOpen: !this.state.saveLinkOpen });
  };

  handleDeleteButton = (event) => {
    this.setState({ deleteLinkOpen: !this.state.deleteLinkOpen });
  };

  handleCloseButton = (event) => {
    this.setState({ saveLinkOpen: false });
  };

  handleDeleteCloseButton = (event) => {
    this.setState({ deleteLinkOpen: false });
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
    } else if (this.state.hasErrored || this.props.linksHasErrored) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (
      this.state.isLoading ||
      this.props.linksIsLoading ||
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

    //const links = this.props.links[0].map(link => {
    //  //let profileName = this.props.links[profile][0];
    //  return (
    //    <MenuItem key={link.id} value={link.name}>
    //      {link.name}
    //    </MenuItem>
    //  );
    //});

    //let linkName = this.state.linkName;
    let buttonType = '';
    if (this.state.linkId !== '') {
      buttonType = (
        <Button onClick={this.updateLink} variant="contained" color="primary">
          Submit Change
        </Button>
      );
    } else {
      buttonType = (
        <Button onClick={this.createLink} variant="contained" color="primary">
          Create Link
        </Button>
      );
    }

    return (
      <div>
        <form autoComplete="off">
          <Paper className={this.props.classes.root} elevation={1}>
            <Table className={classes.table}>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle1">
                      <strong>Name:</strong>
                    </Typography>
                    <TextField
                      error={this.state.isErrored}
                      required
                      key={'linkName'}
                      fullWidth
                      value={this.state.linkName}
                      margin="dense"
                      onChange={this.handleLinkNameInput}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>Link ID:</strong> {this.state.linkId}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>Direction:</strong>
                    </Typography>
                    <Select
                      value={this.state.linkDirection}
                      onChange={this.handleLinkDirection}
                      fullWidth
                    >
                      <MenuItem value={'bidirectional'}>bidirectional</MenuItem>
                      <MenuItem value={'inbound'}>inbound</MenuItem>
                      <MenuItem value={'outbound'}>outbound</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>Address Handling:</strong>
                    </Typography>
                    <Select
                      value={this.state.linkAddressHandling}
                      onChange={this.handleLinkAddressHandling}
                      fullWidth
                    >
                      <MenuItem value={'union'}>union</MenuItem>
                      <MenuItem value={'prefix'}>prefix</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>Enabled:</strong>
                    </Typography>
                    <Select
                      value={this.state.linkEnabled}
                      onChange={this.handleLinkEnabled}
                      fullWidth
                    >
                      <MenuItem value={true}>true</MenuItem>
                      <MenuItem value={false}>false</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>Connection Type:</strong>
                    </Typography>
                    <Select
                      value={this.state.linkConnectionType}
                      onChange={this.handleLinkConnectionType}
                      fullWidth
                    >
                      <MenuItem value={'thumper'}>thumper</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>Connection</strong>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>Api Port:</strong>
                    </Typography>
                    <TextField
                      error={this.state.isErrored}
                      required
                      key={'linkApiPort'}
                      fullWidth
                      value={this.state.linkApiPort}
                      margin="dense"
                      onChange={this.handleLinkApiPort}
                      placeholder="15672"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>Host:</strong>
                    </Typography>
                    <TextField
                      error={this.state.isErrored}
                      required
                      key={'linkHost'}
                      fullWidth
                      value={this.state.linkHost}
                      margin="dense"
                      onChange={this.handleLinkHost}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>Password:</strong>
                    </Typography>
                    <TextField
                      type="password"
                      error={this.state.isErrored}
                      required
                      key={'linkPassword'}
                      fullWidth
                      value={this.state.linkPassword}
                      margin="dense"
                      onChange={this.handleLinkPassword}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>Port:</strong>
                    </Typography>
                    <TextField
                      error={this.state.isErrored}
                      required
                      key={'linkPort'}
                      fullWidth
                      value={this.state.linkPort}
                      margin="dense"
                      onChange={this.handleLinkPort}
                      placeholder="5673"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>User:</strong>
                    </Typography>
                    <TextField
                      error={this.state.isErrored}
                      required
                      key={'linkUser'}
                      fullWidth
                      value={this.state.linkUser}
                      margin="dense"
                      onChange={this.handleLinkUser}
                      placeholder="dog_trainer"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>Virtual Host:</strong>
                    </Typography>
                    <TextField
                      error={this.state.isErrored}
                      required
                      key={'linkVirtualHost'}
                      fullWidth
                      value={this.state.linkVirtualHost}
                      margin="dense"
                      onChange={this.handleLinkVirtualHost}
                      placeholder="dog"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>SSL Options</strong>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>CA Cert File:</strong>
                    </Typography>
                    <TextField
                      error={this.state.isErrored}
                      required
                      key={'linkCACertFile'}
                      fullWidth
                      value={this.state.linkCACertFile}
                      margin="dense"
                      onChange={this.handleLinkCACertFile}
                      placeholder="/var/consul/data/pki/certs/ca.crt"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>Key File:</strong>
                    </Typography>
                    <TextField
                      error={this.state.isErrored}
                      required
                      key={'linkKeyFile'}
                      fullWidth
                      value={this.state.linkKeyFile}
                      margin="dense"
                      onChange={this.handleLinkKeyFile}
                      placeholder="/var/consul/data/pki/private/server.key"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>Cert File:</strong>
                    </Typography>
                    <TextField
                      error={this.state.isErrored}
                      required
                      key={'linkCertFile'}
                      fullWidth
                      value={this.state.linkCertFile}
                      margin="dense"
                      onChange={this.handleLinkCertFile}
                      placeholder="/var/consul/data/pki/certs/server.crt"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>Fail If No Peer Cert:</strong> {}
                    </Typography>
                    <Select
                      value={this.state.linkFailIfNoPeerCert}
                      onChange={this.handleLinkFailIfNoPeerCert}
                      fullWidth
                    >
                      <MenuItem value={true}>true</MenuItem>
                      <MenuItem value={false}>false</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>Server Name Indication:</strong>
                    </Typography>
                    <TextField
                      error={this.state.isErrored}
                      required
                      key={'linkServerNameIndication'}
                      fullWidth
                      value={this.state.linkServerNameIndication}
                      margin="dense"
                      onChange={this.handleLinkServerNameIndication}
                      placeholder="disable"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>Verify:</strong>
                    </Typography>
                    <Select
                      value={this.state.linkVerify}
                      onChange={this.handleLinkVerify}
                      fullWidth
                    >
                      <MenuItem value={'verify_peer'}>verify_peer</MenuItem>
                      <MenuItem value={'verify_none'}>verify_none</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
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
        {this.state.deleteLinkStatus}

        <Dialog
          open={this.state.saveLinkOpen}
          onClose={this.handleCloseButton}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Confirm edit of link: {this.state.linkName}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to change the link to:{' '}
              {this.state.linkLinkName}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseButton} color="primary">
              Cancel
            </Button>
            {buttonType}
            &nbsp;&nbsp;{this.state.editLinkStatus}
          </DialogActions>
        </Dialog>
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
              WARNING! Deleting a Link will delete the related External, causing
              all related profiles and iptables with rules with this environment
              as source to fail. WARNING! Are you sure you want to delete:{' '}
              {this.state.linkName}?
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    links: state.links,
    linksHasErrored: state.linksHasErrored,
    linksIsLoading: state.linksIsLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleSelectedTab: (value) => dispatch(handleSelectedTab(value)),
    fetchLinks: () => dispatch(linksFetchData()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(EnvLink)));
