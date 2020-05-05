import React from 'react';
import clsx from 'clsx';
import * as _ from 'lodash'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import {useStyles} from './style'
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import UpdateIcon from '@material-ui/icons/Update';

import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import Tooltip from "@material-ui/core/Tooltip";

const ResultFields_theme = createMuiTheme({
    palette: {
        error: blue,
    },
});

export default function SO2Emission() {
    const [input, setInput] = React.useState({Qi: null, Sr: null, n1: null, n2: null, B: null, Bi: null});
    const [output, setOutput] = React.useState({});
    const [inFocus, setInFocus] = React.useState(null);
    const [decoratedResult, setDecoratedResult] = React.useState(false);
    const [autoSolving, setAutoSolving] = React.useState(false);
    const [fieldErrors, setFieldErrors] = React.useState({});
    const classes = useStyles();
    let usedEffect = false;

    React.useEffect(() => {
        usedEffect = true;
        if (autoSolving) {
            handleSolve();
        }
    }, [input]);

    function checkInputItem(key, value) {
        function addFieldError(target, error) {
            setFieldErrors(last => ({...last, [target]: error.message}));
        }

        function removeFieldError(target) {
            setFieldErrors(last => ({...last, [target]: undefined}));
        }

        try {
            if (!value || value === '') {
                throw new Error('Заповніть обов\'язкове поле')
            }
            if (isNaN(+value)) {
                throw new Error('Введіть корректне число');
            }
            if (value[0] === '0' && value[1] !== undefined) {
                throw new Error('Число не може починатися з нуля');
            }
            removeFieldError(key);
            return true;
        } catch (error) {
            addFieldError(key, error);
            return false;
        }
    }

    const checkInputItemDebounced = _.debounce(checkInputItem, 100);

    function handleSolve() {
        function checkInput(input) {
            let noErrors = true;
            for (const key in input) {
                const value = input[key];
                if (!checkInputItem(key, value)) {
                    noErrors = false;
                }
            }
            return noErrors;
        }


        try {


            if (!checkInput(input)) {
                return false;
            }
            const {Qi, Sr, n1, n2, B, Bi} = input;


            const Kso2 = (Math.pow(10, 6) / Qi) * ((2 * Sr) / 100) * (1 - n1) * (1 - n2 * B);
            const Ej = Math.pow(10, -6) * Kso2 * Bi * Qi;

            setOutput({result_kso2: Kso2, result_ej: Ej});

            setDecoratedResult(true);
            return true;
        } catch (e) {
            console.error(e);
        }
    }


    function handleInput(event) {
        function isNumber(text) {
            const re = /^[0-9.\b]+$/;
            if (text === '' || re.test(text)) {
                return true;
            }
            return false;
        }

        try {
            const name = event.target.name;
            const value = event.target.value;
            checkInputItemDebounced(name, value);
            if (isNumber(value)) {
                setInput(last => ({...last, [name]: value}));
            }
        } catch (e) {
            console.error(e);
        }
    }

    function handleFocus(event) {
        setDecoratedResult(false);
        setInFocus(event.target.name);
    }

    function handleAutoSolving(event) {
        setAutoSolving(last => !last);
        handleSolve();
    }

    if (usedEffect) {
        return null;
    }
    return (
        <>
            <ExpansionPanel>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel-info-content"
                    id="panel-info"
                >
                    <Typography> Довідка </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography>
                        Help text
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <Paper className={classes.paper}>
                <FormControl fullWidth>
                    <FormGroup>
                        <FormLabel component="legend">Введіть дані</FormLabel>
                        <TextField
                            required
                            helperText={fieldErrors.Qi}
                            label={'Qi'}
                            name={'Qi'}
                            fullWidth
                            onChange={handleInput}
                            value={input.Qi || ''}
                            onFocus={handleFocus}
                            error={!!fieldErrors.Qi}
                        />
                        <FormHelperText error={!!fieldErrors.Qi}>Нижча робоча теплота згоряння палива,
                            МДж/кг</FormHelperText>
                        {inFocus === 'Qi' &&
                        <FormHelperText className={classes.warning}>Help text</FormHelperText>}
                        <TextField
                            required
                            helperText={fieldErrors.Sr}
                            label={'Sr'}
                            name={'Sr'}
                            fullWidth
                            onChange={handleInput}
                            value={input.Sr || ''}
                            onFocus={handleFocus}
                            error={!!fieldErrors.Sr}
                        />
                        <FormHelperText error={!!fieldErrors.Sr}>Вміст сірки в паливі на робочу масу за проміжок часу P,
                            %</FormHelperText>
                        {inFocus === 'Sr' &&
                        <FormHelperText className={classes.warning}>Help text</FormHelperText>}
                        <TextField
                            required
                            helperText={fieldErrors.n1}
                            label={'n1'}
                            name={'n1'}
                            fullWidth
                            onChange={handleInput}
                            value={input.n1 || ''}
                            onFocus={handleFocus}
                            error={!!fieldErrors.n1}
                        />
                        <FormHelperText error={!!fieldErrors.n1}>Ефективність зв’язування сірки золою або сорбентом у
                            енергетичній установці</FormHelperText>
                        {inFocus === 'n1' &&
                        <FormHelperText className={classes.warning}>Help text</FormHelperText>}
                        <TextField
                            required
                            helperText={fieldErrors.n2}
                            label={'n2'}
                            name={'n2'}
                            fullWidth
                            onChange={handleInput}
                            value={input.n2 || ''}
                            onFocus={handleFocus}
                            error={!!fieldErrors.n2}
                        />
                        <FormHelperText error={!!fieldErrors.n2}>Ефективність очистки димових газів від оксидів
                            сірки</FormHelperText>
                        {inFocus === 'n2' &&
                        <FormHelperText className={classes.warning}>Help text</FormHelperText>}
                        <TextField
                            required
                            helperText={fieldErrors.B}
                            label={'B'}
                            name={'B'}
                            fullWidth
                            onChange={handleInput}
                            value={input.B || ''}
                            onFocus={handleFocus}
                            error={!!fieldErrors.B}
                        />
                        <FormHelperText error={!!fieldErrors.B}>Коефіцієнт роботи сіркоочисної
                            установки</FormHelperText>
                        {inFocus === 'B' && <FormHelperText className={classes.warning}>Help text</FormHelperText>}
                        <TextField
                            required
                            helperText={fieldErrors.Bi}
                            label={'Bi'}
                            name={'Bi'}
                            fullWidth
                            onChange={handleInput}
                            value={input.Bi || ''}
                            onFocus={handleFocus}
                            error={!!fieldErrors.Bi}
                        />
                        <FormHelperText error={!!fieldErrors.Bi}>Витрата i-го палива за проміжок часу P,
                            т</FormHelperText>
                        {inFocus === 'Bi' &&
                        <FormHelperText className={classes.warning}>Help text</FormHelperText>}
                    </FormGroup>

                    <ThemeProvider theme={ResultFields_theme}>
                        <FormGroup>
                            <FormLabel component="legend">Результат</FormLabel>
                            <TextField
                                label={'K SO2'}
                                helperText={'asdfasfasf'}
                                name={'result_kso2'}
                                fullWidth
                                disabled
                                value={output.result_kso2 || ''}
                                error={decoratedResult}
                            />
                            <TextField
                                label={'Ej'}
                                helperText={'asdfsafs'}
                                name={'result_ej'}
                                fullWidth
                                disabled
                                value={output.result_ej || ''}
                                error={decoratedResult}
                            />
                        </FormGroup>
                    </ThemeProvider>

                    <ButtonGroup fullWidth>
                        <Button
                            size="medium"
                            name={'calculate-btn'}
                            onClick={handleSolve}
                            disabled={autoSolving}
                        >
                            Solve
                        </Button>
                        <Tooltip title={'Auto solving'}>
                            <Button
                                size="medium"
                                aria-label="toggle-auto-calculating"
                                aria-haspopup="menu"
                                onClick={handleAutoSolving}
                                color={autoSolving ? 'primary' : 'default'}
                            >
                                <UpdateIcon/>
                            </Button>
                        </Tooltip>

                    </ButtonGroup>
                </FormControl>
            </Paper>
        </>
    );
}