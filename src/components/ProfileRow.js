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

    let { groups, zones, environments, environmentAdd, services, data } = props;

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

    const { sourceSelect, sourceReverse, groupName } = this.getGroupValues(
      zones,
      groups,
      data,
      false,
      environmentAdd
    );

    this.state = {
      active: data.active,
      order: data.order,
      type: data.type,
      intf: data.interface,
      environment: data.environment,
      group_type: data.group_type,
      group: data.group,
      service: data.service,
      action: data.action,
      log: data.log,
      logPrefix: data.logPrefix,
      comment: data.comment,
      connLimitAbove:
        data.conn_limit_above !== undefined ? data.conn_limit_above : '',
      connLimitMask:
        data.conn_limit_mask !== undefined ? data.conn_limit_mask : '',
      recentName: data.recent_name !== undefined ? data.recent_name : '',
      recentMask: data.recent_mask !== undefined ? data.recent_mask : '',
      seconds: data.seconds !== undefined ? data.seconds : '',
      hitCount: data.hit_count !== undefined ? data.hit_count : '',
      states: data.states,
      anchorEl: null,
      checkedNew,
      checkedEstablished,
      checkedRelated,
      sourceSelect,
      sourceReverse,
      serviceReverse: services.serviceNames,
      groupName,
      groupValue: groupName,
      serviceName: services.serviceIds[data.service],
      serviceValue: services.serviceIds[data.service],
      environments,
    };

    this.activeFunction = debounce(this.props.handleActiveCheckbox, 500);
    this.intfFunction = debounce(this.props.handleIntfSelect, 500);
    this.environmentFunction = debounce(this.props.handleEnvironmentSelect, 0);
    this.typeFunction = debounce(this.props.handleTypeSelect, 0);
    this.groupTypeFunction = debounce(this.props.handleGroupTypeSelect, 0);
    this.groupFunction = debounce(this.props.handleGroupSelect, 0);
    this.serviceFunction = debounce(this.props.handleServiceSelect, 0);
    this.statesFunction = debounce(this.props.handleStatesSelection, 500);
    this.actionFunction = debounce(this.props.handleActionSelect, 500);
    this.logFunction = debounce(this.props.handleLogCheckbox, 500);
    this.logPrefixFunction = debounce(this.props.handleLogPrefixInput, 500);
    this.commentFunction = debounce(this.props.handleCommentInput, 500);
    this.connLimitAboveFunction = debounce(
      this.props.handleConnLimitAboveInput,
      500
    );
    this.connLimitMaskFunction = debounce(
      this.props.handleConnLimitMaskInput,
      500
    );
    this.recentNameFunction = debounce(this.props.handleRecentNameInput, 500);
    this.recentMaskFunction = debounce(this.props.handleRecentMaskInput, 500);
    this.secondsFunction = debounce(this.props.handleSecondsInput, 500);
    this.hitCountFunction = debounce(this.props.handleHitCountInput, 500);
  }

  componentDidUpdate = prevProps => {
    if (this.props.data !== prevProps.data) {
      if (
        (this.props.data.group_type !== prevProps.data.group_type ||
          this.props.data.environment !== prevProps.data.environment) &&
        this.props.data.order === prevProps.data.order &&
        this.props.data.group === prevProps.data.group
      ) {
        const { zones, groups, data, environmentAdd } = this.props;
        const { groupId } = this.getGroupValues(
          zones,
          groups,
          data,
          true,
          environmentAdd
        );
        this.handleGroupSelect(groupId, data.group);
      } else {
        this.setState((state, props) => {
          const {
            zones,
            groups,
            services,
            data,
            environmentAdd,
            environments,
          } = props;
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

          const {
            sourceSelect,
            sourceReverse,
            groupName,
            groupId,
          } = this.getGroupValues(zones, groups, data, false, environmentAdd);

          return {
            active: data.active,
            order: data.order,
            type: data.type,
            intf: data.interface,
            environment: data.environment,
            group: groupId,
            group_type: data.group_type,
            service: data.service,
            states: data.states,
            action: data.action,
            log: data.log,
            logPrefix: data.log_prefix,
            comment: data.comment,
            connLimitAbove:
              data.conn_limit_above !== undefined ? data.conn_limit_above : '',
            connLimitMask:
              data.conn_limit_mask !== undefined ? data.conn_limit_mask : '',
            recentName: data.recent_name !== undefined ? data.recent_name : '',
            recentMask: data.recent_mask !== undefined ? data.recent_mask : '',
            seconds: data.seconds !== undefined ? data.seconds : '',
            hitCount: data.hit_count !== undefined ? data.hit_count : '',
            checkedNew,
            checkedEstablished,
            checkedRelated,
            sourceSelect,
            sourceReverse,
            serviceReverse: services.serviceNames,
            groupName,
            groupValue: groupName,
            serviceName: services.serviceIds[data.service],
            serviceValue: services.serviceIds[data.service],
            environments,
          };
        });
      }
    }
  };

  getGroupValues = (zones, groups, data, groupChanged, environmentAdd) => {
    if (
      !('environment' in data) ||
      data.environment === '' ||
      data.environment === 'local'
    ) {
      return this.getGroupType(zones, groups, data, groupChanged);
    } else {
      return this.getGroupType(
        environmentAdd[data.environment]['zones'],
        environmentAdd[data.environment]['groups'],
        data,
        groupChanged
      );
    }
  };

  getGroupType = (zones, groups, data, groupChanged) => {
    let sourceSelect = null;
    let sourceReverse = {};
    let groupName = '';
    let groupId = '';

    switch (data.group_type) {
      case 'ANY':
        sourceSelect = [{ id: 'any', name: 'any' }];
        sourceReverse = { any: 'any' };
        groupId = 'any';
        groupName = 'any';
        break;
      case 'ROLE':
        sourceSelect = groups.groupList;
        sourceReverse = groups.groupNames;
        if (groupChanged) {
          groupName = sourceSelect[0]['name'];
          groupId = sourceSelect[0]['id'];
        } else {
          if (data.group in groups.groupIds) {
            groupName = groups.groupIds[data.group];
          } else {
            groupName = 'ERROR: GROUP DOES NOT EXIST!';
          }
          groupId = data.group;
        }
        break;
      case 'ZONE':
        sourceSelect = zones.zoneList;
        sourceReverse = zones.zoneNames;
        if (groupChanged) {
          groupName = sourceSelect[0]['name'];
          groupId = sourceSelect[0]['id'];
        } else {
          groupName = zones.zoneIds[data.group];
          groupId = data.group;
        }
        break;
      default:
    }
    return { sourceSelect, sourceReverse, groupName, groupId };
  };

  handleActiveCheckbox = event => {
    this.setState({ active: event.target.checked });
    this.activeFunction(
      this.props.pIndex,
      event.target.checked,
      this.props.ruleType
    );
  };

  handleTypeSelect = event => {
    this.setState({ type: event.target.value });
    this.typeFunction(
      this.props.pIndex,
      event.target.value,
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

  handleEnvironmentSelect = event => {
    this.setState({ environment: event.target.value });
    this.environmentFunction(
      this.props.pIndex,
      event.target.value,
      this.props.ruleType
    );
  };

  handleGroupSelect = (value, prevVal) => {
    if (value != null) {
      this.setState({ group: value });
      this.groupFunction(this.props.pIndex, value, this.props.ruleType);
    } else {
      this.setState({ groupValue: prevVal });
    }
  };

  handleGroupInput = value => {
    if (value == null) {
      this.setState({ groupName: '' });
    } else {
      this.setState({ groupName: value });
    }
  };

  handleServiceSelect = value => {
    if (value != null) {
      this.setState({ service: value });
      this.serviceFunction(this.props.pIndex, value, this.props.ruleType);
    }
  };

  handleServiceInput = value => {
    if (value == null) {
      this.setState({ serviceName: '' });
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

  handleConnLimitAboveInput = event => {
    this.setState({ connLimitAbove: event.target.value });
    this.connLimitAboveFunction(
      this.props.pIndex,
      event.target.value,
      this.props.ruleType
    );
  };

  handleConnLimitMaskInput = event => {
    this.setState({ connLimitMask: event.target.value });
    this.connLimitMaskFunction(
      this.props.pIndex,
      event.target.value,
      this.props.ruleType
    );
  };

  handleRecentNameInput = event => {
    this.setState({ recentName: event.target.value });
    this.recentNameFunction(
      this.props.pIndex,
      event.target.value,
      this.props.ruleType
    );
  };

  handleRecentMaskInput = event => {
    this.setState({ recentMask: event.target.value });
    this.recentMaskFunction(
      this.props.pIndex,
      event.target.value,
      this.props.ruleType
    );
  };

  handleSecondsInput = event => {
    this.setState({ seconds: event.target.value });
    this.secondsFunction(
      this.props.pIndex,
      event.target.value,
      this.props.ruleType
    );
  };

  handleHitCountInput = event => {
    this.setState({ hitCount: event.target.value });
    this.hitCountFunction(
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
    this.setState({ anchorEl: event.currentTarget });
  };

  handleStateButtonClose = () => {
    this.setState({ anchorEl: null });
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
        checkedEstablished = event.target.checked;
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

    this.statesFunction(this.props.pIndex, states, this.props.ruleType);
    this.setState({ [name]: event.target.checked });
  };

  render() {
    //add logic to prevent rerendering while loading

    const { groups, zones, services, environments, classes } = this.props;
    if (groups.length === 0 || zones.length === 0 || services.length === 0) {
      return '';
    }
    const {
      active,
      type,
      environment,
      intf,
      order,
      group_type,
      action,
      log,
      logPrefix,
      comment,
      connLimitAbove,
      connLimitMask,
      recentName,
      recentMask,
      seconds,
      hitCount,
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
      serviceValue,
    } = this.state;

    let interf = intf;

    let environmentChoice = '';

    if (environment === undefined || environment === '') {
      environmentChoice = 'local';
    } else {
      environmentChoice = environment;
    }

    if (intf === '') {
      interf = 'ANY';
    }

    let stateText = 'ANY';

    if (states.length) {
      stateText = states.toString();
    }

    const sourceSelectOptions = {
      options: sourceSelect.map(option => option.name),
    };

    const serviceSelectOptions = {
      options: services.serviceList.map(option => option.name),
    };

    let groupInput = groupName;
    let groupValue_ = groupValue;

    if (groupName == null && groupValue == null) {
      groupInput = sourceSelectOptions['options'][0];
      groupValue_ = sourceSelectOptions['options'][0];
    } else if (groupName == null && groupValue != null) {
      groupInput = groupValue;
    }

    let ruleType = '';
    if (type === 'CONNLIMIT') {
      ruleType = (
        <TableRow style={{ zIndex: 10000000 }} id={'connLimitRow_' + order}>
          <TableCell />
          <TableCell />
          <TableCell padding="50" id={'connLimitCell1_' + order}>
            <TextField
              helperText="connLimitAbove"
              placeholder="10"
              margin="none"
              id={'connLimitAbove_' + order}
              value={connLimitAbove}
              onChange={this.handleConnLimitAboveInput}
              disabled={!active}
            />
          </TableCell>
          <TableCell padding="50" id={'connLimitCell2_' + order}>
            <TextField
              helperText="connLimitMask"
              placeholder="32"
              margin="none"
              id={'connLimitMask_' + order}
              value={connLimitMask}
              onChange={this.handleConnLimitMaskInput}
              disabled={!active}
            />
          </TableCell>
          <TableCell />
          <TableCell />
        </TableRow>
      );
    } else if (type === 'RECENT') {
      ruleType = (
        <TableRow style={{ zIndex: 10000000 }} id={'recentRow_' + order}>
          <TableCell />
          <TableCell />
          <TableCell padding="50" id={'recentCell1_' + order}>
            <TextField
              helperText="recentName"
              placeholder="DEFAULT"
              defaultValue="DEFAULT"
              margin="none"
              id={'recentName_' + order}
              value={recentName}
              onChange={this.handleRecentNameInput}
              disabled={!active}
            />
          </TableCell>
          <TableCell padding="50" id={'recentCell2_' + order}>
            <TextField
              helperText="recentMask"
              placeholder="255.255.255.255"
              margin="none"
              id={'recentMask_' + order}
              value={recentMask}
              onChange={this.handleRecentMaskInput}
              disabled={!active}
            />
          </TableCell>
          <TableCell padding="50" id={'recentCell3_' + order}>
            <TextField
              helperText="seconds"
              placeholder="60"
              margin="none"
              id={'seconds_' + order}
              value={seconds}
              onChange={this.handleSecondsInput}
              disabled={!active}
            />
          </TableCell>
          <TableCell padding="50" id={'recentCell4_' + order}>
            <TextField
              helperText="hitCount"
              placeholder="100"
              margin="none"
              id={'hitCount_' + order}
              value={hitCount}
              onChange={this.handleHitCountInput}
              disabled={!active}
            />
          </TableCell>
          <TableCell />
          <TableCell />
        </TableRow>
      );
    }

    let groupSelect = '';
    groupSelect = (
      <TableCell padding="none">
        <Autocomplete
          style={{ width: 200 }}
          {...sourceSelectOptions}
          inputValue={groupInput}
          value={groupValue_}
          renderInput={params => <TextField {...params} variant="standard" />}
          onChange={(event, value) => {
            this.handleGroupSelect(sourceReverse[value], groupValue_);
          }}
          onInputChange={(event, value) => {
            this.handleGroupInput(value);
          }}
          disabled={!active}
        />
      </TableCell>
    );

    return (
      <React.Fragment>
        <TableRow style={{ zIndex: 10000000 }}>
          <TableCell>
            <DragHandle />
          </TableCell>
          <TableCell padding="none">
            <Checkbox checked={active} onChange={this.handleActiveCheckbox} />
          </TableCell>
          <TableCell padding="checkbox" id={type + 'TableCell'}>
            <Select
              value={type}
              onChange={this.handleTypeSelect}
              disabled={!active}
            >
              <MenuItem value={'BASIC'}>BASIC</MenuItem>
              <MenuItem value={'CONNLIMIT'}>CONNLIMIT</MenuItem>
              <MenuItem value={'RECENT'}>RECENT</MenuItem>
            </Select>
            {ruleType}
          </TableCell>
          <TableCell padding="none">
            <Select
              value={interf}
              onChange={this.handleIntfSelect}
              disabled={!active}
            >
              <MenuItem value={'lo'}>lo</MenuItem>
              <MenuItem value={'ANY'}>any</MenuItem>
            </Select>
          </TableCell>
          <TableCell padding="none">
            <Select
              value={environmentChoice}
              onChange={this.handleEnvironmentSelect}
              disabled={!active}
            >
              <MenuItem value={'local'}>local</MenuItem>
              {environments.map(env => {
                return <MenuItem value={env.name}>{env.name}</MenuItem>;
              })}
            </Select>
          </TableCell>
          <TableCell padding="none">
            <Select
              value={group_type}
              onChange={this.handleGroupTypeSelect}
              disabled={!active}
            >
              <MenuItem value={'ANY'}>any</MenuItem>
              <MenuItem value={'ROLE'}>group</MenuItem>
              <MenuItem value={'ZONE'}>zone</MenuItem>
            </Select>
          </TableCell>
          {groupSelect}
          <TableCell padding="checkbox">
            <Autocomplete
              style={{ width: 200 }}
              {...serviceSelectOptions}
              inputValue={serviceName}
              value={serviceValue}
              renderInput={params => (
                <TextField {...params} variant="standard" />
              )}
              onChange={(event, value) => {
                this.handleServiceSelect(serviceReverse[value]);
              }}
              onInputChange={(event, value) => {
                this.handleServiceInput(value);
              }}
              disabled={!active}
            />
          </TableCell>
          <TableCell padding="none">
            <Button onClick={this.handleStateButton} disabled={!active}>
              {stateText}
            </Button>
            <Menu
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
          <TableCell padding="none">
            <Select
              value={action}
              onChange={this.handleActionSelect}
              disabled={!active}
            >
              <MenuItem value={'ACCEPT'}>ACCEPT</MenuItem>
              <MenuItem value={'DROP'}>DROP</MenuItem>
              <MenuItem value={'REJECT'}>REJECT</MenuItem>
            </Select>
          </TableCell>
          <TableCell padding="none">
            <Checkbox
              checked={log}
              onChange={this.handleLogCheckbox}
              disabled={!active}
            />
          </TableCell>
          <TableCell padding="checkbox">
            <TextField
              margin="none"
              value={logPrefix}
              onChange={this.handleLogPrefixInput}
              disabled={!active}
            />
          </TableCell>
          <TableCell padding="checkbox">
            <TextField
              margin="none"
              value={comment}
              onChange={this.handleCommentInput}
              disabled={!active}
            />
          </TableCell>
          <TableCell padding="none">
            <Fab
              size="small"
              color="secondary"
              aria-label="Add"
              className={classes.button}
              onClick={this.handleAddProfile}
            >
              <AddIcon />
            </Fab>
            <Fab
              size="small"
              aria-label="Remove"
              className={classes.button}
              onClick={this.handleRemoveProfile}
            >
              <RemoveIcon />
            </Fab>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
}

export default SortableElement(withStyles(styles)(ProfileRow));
