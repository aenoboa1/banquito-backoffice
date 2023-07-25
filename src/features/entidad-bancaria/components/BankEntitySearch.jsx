import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const currenciesId = [
    {
        value: 'Id',
        label: '64b1892b9c2c3b03c33a736f',
    },
];

const currenciesInternacionalCode = [
    {
        value: 'Codigo Internacional',
        label: 'BQUIEC01',
    },
];

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));
export default function BankEntitySearch({ currencyId, currencyInternacionalCode, setCurrencyId, setCurrencyInternacionalCode }) {
    // ...


    const classes = useStyles();
    const handleChangeId = (event) => {
        setCurrencyId(event.target.value);
    };

    const handleChangeInternacionalCode = (event) => {
        setCurrencyInternacionalCode(event.target.value);
    };



    return (
        <form className={classes.root} noValidate autoComplete="off">
            <div>
                <TextField
                    id="standard-select-currency-id"
                    select
                    label="ID"
                    value={currencyId}
                    onChange={handleChangeId}
                    helperText="Buscar por ID"
                >
                    {currenciesId.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id="standard-select-currency-internacional-code"
                    select
                    label="Codigo Internacional"
                    value={currencyInternacionalCode}
                    onChange={handleChangeInternacionalCode}
                    SelectProps={{
                        native: true,
                    }}
                    helperText="Buscar por Codigo Internacional"
                >
                    {currenciesInternacionalCode.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>
            </div>
        </form>
    );
}
