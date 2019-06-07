import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import MenuIcon from '@material-ui/icons/Menu';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import { TableCell, TableRow } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import debounce from 'lodash/debounce';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import PropTypes from 'prop-types';

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

    let { data } = props;

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
      }
      return true;
    })

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
        const { data } = props;
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
          }
        })
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
        };
      })
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

  renderGroupInput = inputProps => {
    const { InputProps, classes, ref, ...other } = inputProps;

    return (
      <TextField
        InputProps={{
          inputRef: ref,
          classes: {
            root: classes.inputRoot,
            input: classes.inputInput,
          },
          ...InputProps,
        }}
        {...other}
      />
    );
  };

  renderGroupSuggestion = suggestionProps => {
    const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

    return (
      <MenuItem
        {...itemProps}
        key={suggestion.label}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
        value={suggestion.id}
        >
        {suggestion.label}
        </MenuItem>
    );
  };

  /*renderGroupSuggestion.propTypes = {
    highlightedIndex: PropTypes.number,
    index: PropTypes.number,
    itemProps: PropTypes.object,
    selectedItem: PropTypes.string,
    suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
  };*/

  getSuggestions = (groups, value, { showEmpty = false } = {}) => {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0 && !showEmpty
      ? []
      : groups.filter(suggestion => {
          const keep =
            count < 10 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

          if (keep) {
            count += 1;
          }

          return keep;
        });
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
    if ( groups === [] || zones === [] || services === [] ) {
      return '';
    }
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
      states,
      anchorEl,
      checkedNew,
      checkedEstablished,
      checkedRelated,
    } = this.state;

    let sourceSelect = null;
    let objects = {};

    switch (group_type) {
      case 'ANY':
        //var obj = {id: 'any', label: 'any'};
        //objects['any'] = 'any';
        sourceSelect = <MenuItem value={'any'}>any</MenuItem>;
        //sourceSelect = [obj];
        break;
      case 'ROLE':
        sourceSelect = groups.map(grp => {
            //var obj = {id: grp.id, label: grp.name};
            //objects[grp.id] = grp.name;
            console.log(grp.name);
            return (
                <MenuItem key={'grp' + grp.id} value={grp.id}>{grp.name}</MenuItem>
            );
          });
        break;
      case 'ZONE':
        sourceSelect = zones.map(grp => {
            //var obj = {id: grp.id, label: grp.name};
            //objects[grp.id] = grp.name;
            console.log(grp.name);
            return (
                <MenuItem key={'grp' + grp.id} value={grp.id}>{grp.name}</MenuItem>
            );
          });
        break;
    }

    //<Select value={group} onChange={this.handleGroupSelect}>
     // {sourceSelect}
    //</Select>


    let interf = intf;

    if (intf === '') {
      interf = 'ANY';
    }

    let stateText = 'ANY';

    if (states.length) {
      stateText = states.toString();
    }

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
          <Select value={group} onChange={this.handleGroupSelect} disabled={!active}>
            {sourceSelect}
          </Select>
        </TableCell>
        <TableCell padding='checkbox'>
          <Select value={service} onChange={this.handleServiceSelect} disabled={!active}>
            <MenuItem key={'serv_any'} value='any'>
              any
            </MenuItem>
            {services.map(serv => {
              return (
                <MenuItem key={'serv' + serv.id} value={serv.id}>{serv.name}</MenuItem>
              );
            })}
          </Select>
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

//<Downshift id="downshift-simple"
//           initialSelectedItem={objects[group]}
//           selectedItemChange={this.handleGroupSelect}>
//  {({
//    getInputProps,
//    getItemProps,
//    getLabelProps,
//    getMenuProps,
//    highlightedIndex,
//    inputValue,
//    isOpen,
//    selectedItem,
//    openMenu,
//  }) => {
//    const { onBlur, onFocus, ...inputProps } = getInputProps({
//      placeholder: 'Group or Zone',
//    });
//
//    return (
//      <div className={classes.container}>
//        {this.renderGroupInput({
//          fullWidth: true,
//          classes,
//          InputLabelProps: getLabelProps({ shrink: true }),
//          InputProps: { onBlur, onFocus: openMenu },
//          inputProps,
//        })}
//
//        <div {...getMenuProps()}>
//          {isOpen ? (
//            <Paper className={classes.paper} square>
//              {this.getSuggestions(sourceSelect, inputValue).map((suggestion, index) =>
//                this.renderGroupSuggestion({
//                  suggestion,
//                  index,
//                  itemProps: getItemProps({ item: suggestion.label }),
//                  highlightedIndex,
//                  selectedItem,
//                }),
//              )}
//            </Paper>
//          ) : null}
//        </div>
//      </div>
//    );
//  }}
//</Downshift>
