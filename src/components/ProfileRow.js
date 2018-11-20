import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import MenuIcon from '@material-ui/icons/Menu';
import Select from '@material-ui/core/Select';
import { TableCell, TableRow } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import debounce from 'lodash/debounce';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    maxWidth: '100%',
  },
  button: {
    margin: theme.spacing.unit,
  },
  form: {
    width: '100%',
  },
});

const DragHandle = SortableHandle(() => (
  <span>
    <MenuIcon />
  </span>
));

class ProfileRow extends Component {
  constructor(props) {
    super(props);

    let { data } = props;

    this.state = {
      active: data.active,
      intf: data.interface,
      group_type: data.group_type,
      group: data.group,
      service: data.service,
      action: data.action,
      log: data.log,
      logPrefix: data.logPrefix,
      comment: data.comment,
    };

    this.activeFunction = debounce(this.props.handleActiveCheckbox, 500);
    this.intfFunction = debounce(this.props.handleIntfSelect, 500);
    this.groupTypeFunction = debounce(this.props.handleGroupTypeSelect, 500);
    this.groupFunction = debounce(this.props.handleGroupSelect, 500);
    this.serviceFunction = debounce(this.props.handleServiceSelect, 500);
    this.actionFunction = debounce(this.props.handleActionSelect, 500);
    this.logFunction = debounce(this.props.handleLogCheckbox, 500);
    this.logPrefixFunction = debounce(this.props.handleLogPrefixInput, 500);
    this.commentFunction = debounce(this.props.handleCommentInput, 500);
  }

  componentDidUpdate = prevProps => {
    if (this.props !== prevProps) {
      const { data } = this.props;
      this.setState({ active: data.active });
      this.setState({ intf: data.interface });
      this.setState({ group: data.group });
      this.setState({ service: data.service });
      this.setState({ action: data.action });
      this.setState({ log: data.log });
      this.setState({ logPrefix: data.log_prefix });
      this.setState({ comment: data.comment });
    }
  };

  handleActiveCheckbox = event => {
    this.setState({ active: event.target.checked });
    this.activeFunction(
      this.props.pIndex,
      event.target.checked,
      this.props.ruleType
    );
  };

  handleIntfSelect = event => {
    this.setState({ intf: event.target.value });
    this.intfFunction(
      this.props.pIndex,
      event.target.value,
      this.props.ruleType
    );
  };

  handleGroupTypeSelect = event => {
    this.setState({ group_type: event.target.value });
    this.groupTypeFunction(
      this.props.pIndex,
      event.target.value,
      this.props.ruleType
    );
  };

  handleGroupSelect = event => {
    this.setState({ group: event.target.value });
    this.groupFunction(
      this.props.pIndex,
      event.target.value,
      this.props.ruleType
    );
  };

  handleServiceSelect = event => {
    this.setState({ service: event.target.value });
    this.serviceFunction(
      this.props.pIndex,
      event.target.value,
      this.props.ruleType
    );
  };

  handleActionSelect = event => {
    this.setState({ action: event.target.value });
    this.actionFunction(
      this.props.pIndex,
      event.target.value,
      this.props.ruleType
    );
  };

  handleLogCheckbox = event => {
    this.setState({ log: event.target.checked });
    this.logFunction(
      this.props.pIndex,
      event.target.checked,
      this.props.ruleType
    );
  };

  handleLogPrefixInput = event => {
    this.setState({ logPrefix: event.target.value });
    this.logPrefixFunction(
      this.props.pIndex,
      event.target.value,
      this.props.ruleType
    );
  };

  handleCommentInput = event => {
    this.setState({ comment: event.target.value });
    this.commentFunction(
      this.props.pIndex,
      event.target.value,
      this.props.ruleType
    );
  };

  handleAddProfile = event => {
    this.props.handleAddProfile(this.props.pIndex, this.props.ruleType);
  };

  handleRemoveProfile = event => {
    this.props.handleRemoveProfile(this.props.pIndex, this.props.ruleType);
  };

  render() {
    const { groups, zones, services, classes } = this.props;
    const {
      active,
      intf,
      group,
      group_type,
      service,
      action,
      log,
      logPrefix,
      comment,
    } = this.state;

    let sourceSelect = '';

    switch (group_type) {
      case 'ANY':
        sourceSelect = <MenuItem value={'any'}>any</MenuItem>;
        break;
      case 'ROLE':
        sourceSelect = groups.map(grp => {
            return (
              <MenuItem key={'grp' + grp.id} value={grp.id}>
                {grp.name}
              </MenuItem>
            );
          });
        break;
      case 'ZONE':
        sourceSelect = zones.map(grp => {
            return (
              <MenuItem key={'grp' + grp.id} value={grp.id}>
                {grp.name}
              </MenuItem>
            );
          });
        break;
      }

    return (
      <TableRow style={{ zIndex: 10000000 }}>
        <TableCell>
          <DragHandle />
        </TableCell>
        <TableCell>
          <Checkbox checked={active} onChange={this.handleActiveCheckbox} />
        </TableCell>
        <TableCell>
          <Select value={intf} onChange={this.handleIntfSelect}>
            <MenuItem value={'lo'}>lo</MenuItem>
            <MenuItem value={'ANY'}>ANY</MenuItem>
          </Select>
        </TableCell>
        <TableCell>
          <Select value={group_type} onChange={this.handleGroupTypeSelect}>
            <MenuItem value={'ANY'}>any</MenuItem>
            <MenuItem value={'ROLE'}>group</MenuItem>
            <MenuItem value={'ZONE'}>zone</MenuItem>
          </Select>
        </TableCell>
        <TableCell>
          <Select value={group} onChange={this.handleGroupSelect}>
            {sourceSelect}
          </Select>
        </TableCell>
        <TableCell>
          <Select value={service} onChange={this.handleServiceSelect}>
            {services.map(serv => {
              return (
                <MenuItem key={'serv' + serv.id} value={serv.id}>
                  {serv.name}
                </MenuItem>
              );
            })}
          </Select>
        </TableCell>
        <TableCell>
          <Select value={action} onChange={this.handleActionSelect}>
            <MenuItem value={'ACCEPT'}>ACCEPT</MenuItem>
            <MenuItem value={'DROP'}>DROP</MenuItem>
            <MenuItem value={'REJECT'}>REJECT</MenuItem>
          </Select>
        </TableCell>
        <TableCell>
          <Checkbox checked={log} onChange={this.handleLogCheckbox} />
        </TableCell>
        <TableCell>
          <TextField
            margin="dense"
            id="logPrefix"
            value={logPrefix}
            onChange={this.handleLogPrefixInput}
          />
        </TableCell>
        <TableCell>
          <TextField
            margin="dense"
            id="comment"
            value={comment}
            onChange={this.handleCommentInput}
          />
        </TableCell>
        <TableCell>
          <Button
            variant="fab"
            mini
            color="secondary"
            aria-label="Add"
            className={classes.button}
            onClick={this.handleAddProfile}
          >
            <AddIcon />
          </Button>
          <Button
            variant="fab"
            mini
            aria-label="Remove"
            className={classes.button}
            onClick={this.handleRemoveProfile}
          >
            <RemoveIcon />
          </Button>
        </TableCell>
      </TableRow>
    );
  }
}

export default SortableElement(withStyles(styles)(ProfileRow));
