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
import {ThemeProvider} from '@material-ui/core/styles';
import {blue} from '@material-ui/core/colors';
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const ResultFields_theme = createMuiTheme({
    palette: {
        error: blue,
    },
});

export default function SO2Emission() {
    const [input, setInput] = React.useState({Qi: 20.47, Sr: 2.6, n1: 0.06, n2: 0.00001, B: 1, Bi: 1096363});
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
                                secondary={`Теплота, що виділяється при повному
                        окисленні всіх горючих складових палива.`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={<>S<sup>r</sup> (Вміст сірки в паливі на робочу масу за проміжок часу P, %)</>}
                                secondary={`Масовий вміст сірки в робочій
                        масі потрібно визначати під час технічного аналізу палива відповідно до ГОСТ 27313-95 (ISO
                        1170-77). Усереднені значення вмісту сірки для різних видів і марок палива наведено в додатку Г . Ці
                        значення беруться у випадку відсутності достовірних даних технічного аналізу.`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={<>&eta;<sub>I</sub> (Ефективність зв’язування сірки золою або сорбентом у енергетичній установці)</>}
                                secondary={`Ефективність
                        зв’язування оксидів сірки золою або сорбентом у енергетичній установці n1 залежить від
                        технології спалювання та хімічного складу палива, яке спалюється, і типу сорбенту. Під час
                        спалювання твердого палива, до мінеральної складової якого входять сполуки лужних та
                        лужноземельних металів, відбувається часткове зв’язування сірки з утворенням сульфатів або
                        сульфітів. Під час спалювання твердого палива за технологіями киплячого шару подача сорбенту
                        разом з паливом забезпечує ефективне зв’язування сірки в топці енергетичної установки. За
                        відсутності даних для енергетичної установки про ефективність зв’язування сірки в топковому
                        просторі значення n1.`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={<>&eta;<sub>II</sub> (Ефективність очистки димових газів від оксидів сірки)</>}
                                secondary={`Димові гази можуть бути очищені від
                        оксидів сірки в сіркоочисних установках шляхом застосування технологій десульфуризації димових
                        газів з різною ефективністю очищення n2.`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={<>&beta; (Коефіцієнт роботи сіркоочисної установки)</>}
                                secondary={`Визначається як відношення часу роботи
                        сіркоочисної установки до часу роботи енергетичної установки. Для розрахунків необхідно
                        використовувати значення n2, одержане під час останнього випробування сіркоочисної установки, і
                        значення B, одержане при аналізі даних про роботу очисної та енергетичної установок у цілому.`}
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
                            helperText={fieldErrors.Sr}
                            label={<>S<sup>r</sup></>}
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
                        <FormHelperText className={classes.warning}>Масовий вміст сірки в робочій масі потрібно
                            визначати під час технічного аналізу палива відповідно до ГОСТ 27313-95 (ISO 1170-77).
                            Усереднені значення вмісту сірки для різних видів і марок палива наведено в додатку Г . Ці
                            значення беруться у випадку відсутності достовірних даних технічного аналізу.
                        </FormHelperText>}
                        <TextField
                            required
                            helperText={fieldErrors.n1}
                            label={<>&eta;<sub>I</sub></>}
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
                        <FormHelperText className={classes.warning}>
                            Ефективність зв’язування оксидів сірки золою або сорбентом у енергетичній установці n1. За
                            відсутності даних для енергетичної установки про ефективність зв’язування сірки в топковому
                            просторі значення n1.
                        </FormHelperText>}
                        <TextField
                            required
                            helperText={fieldErrors.n2}
                            label={<>&eta;<sub>II</sub></>}
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
                        <FormHelperText className={classes.warning}>
                            Димові гази можуть бути очищені від оксидів сірки в сіркоочисних установках шляхом
                            застосування технологій десульфуризації димових газів з різною ефективністю очищення
                            n2 </FormHelperText>}
                        <TextField
                            required
                            helperText={fieldErrors.B}
                            label={<>&beta;</>}
                            name={'B'}
                            fullWidth
                            onChange={handleInput}
                            value={input.B || ''}
                            onFocus={handleFocus}
                            error={!!fieldErrors.B}
                        />
                        <FormHelperText error={!!fieldErrors.B}>Коефіцієнт роботи сіркоочисної
                            установки</FormHelperText>
                        {inFocus === 'B' && <FormHelperText className={classes.warning}>
                            Коефіцієнт роботи сіркоочисної установки B визначається як відношення часу роботи
                            сіркоочисної установки до часу роботи енергетичної установки.
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
                        <FormHelperText error={!!fieldErrors.Bi}>Витрата i-го палива за проміжок часу P,
                            т</FormHelperText>
                        {inFocus === 'Bi' &&
                        <FormHelperText className={classes.warning}>Витрата i-ї одиниці палива у системі за проміжок
                            часу P, т</FormHelperText>}
                    </FormGroup>

                    <br/>
                    <ThemeProvider theme={ResultFields_theme}>
                        <FormGroup>
                            <FormLabel component="legend">Результат</FormLabel>
                            <TextField
                                label={<>K<sub>SO<sub>2</sub></sub></>}
                                helperText={'Показник емісії  kSO2  г/ГДж, оксидів сірки SO2 та SO3'}
                                name={'result_kso2'}
                                fullWidth
                                disabled
                                value={output.result_kso2 || ''}
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