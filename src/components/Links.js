import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { api } from '../api';
import { withStyles } from '@mui/styles';
import withRouter from '../withRouter';
import { linksFetchData } from '../actions/links';
import { handleSelectedTab } from '../actions/app';
import { CircularProgress } from '@mui/material';
import LinksTable from './LinksTable';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';

const styles = (theme) => ({
  root: {
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

  createLink = () => {
    this.props.history.push('/link/');
    this.props.fetchLinks();
  };

  componentDidMount() {
    if (this.props.links === []) {
      this.props.fetchLinks();
    }
    this.props.handleSelectedTab(8);
  }

  handleCreateLinkButton = () => {
    this.setState({ createLinkOpen: true });
  };

  handleCreateLinkClose = () => {
    this.setState((state, props) => {
      return {
        createLinkOpen: false,
        createLinkStatus: '',
      };
    });
  };

  handleCreateLinkName = (event) => {
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
        <LinksTable links={this.props.links.linkList} />
        <Fab
          color="secondary"
          aria-label="Add"
          className={classes.speedDialButton}
          onClick={this.createLink}
        >
          <AddIcon />
        </Fab>
        <Button onClick={this.createLink} variant="contained" color="primary">
          Create Link
        </Button>
        &nbsp;&nbsp;{this.state.createLinkStatus}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    links: state.links,
    hasErrored: state.linksHasErrored,
    isLoading: state.linksIsLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLinks: () => dispatch(linksFetchData()),
    handleSelectedTab: (value) => dispatch(handleSelectedTab(value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Links)));
