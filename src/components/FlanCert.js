import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';

const styles = (theme) => ({
  root: {
    maxWidth: '100%',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: '#FD6864',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
});

class FlanCert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      cert: props.cert,
      expireDate: props.expireDate,
      open: false,
    };
  }

  componentDidMount() {}

  render() {
    const { classes } = this.props;
    const { cert, open } = this.state;

    const currentDate = new Date();
    const expireDate = new Date(cert.validity.notAfter);

    let dateDiff = expireDate.getTime() - currentDate.getTime();

    let dayDiff = Math.ceil(dateDiff / (1000 * 3600 * 24));

    let sevColor;
    let sevIcon;
    if (dayDiff > 90) {
      sevColor = '#34CDF9';
      sevIcon = <CheckIcon />;
    } else if (dayDiff >= 30) {
      sevColor = '#F8A102';
      sevIcon = <WarningIcon />;
    } else {
      sevColor = '#FD6864';
      sevIcon = <ErrorIcon />;
    }
    const avatar = {
      backgroundColor: sevColor,
    };

    const handleClick = () => {
      this.setState({ open: !open });
    };

    return (
      <div>
        <Card className={classes.root}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" style={avatar}>
                {sevIcon}
              </Avatar>
            }
            action={
              <IconButton aria-label="settings" onClick={handleClick}>
                {open ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            }
            title={cert.subject.commonName}
            subheader={
              'Expires: ' +
              cert.validity.notAfter +
              ' (in ' +
              dayDiff +
              ' days)'
            }
          />
          <Collapse in={open} timeout="auto" unmountOnExit>
            <CardContent>
              <List dense="true">
                {Object.keys(cert).map((section) => {
                  return (
                    <div>
                      <ListItem>
                        <ListItemText primary={section} />
                      </ListItem>
                      <List dense="true" component="div" disablePadding>
                        {Object.keys(cert[section]).map((item) => {
                          return (
                            <ListItem className={classes.nested}>
                              <ListItemText
                                primary={item}
                                secondary={cert[section][item]}
                              />
                            </ListItem>
                          );
                        })}
                      </List>
                    </div>
                  );
                })}
              </List>
            </CardContent>
          </Collapse>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(FlanCert);
