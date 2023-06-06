import React from 'react';
import './styles.scss';
import { Grid, Typography } from "@mui/material";
import { SE_GREEN } from "../../utils/constants/colors";
// import LinkedInIcon from '@mui/icons-material/LinkedIn';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import TwitterIcon from '@mui/icons-material/Twitter';
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
                        <a href="mailto: hire@sefactory.io" style={{ color: `unset` }}>hire@nawaya.io</a>
                    </Typography>
                </div>
                
            </div>
        </div>
    );
};

export default Footer;