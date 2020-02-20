import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import LinkIcon from '@material-ui/icons/Link';

const styles = theme => ({
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
});

class FlanCVE extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      app: props.app,
      description: props.description,
      severity: props.severity,
      link: props.link,
      ip: props.ip,
      port: props.port
    };
  }

  componentDidMount() {

  }

  render() {
    const { classes } = this.props;
    const { title, app, description, severity, link} = this.state;
    let sevColor;
    let sevLetter;
    if (severity < 4) {
      sevColor = "#34CDF9";
      sevLetter = 'L'
    } else if (severity < 7) {
      sevColor = '#F8A102';
      sevLetter = 'M'
    } else {
      sevColor = '#FD6864';
      sevLetter = 'H'
    }
    const avatar = {
      backgroundColor: sevColor,
    };
    return(
      <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" style={avatar}>
            {sevLetter}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" href={link}>
            <LinkIcon />
          </IconButton>
        }
        title={title}
        subheader={app} //+ "\nIP: " + ip + "  Port: " + port}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
        {description}
        </Typography>
      </CardContent>
    </Card>

  );

  }
}

export default withStyles(styles)(FlanCVE);
