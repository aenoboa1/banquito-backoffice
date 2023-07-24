import React, { useState } from 'react';
import BranchUpdate from './BranchUpdate';
import { createAPIEndpoint, ENDPOINTS } from './api';

const BranchUpdatePage = () => {
    const [error, setError] = useState(null);
    const uniqueKey = 'c81b6e7a-9a9f-4d2e-8a51-7fdca2ef1f29';

    const handleFormSubmit = (updatedBranch) => {
        createAPIEndpoint(ENDPOINTS.bankEntity)
            .putBranchUpdate(uniqueKey, updatedBranch, 'TU_TOKEN')
            .then((response) => {
                // La sucursal ha sido actualizada exitosamente
                console.log('Sucursal actualizada:', response.data);
            })
            .catch((error) => {
                // Error al actualizar la sucursal
                setError('Error al actualizar la sucursal');
            });
    };

    return (
        <div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <BranchUpdate onSubmit={handleFormSubmit} />
        </div>
    );
};

export default BranchUpdatePage;
