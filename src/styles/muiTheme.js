import { createMuiTheme } from '@material-ui/core/styles';
//import indigo from '@material-ui/core/colors/indigo';
//import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

// All the following keys are optional.
// We try our best to provide a great default value.
export const dogTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#212121',
      light: '#484848',
      dark: '#000000',
    },
    secondary: {
      main: '#6fc55d',
      light: '#8bd07d',
      dark: '#4d8941',
      //main: '#3949ab',
      //light: '#6f74dd',
      //dark: '#00227b',
    },
    error: red,
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
});
