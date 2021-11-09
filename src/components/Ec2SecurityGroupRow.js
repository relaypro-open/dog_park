import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
//import Menu from '@material-ui/core/Menu';
//import MenuItem from '@material-ui/core/MenuItem';
//import Checkbox from '@material-ui/core/Checkbox';
//import MenuIcon from '@material-ui/icons/Menu';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Select from '@material-ui/core/Select';
import Fab from '@material-ui/core/Fab';
import { TableCell, TableRow } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
//import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
//import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { SortableElement } from 'react-sortable-hoc';
import debounce from 'lodash/debounce';
//import Autocomplete from '@material-ui/lab/Autocomplete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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

class Ec2SecurityGroupRow extends Component {
  constructor(props) {
    super(props);
    //console.log(props);

    let { data } = props;

    //console.log(data);
    //console.log(this.props.handleRegionInput);
    //console.log(this.props.handleSecurityGroupInput);

    this.state = {
        region: data.region,
        sgid: data.sgid,
    };

    this.regionFunction = debounce(this.props.handleRegionInput, 500);
    this.securityGroupFunction = debounce(this.props.handleSecurityGroupInput, 500);
  }

  componentDidUpdate = prevProps => {
    if (this.props.data !== prevProps.data) {
        this.setState((state, props) => {
          const {
            data,
          } = props;
          //console.log(data);
        let security_group_ids = {
            region: data.region,
            sgid: data.sgid
        };

          return {
            security_group_ids: security_group_ids,
          };
        });
      }
  };

  handleRegionInput = event => {
    this.setState({ region: event.target.value });
    this.regionFunction(
      this.props.pIndex,
      event.target.value
    );
  };

  handleSecurityGroupInput = event => {
    this.setState({ sgid: event.target.value });
    this.securityGroupFunction(
      this.props.pIndex,
      event.target.value
    );
  };

  handleAddSecurityGroup = event => {
    this.props.handleAddSecurityGroup(this.props.pIndex);
  };

  handleRemoveSecurityGroup = event => {
    this.props.handleRemoveSecurityGroup(this.props.pIndex);
  };

  handleStateButton = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleStateButtonClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    //add logic to prevent rerendering while loading
    const { classes } = this.props;

    const {
        region,
        sgid 
    } = this.state;

    console.log(this.props);
    console.log(this.state);
    return (
      <React.Fragment>
        <TableRow style={{ zIndex: 10000000 }}>
          <TableCell>
                    <Select
                      value={region}
                      onChange={this.handleRegionInput}
                      fullWidth
                    >
                      <MenuItem value={'us-east-1'}>us-east-1</MenuItem>
                      <MenuItem value={'us-east-2'}>us-east-2</MenuItem>
                      <MenuItem value={'us-west-1'}>us-west-1</MenuItem>
                      <MenuItem value={'us-west-2'}>us-west-1</MenuItem>
                    </Select>
          </TableCell>
          <TableCell>
            <TextField
              margin="none"
              value={sgid}
              onChange={this.handleSecurityGroupInput}
            />
          </TableCell>
          <TableCell padding="none">
            <Fab
              size="small"
              aria-label="Remove"
              className={classes.button}
              onMouseDown={this.handleRemoveSecurityGroup}
            >
              <RemoveIcon />
            </Fab>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
}

export default SortableElement(withStyles(styles)(Ec2SecurityGroupRow));
