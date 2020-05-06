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
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";

const ResultFields_theme = createMuiTheme({
    palette: {
        error: blue,
    },
});

export default function HardParticlesEmission() {
    const [input, setInput] = React.useState({Qi: 20.47, Ar: 25.5, Awin: 0.75, Gwin: 2, nzu: 0.97, ktws: 0.01, Bi: 1096363});
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
            if (value[0] === '0' && value[1] !== undefined && value[1]!== '.') {
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
            const {Qi, Ar, Awin, Gwin, nzu, ktws, Bi} = input;

            const Kte = (Math.pow(10, 6)/Qi)*Awin*(Ar/(100-Gwin))*(1-nzu)+(+ktws);
            const Ej = Math.pow(10, -6) * Kte * Bi * Qi;

            setOutput({result_kte: Kte, result_ej: Ej});

            setDecoratedResult(true);
            return true;
        } catch (e) {
            console.error(e);
        }
    }


    function handleInput(event) {
        function isNumber(text) {
            const re = /^[0-9.\-\b]+$/;
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
                    <List>
                        <ListItem>
                            <ListItemText
                                primary={<>Q<sub>i</sub><sup>r</sup> (Нижча робоча теплота згоряння палива, МДж/кг)</>}
                                secondary={`Теплота, що виділяється при повному окисленні всіх горючих складових палива.`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={<>A<sup>r</sup> (Вміст золи в паливі на робочу масу, %)</>}
                                secondary={<>Вміст золи A<sub>r</sub> в паливі та горючих у викиді твердих частинок Г<sub>вин</sub> визначаються при проведенні технічного аналізу за ГОСТ 11022-95 (ISO 1171-81) палива і леткої золи, яка виходить з енергетичної установки, відповідно.</>}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={<>A<sub>вин</sub> (Частка золи, яка виходить з котла у вигляді леткої золи)</>}
                                secondary={<>Частка золи, яка виноситься з енергетичної установки у вигляді леткої золи, A<sub>вин</sub> залежить від технології спалювання палива і визначається за даними останніх випробувань енергетичної установки, а за їх відсутності – за паспортними даними. За відсутності таких даних значення A<sub>вин</sub> приймаються згідно з таблицею </>}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={<>Г<sub>вин</sub> (Масовий вміст горючих речовин у викидах твердих частинок, %)</>}
                                secondary={<>Вміст золи A<sub>r</sub> в паливі та горючих у викиді твердих частинок Г<sub>вин</sub> визначаються при проведенні технічного аналізу за ГОСТ 11022-95 (ISO 1171-81) палива і леткої золи, яка виходить з енергетичної установки, відповідно.</>}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={<>&eta;<sub>зу</sub> (Ефективність очищення димових газів від твердих частинок)</>}
                                secondary={<>Значення ефективності очищення димових газів від твердих частинок &eta;<sub>зу</sub> визначається за результатами останніх випробувань золоуловлювальної установки або за її паспортними даними. Ефективність золоуловлювальної установки визначається як різниця між одиницею та відношенням масових концентрацій твердих частинок після і до золоуловлювальної установки</>}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={<>k<sub>твS</sub> (Показник емісії твердих продуктів взаємодії сорбенту та оксидів сірки і твердих частинок сорбенту, г/ГДж)</>}
                                secondary={<>Показник емісії твердих частинок невикористаного в енергетичній установці сорбенту та утворених сульфатів і сульфітів k<sub>твS</sub>, г/ГДж</>}
                            />
                        </ListItem>

                        <ListItem>
                            <ListItemText
                                primary={<>B<sub>i</sub> (Витрата i-го палива за проміжок часу P, т)</>}
                                secondary={`Витрата i-ї одиниці палива у системі за
                        проміжок часу P, т`}
                            />
                        </ListItem>
                    </List>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <Paper className={classes.paper}>
                <FormControl fullWidth>
                    <FormGroup>
                        <FormLabel component="legend">Введіть дані</FormLabel>
                        <TextField
                            required
                            helperText={fieldErrors.Qi}
                            label={<>Q<sub>i</sub><sup>r</sup></>}
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
                        <FormHelperText className={classes.warning}>
                            Теплота, що виділяється при повному окисленні всіх горючих складових палива.
                        </FormHelperText>}
                        <TextField
                            required
                            helperText={fieldErrors.Ar}
                            label={<>A<sup>r</sup></>}
                            name={'Ar'}
                            fullWidth
                            onChange={handleInput}
                            value={input.Ar || ''}
                            onFocus={handleFocus}
                            error={!!fieldErrors.Ar}
                        />
                        <FormHelperText error={!!fieldErrors.Ar}>Вміст золи в паливі на робочу масу, %</FormHelperText>
                        {inFocus === 'Ar' &&
                        <FormHelperText className={classes.warning}>
                            Вміст золи Ar в паливі та горючих у викиді твердих частинок Г(вин) визначаються при проведенні технічного аналізу за ГОСТ 11022-95 (ISO 1171-81) палива і леткої золи, яка виходить з енергетичної установки, відповідно.
                        </FormHelperText>}
                        <TextField
                            required
                            helperText={fieldErrors.Awin}
                            label={<>A<sub>вин</sub></>}
                            name={'Awin'}
                            fullWidth
                            onChange={handleInput}
                            value={input.Awin || ''}
                            onFocus={handleFocus}
                            error={!!fieldErrors.Awin}
                        />
                        <FormHelperText error={!!fieldErrors.Awin}>Частка золи, яка виходить з котла у вигляді леткої золи</FormHelperText>
                        {inFocus === 'Awin' &&
                        <FormHelperText className={classes.warning}>
                            Частка золи, яка виноситься з енергетичної установки у вигляді леткої золи, A(вин) залежить від технології спалювання палива і визначається за даними останніх випробувань енергетичної установки, а за їх відсутності – за паспортними даними
                        </FormHelperText>}
                        <TextField
                            required
                            helperText={fieldErrors.Gwin}
                            label={<>Г<sub>вин</sub></>}
                            name={'Gwin'}
                            fullWidth
                            onChange={handleInput}
                            value={input.Gwin || ''}
                            onFocus={handleFocus}
                            error={!!fieldErrors.Gwin}
                        />
                        <FormHelperText error={!!fieldErrors.Gwin}>Масовий вміст горючих речовин у викидах твердих частинок, %</FormHelperText>
                        {inFocus === 'Gwin' &&
                        <FormHelperText className={classes.warning}>
                            Вміст золи Ar в паливі та горючих у викиді твердих частинок Г(вин) визначаються при проведенні технічного аналізу за ГОСТ 11022-95 (ISO 1171-81) палива і леткої золи, яка виходить з енергетичної установки, відповідно.
                        </FormHelperText>}
                        <TextField
                            required
                            helperText={fieldErrors.nzu}
                            label={<>&eta;<sub>зу</sub></>}
                            name={'nzu'}
                            fullWidth
                            onChange={handleInput}
                            value={input.nzu || ''}
                            onFocus={handleFocus}
                            error={!!fieldErrors.nzu}
                        />
                        <FormHelperText error={!!fieldErrors.nzu}>Ефективність очищення димових газів від твердих частинок</FormHelperText>
                        {inFocus === 'nzu' &&
                        <FormHelperText className={classes.warning}>
                            Значення ефективності очищення димових газів від твердих частинок hзу визначається за результатами останніх випробувань золоуловлювальної установки або за її паспортними даними. Ефективність золоуловлювальної установки визначається як різниця між одиницею та відношенням масових концентрацій твердих частинок після і до золоуловлювальної установки
                        </FormHelperText>}
                        <TextField
                            required
                            helperText={fieldErrors.ktws}
                            label={<>k<sub>твS</sub></>}
                            name={'ktws'}
                            fullWidth
                            onChange={handleInput}
                            value={input.ktws || ''}
                            onFocus={handleFocus}
                            error={!!fieldErrors.ktws}
                        />
                        <FormHelperText error={!!fieldErrors.ktws}>Показник емісії твердих продуктів взаємодії сорбенту та оксидів сірки і твердих частинок сорбенту, г/ГДж</FormHelperText>
                        {inFocus === 'ktws' &&
                        <FormHelperText className={classes.warning}>
                            Показник емісії твердих частинок невикористаного в енергетичній установці сорбенту та утворених сульфатів і сульфітів kтвS, г/ГДж
                        </FormHelperText>}
                        <TextField
                            required
                            helperText={fieldErrors.Bi}
                            label={<>B<sub>i</sub></>}
                            name={'Bi'}
                            fullWidth
                            onChange={handleInput}
                            value={input.Bi || ''}
                            onFocus={handleFocus}
                            error={!!fieldErrors.Bi}
                        />
                        <FormHelperText error={!!fieldErrors.Bi}>Витрата i-го палива за проміжок часу P, т</FormHelperText>
                        {inFocus === 'Bi' &&
                        <FormHelperText className={classes.warning}>Витрата i-ї одиниці палива у системі за проміжок часу P, т</FormHelperText>}
                    </FormGroup>

                    <br/>
                    <ThemeProvider theme={ResultFields_theme}>
                        <FormGroup>
                            <FormLabel component="legend">Результат</FormLabel>
                            <TextField
                                label={<>k<sub>тв</sub></>}
                                helperText={'Показник емісії речовини у вигляді суспендованих твердих частинок'}
                                name={'result_kte'}
                                fullWidth
                                disabled
                                value={output.result_kte || ''}
                                error={decoratedResult}
                            />
                            <TextField
                                label={<>E<sub>j</sub></>}
                                helperText={'Валовий викид j-ї забруднювальної речовини Ej, т, що надходить у атмосферу з димовими газами енергетичної установки за проміжок часу Р'}
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