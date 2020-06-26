import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
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


class IptablesView extends Component {
  constructor(props){
    super(props);

    this.state = {
      iptables: '',
      hasErrored: false,
      isLoading: false,
    }

  }

  componentDidMount = () => {
    this.fetchIptables(this.props.id, this.props.version);
  }

  fetchIptables = (id, version) => {
    this.setState({ isLoading: true });

    let path = "/iptablesv4";
    if (version === "ipv6") {
      path = "/iptablesv6"
    }
    api
      .get('profile/' + id + path, {
        responseType: 'text',
        headers: {
          'Accept': 'text/plain',
          'Content-Type': 'text/plain',
        },
      })
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
      .then(iptables => {
        this.setState({ iptables });
      })
      .catch(() => this.setState({ hasErrored: true }));
  };

  /*renderFile = ({ oldRevision, newRevision, type, hunks }) => {
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
  };*/

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

    //const files = parseDiff(this.state.diff);
    return <div><pre><code>{this.state.iptables}</code></pre></div>;
  }

};

export default withStyles(styles)(IptablesView);
