import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import logo from './dog-segmented-green.network-200x200.png';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import withRouter from './withRouter';
import { withStyles } from '@mui/styles';
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
} from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CreateGroup from './components/CreateGroup';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

//icons
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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
import Links from './components/Links';
import EnvLink from './components/EnvLink';

//redux store
import { groupsFetchData } from './actions/groups';
import { profilesFetchData } from './actions/profiles';
import { zonesFetchData } from './actions/zones';
import { hostsFetchData } from './actions/hosts';
import { servicesFetchData } from './actions/services';
import { linksFetchData } from './actions/links';
import { handleSelectedTab } from './actions/app';

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  appFrame: {
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
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

  handleDrawerOpen = () => {
    this.setState({ sideBarActive: true });
  };

  handleDrawerClose = () => {
    this.setState({ sideBarActive: false });
  };

  handleTabChange = (event, value) => {
    switch (value) {
      case 0:
        this.props.navigate('/groups');
        break;
      case 1:
        this.props.navigate('/profiles');
        break;
      case 2:
        this.props.navigate('/services');
        break;
      case 3:
        this.props.navigate('/hosts');
        break;
      case 4:
        this.props.navigate('/zones');
        break;
      case 5:
        this.props.navigate('/links');
        break;
      default:
        this.props.navigate('/groups');
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
    this.props.navigate('/createGroup');
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
    const { classes, theme } = this.props;
    const { sideBarActive } = this.state;

    const drawer = (
      <Drawer
        className={classes.drawer}
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
                this.props.navigate('/createGroup');
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
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
                      textColor="inherit"
                      indicatorColor="secondary"
                    >
                      <Tab label="Groups" />
                      <Tab label="Profiles" />
                      <Tab label="Services" />
                      <Tab label="Hosts" />
                      <Tab label="Zones" />
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
                  <Routes>
                    <Route path="/" element={<Groups />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/group/:id" element={<Group />} />
                    <Route path="/groupByName/:id" element={<Group />} />
                    <Route path="/profiles" element={<Profiles />} />
                    <Route path="/zones" element={<Zones />} />
                    <Route path="/createGroup" element={<CreateGroup />} />
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/zone/:id" element={<Zone />} />
                    <Route path="/hosts" element={<Hosts />} />
                    <Route path="/host/:id" element={<Host />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/service/:id" element={<Service />} />
                    <Route path="/links" element={<Links />} />
                    <Route path="/link/:id" element={<EnvLink />} />
                    <Route path="/link" element={<EnvLink />} />
                  </Routes>
                </main>
            </div>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGroups: () => dispatch(groupsFetchData()),
    fetchProfiles: () => dispatch(profilesFetchData()),
    fetchZones: () => dispatch(zonesFetchData()),
    fetchHosts: () => dispatch(hostsFetchData()),
    fetchServices: () => dispatch(servicesFetchData()),
    fetchLinks: () => dispatch(linksFetchData()),
    handleSelectedTab: (value) => dispatch(handleSelectedTab(value)),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles, { withTheme: true })(App))
);
