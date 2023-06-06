import React from 'react';
import {CircularProgress} from "@mui/material";
import './styles.scss';
import LogoImage from '../../assets/core/image1.png';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';

const Loader = ({SELogo = false, height = 'calc(100vh - 74px)'}) => {
    return (
        <div style={{height, width: '100%', display: 'flex', placeContent: "center", placeItems: 'center'}}>
            {
                SELogo ?

                    <div className="loading-overlay">
                        <Stack sx={{ width: '100%'  }} spacing={2} direction='column' alignItems='center' justifyContent='center'>
                            <img src={LogoImage} alt='nawaya logo' />
                            <LinearProgress sx={{minWidth:'200px'}} color='primary' />
                        </Stack>
                    </div>
                    :

                    <CircularProgress sx={{margin: 'auto'}}/>
            }
        </div>
    );
};

export default Loader;