import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import FlanCVE from './FlanCVE';

const styles = theme => ({
  root: {
    width: '50%',
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

class FlanApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      app: props.app,
      ip: props.ip,
      port: props.port,
      vulns: props.vulns,
    };
  }

  componentDidUpdate(prevProps) {
    if(this.props !== prevProps) {
      this.setState({app: this.props.app,
                     ip: this.props.ip,
                     port: this.props.port,
                     vulns: this.props.vulns});
    }

  }

  render() {
    const { classes } = this.props;
    const { app, port, vulns } = this.state;
    return(
      <Card className={classes.root}>
      <CardHeader
        /*avatar={
          <Avatar aria-label="recipe" style={avatar}>
            {sevLetter}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" href={link}>
            <LinkIcon />
          </IconButton>
        }*/
        title={app}
        subheader={"Ports: " + port}
      />
      <CardContent>
        <Typography variant="h6">
          <strong>Flan CVEs:</strong>
        </Typography>
        <br/>
        <br/>
        {vulns.map(vuln => (
          <div>
            <FlanCVE key={'key_' + vuln.name} title={vuln.name} app={vuln.app} description={vuln.description} severity={vuln.severity} link={'https://nvd.nist.gov/vuln/detail/' + vuln.name} />
            <br/>
          </div>
        ))}
      </CardContent>
    </Card>

  );

  }
}

export default withStyles(styles)(FlanApp);
