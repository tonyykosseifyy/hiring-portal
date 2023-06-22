import React from 'react';
import './styles.scss';
import { Typography } from "@mui/material";
import NawayaLogo from "../../assets/core/image1.png";


const Footer = () => {
    return (
        <div className={"footer-wrapper"}>
            <div className={"footer-container"}>
                <div className='footer-logo'>
                    <img src={NawayaLogo} alt='nawaya logo' />
                </div>                        
                
                <div>
                    <Typography variant={"h5"} sx={{ color: "#FCFCFD" }}>
                        Reach out to Hire
                    </Typography>
                    <Typography variant={"body1"} color='secondary'>
                        <a href="mailto:hire@nawaya.org" style={{ color: `unset` }}>hire@nawaya.org</a>
                    </Typography>
                </div>
                
            </div>
        </div>
    );
};

export default Footer;