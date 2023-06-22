import React from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    useMediaQuery,
    useTheme,
    Button
} from "@mui/material";
import './styles.scss';
import { useAuth0 } from "@auth0/auth0-react";
import Cookies from 'js-cookie';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
    const isLoggedIn = Cookies.get('se-token');
    const { logout } = useAuth0();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    return (
    <Box>
        <AppBar style={{ position: 'relative', height: '100vh', backgroundPosition: 'top' }} position="static" className="header">
            <div className='xs-overlay' />
            <Toolbar sx={{
                display: 'flex',
                justifyContent: "center",
                alignItems: 'center',
                padding: '0px 10vh !important',
                width: '100%',
                backgroundColor: 'transparent',
            }}>
                <div className='toolbar-elements'>
                    <a href="https://hiring-portal-blue.vercel.app/">
                        <img
                            className={"logo"}
                            src={require("../../assets/core/nawaya-full.png")}
                            height={70}
                            width={188}
                            alt="naway network"
                            style={{ pointerEvents: "all", cursor: 'pointer' }}
                        />
                    </a>
                    {Boolean(isLoggedIn) && (<Button 
                        size={isSmall ? 'small' : 'medium'} 
                        sx={{borderWidth: '2px !important'}} 
                        variant='outlined' 
                        startIcon={<LogoutIcon />}
                        onClick={() => {
                            Cookies.remove('se-token');
                            logout();
                        }}
                    >
                        Logout
                    </Button>
                    )}
                </div>
            </Toolbar>
            <div className='header-center'>
                <h1>Unlock Your Talent Potential</h1>
                <p>Discover Your Perfect Match Through our Hiring Portal</p>
            </div>
        </AppBar>
    </Box>

    )
};

export default Navbar;
