import React, { useState } from 'react';
import { Card, CardContent, Button, Box, Typography } from '@mui/material';
import BranchForm from './BranchForm';
//import HolidayGenerate from './HolidayGenerate'
import BranchesList from './BranchesList'
import BranchUpdate from "./BranchUpdate";


export default function BasicCard() {
	const [isModalOpenForm, setIsModalOpenForm ] = useState(false);
	const [isModalOpenGenerate, setIsModalOpenGenerate] = useState(false);

	const handleOpenModalForm = () => {
		setIsModalOpenForm(true);
	};

	const handleCloseModalForm = () => {
		setIsModalOpenForm(false);
	};

	const handleSubmitForm = (values) => {
		// Lógica para enviar el formulario
		console.log(values);
		handleCloseModalForm();
	};

	const handleOpenModalGenerate = () => {
		setIsModalOpenGenerate(true);
	};

	const handleCloseModalGenerate = () => {
		setIsModalOpenGenerate(false);
	};

	const handleSubmitGenerate = (values) => {
		// Lógica para enviar el formulario
		console.log(values);
		handleCloseModalGenerate();
	};

	return (
		<Card>
			<CardContent>
				<Typography variant="h5" gutterBottom>
					Gestión de Sucursales
				</Typography>
				<Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
					<Button onClick={handleOpenModalForm} variant="contained" color="primary" style={{ color: 'white' }}>
						Agregar Sucursal
					</Button>
				</Box>
				
				<BranchForm isOpen={isModalOpenForm} onClose={handleCloseModalForm} onSubmit={handleSubmitForm} />
				<BranchesList></BranchesList>
			</CardContent>
		</Card>
	);
}
