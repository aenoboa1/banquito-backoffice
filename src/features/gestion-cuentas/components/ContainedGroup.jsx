import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {ButtonBase, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import client2 from "assets/images/clients-vector-7404827.jpg";
import empresas from "assets/images/business_scale.png";
import SoftTypography from "../../../components/SoftTypography";
import Grid from "@mui/material/Grid";

const images = [{
    url: client2,
    title: 'Clientes Naturales',
    width: '40%',
},
    {
        url: empresas,
        title: 'Empresas',
        width: '30%',
    }

];

const ImageButton = styled(ButtonBase)(({theme}) => ({
    position: 'relative', height: 300, [theme.breakpoints.down('sm')]: {
        width: '100% !important', // Overrides inline-style
        height: 100,
    }, '&:hover, &.Mui-focusVisible': {
        zIndex: 1, '& .MuiImageBackdrop-root': {
            opacity: 0.15,
        }, '& .MuiImageMarked-root': {
            opacity: 0,
        }, '& .MuiTypography-root': {
            border: '4px solid currentColor',
        },
    },
}));

const ImageSrc = styled('span')({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
});

const Image = styled('span')(({theme}) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({theme}) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({theme}) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
}));
export const ContainedGroup = () => {
    return (
        <>
            <SoftTypography
                fontWeight={"bold"}
                variant="h4"
            >
                ¿A quién va dirigida la cuenta ?
            </SoftTypography>
            <Grid
                container
                spacing={0}
                direction="column"
                sx={{minHeight: '100vh'}}
            >
                <Container>
                    <Box sx={{
                        display: 'grid',
                        gap: 1,
                        gridTemplateColumns: 'repeat(2, 1fr)'
                    }}>
                        {images.map((image) => {
                            // Check if the image title contains "Clientes Naturales"
                            const containsClientesNaturales = image.title.includes("Clientes Naturales");
                            // Check if the image title contains "empresas"
                            const containsEmpresas = image.title.includes("Empresas");
                            // Define the new href based on the conditions
                            let newHref = image.title;
                            if (containsClientesNaturales) {
                                newHref = "/cuentas/cliente";
                            } else if (containsEmpresas) {
                                newHref = "/cuentas/compania";
                            }
                            return (
                                <ImageButton
                                    focusRipple
                                    key={image.title}
                                    href={newHref}
                                >
                                    <ImageSrc style={{backgroundImage: `url(${image.url})`}}/>
                                    <ImageBackdrop className="MuiImageBackdrop-root"/>
                                    <Image>
                                        <Typography
                                            component="span"
                                            variant="subtitle1"
                                            color="inherit"
                                            sx={{
                                                position: 'relative',
                                                p: 4,
                                                pt: 2,
                                                pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                                            }}
                                        >
                                            {image.title}
                                            <ImageMarked className="MuiImageMarked-root"/>
                                        </Typography>
                                    </Image>
                                </ImageButton>
                            );
                        })
                        }
                    </Box>
                </Container>
            </Grid>
        </>
    )
}