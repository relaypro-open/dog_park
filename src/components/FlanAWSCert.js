import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
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

class FlanAWSCert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      cert: props.cert,
      lb: props.lb,
      expireDate: props.expireDate,
      open: false,
    };
  }

  componentDidMount() {}

  render() {
    const { classes } = this.props;
    const { cert, lb } = this.state;

    const currentDate = new Date();
    const expireDate = new Date(cert.expiration);

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

    return (
      <div>
        <Card className={classes.root}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" style={avatar}>
                {sevIcon}
              </Avatar>
            }
            title={'LB: ' + lb}
            subheader={
              'Cert: ' +
              cert.cert_name +
              ' Expires: ' +
              cert.expiration +
              ' (in ' +
              dayDiff +
              ' days)'
            }
          />
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(FlanAWSCert);
