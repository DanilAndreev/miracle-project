import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


export default function SO2Emission() {
    const [input, setInput] = React.useState({});
    const [output, setOutput] = React.useState({});

    function handleSolve() {
        /*
        for (const item of input) {
            if (!item) {
                throw new Error("Enter required fields");
            }
        }
        */

        const {Qi, Sr, n1, n2, B, Bi} = input;

        try {
            const Kso2 = (Math.pow(10, 6) / Qi) * ((2 * Sr) / 100) * (1 - n1) * (1 - n2 * B);
            const Ej = Math.pow(10, -6) * Kso2 * Bi * Qi;

            setOutput({result_kso2: Kso2, result_ej: Ej});
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
            if (isNumber(value)) {
                setInput(last => {
                    return {...last, [name]: value};
                });
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Grid container>
            <Grid item sm={3}/>
            <Grid item sm={6}>
                <Paper>
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel-info-content"
                            id="panel-info"
                        >
                            <Typography>Information</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                Help text
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>


                    <TextField
                        required
                        label={'Нижча робоча теплота згоряння палива, МДж/кг'}
                        name={'Qi'}
                        fullWidth
                        onChange={handleInput}
                        value={input.Qi || ''}
                    />
                    <TextField
                        required
                        label={'Вміст сірки в паливі на робочу масу за проміжок часу P, %'}
                        name={'Sr'}
                        fullWidth
                        onChange={handleInput}
                        value={input.Sr || ''}
                    />
                    <TextField
                        required
                        label={'Ефективність зв’язування сірки золою або сорбентом у енергетичній установці'}
                        name={'n1'}
                        fullWidth
                        onChange={handleInput}
                        value={input.n1 || ''}
                    />
                    <TextField
                        required
                        label={'Ефективність очистки димових газів від оксидів сірки'}
                        name={'n2'}
                        fullWidth
                        onChange={handleInput}
                        value={input.n2 || ''}
                    />
                    <TextField
                        required
                        label={'Коефіцієнт роботи сіркоочисної установки'}
                        name={'B'}
                        fullWidth
                        onChange={handleInput}
                        value={input.B || ''}
                    />
                    <TextField
                        required
                        label={'Витрата i-го палива за проміжок часу P, т'}
                        name={'Bi'}
                        fullWidth
                        onChange={handleInput}
                        value={input.Bi || ''}
                    />

                    <TextField
                        label={'K SO2'}
                        name={'result_kso2'}
                        fullWidth
                        disabled
                        value={output.result_kso2 || ''}
                    />
                    <TextField
                        label={'Ej'}
                        name={'result_ej'}
                        fullWidth
                        disabled
                        value={output.result_ej || ''}
                    />

                    <Button fullWidth name={'calculate-btn'} onClick={handleSolve}>Solve</Button>
                </Paper>
            </Grid>
            <Grid item sm={3}/>
        </Grid>
    );
}