import React, { useState } from 'react';
import {
    AppBar,
    Box, Grid,
    List,
    ListItem,
    ListItemText,
    SwipeableDrawer,
    Toolbar, Typography,
    useMediaQuery,
    useTheme,
    Button
} from "@mui/material";
import Logo from '../../assets/core/SEF_logo_text.svg';
import MenuIcon from '@mui/icons-material/Menu';
import './styles.scss';
import SEButton from "../SEButton";
import { useAuth0 } from "@auth0/auth0-react";
import Cookies from 'js-cookie';
import { queryClient } from "../../api";
import { CURRENT_USER_KEY } from "../../api/config/keys";
import { useHistory } from "react-router-dom";
import { useGodMode } from "../../context/godMode";
import LogoutIcon from '@mui/icons-material/Logout';
const Navbar = () => {

    const isLoggedIn = Cookies.get('se-token');
    const { logout } = useAuth0();
    const { isGod, handlePreRelease, preRelease } = useGodMode()
    const [open, setOpen] = useState(false);
    const { push } = useHistory()
    const theme = useTheme();


    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    const toggleDrawer = (openE) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setOpen(openE)
    };
    return (
    <Box>
        <AppBar style={{ position: 'relative', height: '500px' }} position="static" className="header">
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
                    {/* {Boolean(isLoggedIn) && (
                        <SEButton
                            variant={"contained"}
                            sx={{ backgroundColor: "#FB4747", color: "#FCFCFD" }}
                            onClick={() => {
                                Cookies.remove('se-token');
                                logout();
                            }}
                        >
                            Logout
                        </SEButton>
                        
                    )} */}
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
                    {/* <Button size='medium' sx={{fontWeight: 'light'}} variant='text' startIcon={<LogoutIcon />}>
                        Logout
                    </Button> */}
                </div>
                {/* {isGod && (
                    <SEButton
                        onClick={handlePreRelease}
                        variant={"outlined"}
                        color={"secondary"}
                        style={{ marginRight: 10 }}

                    >
                        {!preRelease ? 'UnRelease' : 'Release'}
                    </SEButton>
                )} */}
            </Toolbar>
            <div className='header-center '>
                <h1>Unlock Your Talent Potential</h1>
                <p>Discover Your Perfect Match through our Hiring Portal</p>
            </div>
        </AppBar>
    </Box>

    )
};

export default Navbar;
