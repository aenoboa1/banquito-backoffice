// getAccountHolderTypeLabel.js

export const getAccountHolderTypeLabel = (accountHolderTypeValue) => {
    const accountHolderTypeMapping = {
        CUS: 'Cliente Natural',
        GRO: 'Compañía',
    };

    return accountHolderTypeMapping[accountHolderTypeValue] || 'Desconocido'; // Default to 'Desconocido' if accountHolderTypeValue is not found
};
