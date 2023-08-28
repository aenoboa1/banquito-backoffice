// HELPER FUNCTION TO MAP STATE
export const getStateLabel = (stateValue) => {
    const stateTypes = [
        { label: 'Activo', value: 'ACT' },
        { label: 'Inactivo', value: 'INA' },
        { label: 'Suspendido', value: 'SUS' }
    ];

    const stateType = stateTypes.find(type => type.value === stateValue);
    return stateType ? stateType.label : 'Desconocido'; // Default to 'Desconocido' if stateValue is not found
};
