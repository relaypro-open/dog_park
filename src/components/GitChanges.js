import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import '../styles/GitDiff.css';
import { api } from '../api';

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


class GitChanges extends Component {
  constructor(props){
    super(props);

    this.state = {
      adds: '',
      subs: '',
      hasErrored: false,
      isLoading: false,
    }
  }

  componentDidMount = () => {
    this.fetchChanges(this.props.profile1, this.props.profile2);
  }

  fetchChanges = (oldId, newId) => {
    this.setState({ isLoading: true });

    api
      .get('profile/' + oldId + '/iptablesv4?git_changes=' + newId, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (response.status === 200) {
          console.log(response);
          this.setState({ isLoading: false });
          return response.data;
        } else if (response.status === 404) {
          this.setState({ noExist: true });
          throw Error(response.statusText);
        } else {
          throw Error(response.statusText);
        }
      })
      .then(changes => {
        console.log(changes);
        this.setState({ adds: changes[0]});
        this.setState({ subs: changes[1]});
      })
      .catch(() => this.setState({ hasErrored: true }));
  };

  render() {

    if (this.state.hasErrored || this.props.profilesHasErrored) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (
      this.state.isLoading ||
      this.props.profilesIsLoading
    ) {
      return (
        <div>
          {' '}
          <CircularProgress className={this.props.classes.progress} />
        </div>
      );
    }

    return <span><font color="green">{'+' + this.state.adds}</font><font color="red">{' -' + this.state.subs}</font></span>;
  }

};

export default withStyles(styles)(GitChanges);
