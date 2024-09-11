import State from './indian_state';

const formattedState = State.map((country) => ({
    value: country.code,
    label: country.name
}));

const useCountries = () => {
    const getAll = () => formattedState;

    const getByValue = (value: string) => {
        return formattedState.find((item) => item.value === value);
    }

    return {
        getAll,
        getByValue
    }
}

export default useCountries;