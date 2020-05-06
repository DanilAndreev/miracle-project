import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    paper: {
        padding: '20px',
    },
    warning: {
        color: theme.palette.primary.main,
    },
}));