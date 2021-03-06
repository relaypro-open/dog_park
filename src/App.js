import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import logo from './dog-segmented-green.network-200x200.png';
import './App.css';
import { withRouter, Link, Route } from 'react-router-dom';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { dogTheme } from './styles/muiTheme';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  List,
  IconButton,
  Tooltip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CreateGroup from './components/CreateGroup';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

//icons
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Groups from './components/Groups';
import Group from './components/Group';
import Profiles from './components/Profiles';
import Zones from './components/Zones';
import Profile from './components/Profile';
import Zone from './components/Zone';
import Service from './components/Service';
import Hosts from './components/Hosts';
import Services from './components/Services';
import Host from './components/Host';
import Vulnerabilities from './components/Vulnerabilities';
import Certificates from './components/Certificates';
import AWSCertificates from './components/AWSCertificates';
import Links from './components/Links';
import EnvLink from './components/EnvLink';

//redux store
import { groupsFetchData } from './actions/groups';
import { flanIpsFetchData } from './actions/flan_ips';
import { profilesFetchData } from './actions/profiles';
import { zonesFetchData } from './actions/zones';
import { hostsFetchData } from './actions/hosts';
import { servicesFetchData } from './actions/services';
import { linksFetchData } from './actions/links';
import { handleSelectedTab } from './actions/app';
import { handleSelectedScanLocation } from './actions/app';

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  appFrame: {
    height: '100%',
    zIndex: 1,
    overflow: 'scroll',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'fixed',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'appBarShift-left': {
    marginLeft: drawerWidth,
  },
  'appBarShift-right': {
    marginRight: drawerWidth,
  },
  speedDialButton: {
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    position: 'fixed',
    color: 'secondary',
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  dogTitle: {
    minWidth: 'fit-content',
    marginRight: 10,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    height: '100vh',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    //justifySelf: 'stretch',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  'content-left': {
    marginLeft: -drawerWidth,
  },
  'content-right': {
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: 0,
  },
  'contentShift-right': {
    marginRight: 0,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  icon_img: {
    height: '30px',
    width: 'auto',
  },
  logo_img: {
    height: '50px',
    width: 'auto',
    paddingRight: '24px',
  },
  logo_img_open: {
    height: '50px',
    width: 'auto',
    paddingRight: '12px',
  },
  flex: {
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sideBarActive: false,
      qaListActive: false,
      proListActive: false,
      selectedTab: 0,
      speedDialOpen: false,
      isLoading: false,
      hasErrored: false,
      groupName: '',
      seletedProfile: '',
    };
  }

  componentDidMount() {
    this.props.fetchProfiles();
    this.props.fetchZones();
    this.props.fetchServices();
    this.props.fetchHosts();
    this.props.fetchLinks();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.scanLocation !== this.props.scanLocation) {
      this.props.fetchFlanIps();
    }
  }

  handleChange = (event) => {
    this.props.handleSelectedScanLocation(event.target.value);
  };

  handleDrawerOpen = () => {
    this.setState({ sideBarActive: true });
  };

  handleDrawerClose = () => {
    this.setState({ sideBarActive: false });
  };

  handleTabChange = (event, value) => {
    switch (value) {
      case 0:
        this.props.history.push('/groups');
        break;
      case 1:
        this.props.history.push('/profiles');
        break;
      case 2:
        this.props.history.push('/services');
        break;
      case 3:
        this.props.history.push('/hosts');
        break;
      case 4:
        this.props.history.push('/zones');
        break;
      case 5:
        this.props.history.push('/vulnerabilities');
        break;
      case 6:
        this.props.history.push('/certificates');
        break;
      case 7:
        this.props.history.push('/aws_certificates');
        break;
      case 8:
        this.props.history.push('/links');
        break;
      default:
        this.props.history.push('/groups');
    }
    this.props.handleSelectedTab(value);
  };

  handleSpeedDialClick = () => {
    this.setState({ speedDialOpen: !this.state.speedDialOpen });
  };

  handleSpeedDialOpen = () => {
    this.setState({ speedDialOpen: true });
  };

  handleSpeedDialClose = () => {
    this.setState({ speedDialOpen: false });
  };

  handleAddGroup = () => {
    this.props.history.push('/createGroup');
  };

  render() {
    if (this.props.groups.groupList.length === 0) {
      return (
        <div>
          {' '}
          <CircularProgress />
        </div>
      );
    }
    const { classes, theme, scanLocation } = this.props;
    const { sideBarActive } = this.state;

    const drawer = (
      <Drawer
        variant="persistent"
        anchor="left"
        open={sideBarActive}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
          <Typography variant="subtitle1" color="inherit">
            Configs
          </Typography>
          <Tooltip id="tooltip-fab" title="Add Group">
            <IconButton
              onClick={() => {
                this.props.history.push('/createGroup');
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
        <Divider />
        <FormControl className={classes.formControl}>
          <InputLabel id="scan-location-input">Scan Location</InputLabel>
          <Select
            labelId="scan-location-input-label"
            id="scan-location-input"
            value={scanLocation}
            onChange={this.handleChange}
          >
            <MenuItem value={'external'}>External</MenuItem>
            <MenuItem value={'internal'}>Internal</MenuItem>
          </Select>
        </FormControl>
        <Divider />
        <List
          component="nav"
          subheader={<ListSubheader component="div">Groups</ListSubheader>}
        >
          {this.props.groups.groupList.map((group) => (
            <Link
              key={'link' + group.id}
              to={'/group/' + group.id}
              style={{ textDecoration: 'none' }}
            >
              <ListItem key={group.id} button>
                <ListItemText primary={group.name} />
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
        <List />
      </Drawer>
    );

    return (
      <div className="App">
        <div>
          <MuiThemeProvider theme={dogTheme}>
            <MuiPickersUtilsProvider utils={MomentUtils} theme={dogTheme}>
              <div className={classes.appFrame}>
                <AppBar
                  className={classNames(classes.appBar, {
                    [classes.appBarShift]: sideBarActive,
                    [classes[`appBarShift-left`]]: sideBarActive,
                  })}
                >
                  <Toolbar disableGutters={!sideBarActive}>
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={this.handleDrawerOpen}
                      className={classNames(
                        classes.menuButton,
                        sideBarActive && classes.hide
                      )}
                    >
                      <MenuIcon />
                    </IconButton>
                    <Typography
                      variant="h5"
                      color="inherit"
                      className={classes.dogTitle}
                    >
                      Dog Park
                    </Typography>
                    <Tabs
                      className={classes.flex}
                      value={this.props.selectedTab}
                      onChange={this.handleTabChange}
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      <Tab label="Groups" />
                      <Tab label="Profiles" />
                      <Tab label="Services" />
                      <Tab label="Hosts" />
                      <Tab label="Zones" />
                      <Tab label="Vulnerabilities" />
                      <Tab label="Certificates" />
                      <Tab label="AWS Certificates" />
                      <Tab label="Links" />
                    </Tabs>
                    {
                      <span>
                        <img
                          alt="dog_logo"
                          className={classNames(classes.logo_img, {
                            [classes.logo_img_open]: sideBarActive,
                          })}
                          src={logo}
                        />
                      </span>
                    }
                  </Toolbar>
                </AppBar>
                {drawer}
                <main
                  className={classNames(
                    classes.content,
                    classes[`content-left`],
                    {
                      [classes.contentShift]: sideBarActive,
                      [classes[`contentShift-left`]]: sideBarActive,
                    }
                  )}
                >
                  <div className={classes.drawerHeader} />
                  <Route exact={true} path="/" component={Groups} />
                  <Route exact={true} path="/groups" component={Groups} />
                  <Route path="/group/:id" component={Group} />
                  <Route path="/groupByName/:id" component={Group} />
                  <Route exact={true} path="/profiles" component={Profiles} />
                  <Route exact={true} path="/zones" component={Zones} />
                  <Route
                    exact={true}
                    path="/createGroup"
                    component={CreateGroup}
                  />
                  <Route path="/profile/:id" component={Profile} />
                  <Route path="/zone/:id" component={Zone} />
                  <Route exact={true} path="/hosts" component={Hosts} />
                  <Route path="/host/:id" component={Host} />
                  <Route exact={true} path="/services" component={Services} />
                  <Route path="/service/:id" component={Service} />
                  <Route
                    exact={true}
                    path="/vulnerabilities"
                    component={Vulnerabilities}
                  />
                  <Route
                    exact={true}
                    path="/certificates"
                    component={Certificates}
                  />
                  <Route
                    exact={true}
                    path="/aws_certificates"
                    component={AWSCertificates}
                  />
                  <Route exact={true} path="/links" component={Links} />
                  <Route path="/link/:id" component={EnvLink} />
                  <Route exact={true} path="/link" component={EnvLink} />
                </main>
              </div>
            </MuiPickersUtilsProvider>
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    groups: state.groups,
    hosts: state.hosts,
    selectedTab: state.selectedTab,
    scanLocation: state.scanLocation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGroups: () => dispatch(groupsFetchData()),
    fetchFlanIps: () => dispatch(flanIpsFetchData()),
    fetchProfiles: () => dispatch(profilesFetchData()),
    fetchZones: () => dispatch(zonesFetchData()),
    fetchHosts: () => dispatch(hostsFetchData()),
    fetchServices: () => dispatch(servicesFetchData()),
    fetchLinks: () => dispatch(linksFetchData()),
    handleSelectedTab: (value) => dispatch(handleSelectedTab(value)),
    handleSelectedScanLocation: (value) =>
      dispatch(handleSelectedScanLocation(value)),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles, { withTheme: true })(App))
);
