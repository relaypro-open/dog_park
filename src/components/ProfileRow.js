import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import MenuIcon from '@material-ui/icons/Menu';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import Fab from '@material-ui/core/Fab';
import { TableCell, TableRow } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import debounce from 'lodash/debounce';
import Autocomplete from '@material-ui/lab/Autocomplete';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    maxWidth: '100%',
  },
  button: {
    margin: theme.spacing(1),
  },
  form: {
    width: '100%',
  },
  cellWidth: {
    width: '50px',
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

    let { groups, zones, services, data } = props;

    let checkedNew: false;
    let checkedEstablished: false;
    let checkedRelated: false;

    data.states.map(state => {
      switch (state) {
        case 'NEW':
          checkedNew = true;
          break;
        case 'ESTABLISHED':
          checkedEstablished = true;
          break;
        case 'RELATED':
          checkedRelated = true;
          break;
        default:
      }
      return true;
    });

    const { sourceSelect, sourceReverse, groupName } = this.getGroupType(zones, groups, data);

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
      states: data.states,
      anchorEl: null,
      checkedNew,
      checkedEstablished,
      checkedRelated,
      sourceSelect,
      sourceReverse,
      serviceReverse: services[1],
      groupName,
      groupValue: groupName,
      serviceName: services[2][data.service],
      serviceValue: services[2][data.service]
    };

    this.activeFunction = debounce(this.props.handleActiveCheckbox, 500);
    this.intfFunction = debounce(this.props.handleIntfSelect, 500);
    this.groupTypeFunction = debounce(this.props.handleGroupTypeSelect, 500);
    this.groupFunction = debounce(this.props.handleGroupSelect, 500);
    this.serviceFunction = debounce(this.props.handleServiceSelect, 500);
    this.statesFunction = debounce(this.props.handleStatesSelection, 500);
    this.actionFunction = debounce(this.props.handleActionSelect, 500);
    this.logFunction = debounce(this.props.handleLogCheckbox, 500);
    this.logPrefixFunction = debounce(this.props.handleLogPrefixInput, 500);
    this.commentFunction = debounce(this.props.handleCommentInput, 500);
  }

  componentDidUpdate = prevProps => {
    if (this.props.data !== prevProps.data) {
      this.setState((state, props) => {
        const { zones, groups, services, data } = props;
        let checkedNew: false;
        let checkedEstablished: false;
        let checkedRelated: false;

        data.states.map(state =>{
          switch (state) {
            case 'NEW':
              checkedNew = true;
              break;
            case 'ESTABLISHED':
              checkedEstablished = true;
              break;
            case 'RELATED':
              checkedRelated = true;
              break;
            default:
          }
          return true;
        });

        const { sourceSelect, sourceReverse, groupName } = this.getGroupType(zones, groups, data);

        return {
          active: data.active,
          intf: data.interface,
          group: data.group,
          group_type: data.group_type,
          service: data.service,
          states: data.states,
          action: data.action,
          log: data.log,
          logPrefix: data.log_prefix,
          comment: data.comment,
          checkedNew,
          checkedEstablished,
          checkedRelated,
          sourceSelect,
          sourceReverse,
          serviceReverse: services[1],
          groupName,
          groupValue: groupName,
          serviceName: services[2][data.service],
          serviceValue: services[2][data.service]
        };
      })
    }
  };

  getGroupType = (zones, groups, data) => {
    let sourceSelect = null;
    let sourceReverse = {};
    let groupName = '';


    if (groups.length !== 0 && zones.length !== 0) {
      switch (data.group_type) {
        case 'ANY':
          sourceSelect = [{id: "any", name: "any"}];
          groupName = "any";
          sourceReverse = {'name': 'any'};
          break;
        case 'ROLE':
          sourceSelect = groups[0];
          sourceReverse = groups[1]
          groupName = groups[2][data.group];
          break;
        case 'ZONE':
          sourceSelect = zones[0];
          sourceReverse = zones[1]
          groupName = zones[2][data.group];
          break;
        default:
      }
    }
    return {sourceSelect,sourceReverse,groupName};
  }

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

  handleGroupSelect = value => {
    if (value != null) {
      this.setState({ group: value });
      this.groupFunction(
        this.props.pIndex,
        value,
        this.props.ruleType
      );
    }
  };

  handleGroupInput = value => {
    if (value == null) {
      this.setState({ groupName: "" });
    } else {
      this.setState({ groupName: value });
    }
  };

  handleServiceSelect = value => {
    if (value != null) {
      this.setState({ service: value });
      this.serviceFunction(
        this.props.pIndex,
        value,
        this.props.ruleType
      );
    }
  };

  handleServiceInput = value => {
    if (value == null) {
      this.setState({ serviceName: "" });
    } else {
      this.setState({ serviceName: value });
    }
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

  handleStateButton = event => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleStateButtonClose = () => {
    this.setState({anchorEl: null});
  };

  handleStateChange = name => event => {
    let checkedNew = this.state.checkedNew;
    let checkedEstablished = this.state.checkedEstablished;
    let checkedRelated = this.state.checkedRelated;
    let states = [];

    switch (name) {
      case 'checkedNew':
        checkedNew = event.target.checked;
        break;
      case 'checkedEstablished':
        checkedEstablished = event.target.checked
        break;
      case 'checkedRelated':
        checkedRelated = event.target.checked;
        break;
      default:
    }
    if (checkedNew) {
      states.push('NEW');
    }
    if (checkedEstablished) {
      states.push('ESTABLISHED');
    }
    if (checkedRelated) {
      states.push('RELATED');
    }

    this.statesFunction(
      this.props.pIndex,
      states,
      this.props.ruleType
    );
    this.setState({ [name]: event.target.checked });
  }

  render() {
    //add logic to prevent rerendering while loading

    const { groups, zones, services, classes } = this.props;
    if ( groups.length === 0 || zones.length === 0 || services.length === 0 ) {
      return '';
    }
    const {
      active,
      intf,
      group_type,
      service,
      action,
      log,
      logPrefix,
      comment,
      states,
      anchorEl,
      checkedNew,
      checkedEstablished,
      checkedRelated,
      sourceSelect,
      sourceReverse,
      serviceReverse,
      groupName,
      groupValue,
      serviceName,
      serviceValue
    } = this.state;

    let interf = intf;

    if (intf === '') {
      interf = 'ANY';
    }

    let stateText = 'ANY';

    if (states.length) {
      stateText = states.toString();
    }

    const sourceSelectOptions = {
      options: sourceSelect.map(option => option.name)
    };

    const serviceSelectOptions = {
      options: services[0].map(option => option.name)
    };

    return (
      <TableRow style={{ zIndex: 10000000 }}>
        <TableCell>
          <DragHandle />
        </TableCell>
        <TableCell padding='none'>
          <Checkbox checked={active} onChange={this.handleActiveCheckbox} />
        </TableCell>
        <TableCell padding='none'>
          <Select value={interf} onChange={this.handleIntfSelect} disabled={!active}>
            <MenuItem value={'lo'}>lo</MenuItem>
            <MenuItem value={'ANY'}>any</MenuItem>
          </Select>
        </TableCell>
        <TableCell padding='none'>
          <Select value={group_type} onChange={this.handleGroupTypeSelect} disabled={!active}>
            <MenuItem value={'ANY'}>any</MenuItem>
            <MenuItem value={'ROLE'}>group</MenuItem>
            <MenuItem value={'ZONE'}>zone</MenuItem>
          </Select>
        </TableCell>
        <TableCell padding='none'>
          <Autocomplete
            style={{ width: 200 }}
            {...sourceSelectOptions}
            id="group_select"
            inputValue={groupName}
            value={groupValue}
            renderInput={(params) => <TextField {...params} variant="standard"/>}
            onChange={(event, value) => {
              this.handleGroupSelect(sourceReverse[value]);
            }}
            onInputChange={(event, value) => {
              this.handleGroupInput(value);
            }}
            disabled={!active}
          />
        </TableCell>
        <TableCell padding='checkbox'>
          <Autocomplete
            style={{ width: 200 }}
            {...serviceSelectOptions}
            id="service_select"
            inputValue={serviceName}
            value={serviceValue}
            renderInput={(params) => <TextField {...params} variant="standard"/>}
            onChange={(event, value) => {
              this.handleServiceSelect(serviceReverse[value]);
            }}
            onInputChange={(event, value) => {
              this.handleServiceInput(value);
            }}
            disabled={!active}
          />
        </TableCell>
        <TableCell padding='none'>
          <Button
            onClick={this.handleStateButton}
            disabled={!active}
          >
            {stateText}
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleStateButtonClose}
          >
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedNew}
                    onChange={this.handleStateChange('checkedNew')}
                    value="checkedNew"
                    color="primary"
                  />
                }
                label="NEW"
               />
            </MenuItem>
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedEstablished}
                    onChange={this.handleStateChange('checkedEstablished')}
                    value="checkedEstablished"
                    color="primary"
                  />
                }
                label="ESTABLISHED"
               />
            </MenuItem>
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedRelated}
                    onChange={this.handleStateChange('checkedRelated')}
                    value="checkedRelated"
                    color="primary"
                  />
                }
                label="RELATED"
               />
            </MenuItem>
          </Menu>
        </TableCell>
        <TableCell padding='none'>
          <Select value={action} onChange={this.handleActionSelect} disabled={!active}>
            <MenuItem value={'ACCEPT'}>ACCEPT</MenuItem>
            <MenuItem value={'DROP'}>DROP</MenuItem>
            <MenuItem value={'REJECT'}>REJECT</MenuItem>
          </Select>
        </TableCell>
        <TableCell padding='none'>
          <Checkbox checked={log} onChange={this.handleLogCheckbox} disabled={!active} />
        </TableCell>
        <TableCell padding='checkbox'>
          <TextField
            margin="none"
            id="logPrefix"
            value={logPrefix}
            onChange={this.handleLogPrefixInput}
            disabled={!active}
          />
        </TableCell>
        <TableCell padding='checkbox'>
          <TextField
            margin="none"
            id="comment"
            value={comment}
            onChange={this.handleCommentInput}
            disabled={!active}
          />
        </TableCell>
        <TableCell padding='none'>
          <Fab
            size="small"
            color="secondary"
            aria-label="Add"
            className={classes.button}
            onClick={this.handleAddProfile}>
            <AddIcon />
          </Fab>
          <Fab
            size="small"
            aria-label="Remove"
            className={classes.button}
            onClick={this.handleRemoveProfile}>
            <RemoveIcon />
          </Fab>
        </TableCell>
      </TableRow>
    );
  }
}

export default SortableElement(withStyles(styles)(ProfileRow));
