import React from 'react';
import { Button } from "@mui/material";
import './styles.scss';

const CustomButton = ({ children, ...props }) => {
    return (
        <Button sx={{
            color: "#363738"
        }}
            style={{ borderRadius: '0px !important' }}
            {...props}>
            {children}
        </Button>
    );
};

export default CustomButton;