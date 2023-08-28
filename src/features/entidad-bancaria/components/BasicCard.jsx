import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BranchForm from "../../gestion-sucursales/components/BranchForm";
import BranchesList from "../../gestion-sucursales/components/BranchesList";
import BankEntityList from "./BankEntityList";

const bull = (
	<Box
		component="span"
		sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
	>
		•
	</Box>
);

export default function BasicCard() {
	return (
		<Card>
			<CardContent>
				<Typography variant="h5" gutterBottom>
					Entidad Bancaria
				</Typography>
				<BankEntityList></BankEntityList>
			</CardContent>
		</Card>
	);
}
