import React, { Component } from 'react';
import { parseDiff, Diff, Hunk, markCharacterEdits } from 'react-diff-view';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import { sumBy } from 'lodash';
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


class GitDiff extends Component {
  constructor(props){
    super(props);

    this.state = {
      diff: '',
      hasErrored: false,
      isLoading: false,
    }

  }

  componentDidMount = () => {
    this.fetchDiff(this.props.profile1, this.props.profile2);
  }

  fetchDiff = (oldId, newId) => {
    this.setState({ isLoading: true });

    api
      .get('profile/' + oldId + '/iptablesv4?git_diff=' + newId, {
        responseType: 'text',
        headers: {
          Accept: 'text/plain',
          'Content-Type': 'text/plain',
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
      .then(diff => {
        console.log(diff);
        this.setState({ diff });
      })
      .catch(() => this.setState({ hasErrored: true }));
  };


  renderFile = ({ oldRevision, newRevision, type, hunks }) => {
    const changeCount = sumBy(hunks, ({ changes }) => changes.length);
    const markEdits = markCharacterEdits({threshold: 30, markLongDistanceDiff: true});
    return (
      <Diff
        key={oldRevision + '-' + newRevision}
        viewType='split'
        diffType={type}
        gutterType='default'
        markEdits={changeCount <= 200 ? markEdits : undefined}
        //onRenderCode={changeCount <= 500 ? highlight : noop}
      >
        {hunks.map(hunk => <Hunk key={hunk.content} hunk={hunk} />)}
      </Diff>
    );
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

    const files = parseDiff(this.state.diff);
    return <div>{files.map(this.renderFile)}</div>;
  }

};

export default withStyles(styles)(GitDiff);
