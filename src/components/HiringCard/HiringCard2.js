import React from 'react'
import { Grid, Avatar, Stack, Badge, Typography, IconButton, Chip, Divider, Button, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import './styles2.scss';
import WomanImage from "../../assets/core/woman.png";
import ManImage from "../../assets/core/man.png";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';
import BoltIcon from '@mui/icons-material/Bolt';
import { makeStyles } from '@mui/styles';
import SwiperCore, { Virtual, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { BsLinkedin } from 'react-icons/bs';
import { GrDocumentText } from 'react-icons/gr';
import { FaPeopleArrows } from 'react-icons/fa';
import { blue } from '@mui/material/colors';
import { HiDocument } from 'react-icons/hi';
import Zoom from '@mui/material/Zoom';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { useTheme } from '@emotion/react';

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';


SwiperCore.use([Virtual, Navigation, Pagination]);


const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '& div': {
        width: 30,
        height: 30 
      },
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
}));

const LinkedInButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blue[500]),
  backgroundColor: blue[500],
  '&:hover': {
    backgroundColor: blue[500],
  },
}));


const useStyles = makeStyles({
  available: {
    marginLeft: '-5px',
    marginTop: '15px'
  },
});
  

function HiringCard2() {
  const classes = useStyles();
  const [ isFavorite, setIsFavorite ] = useState(false);
  const [swiperRef, setSwiperRef] = useState(null);
  const [slides, setSlides] = useState(
    Array.from({ length: 20 }).map((_, index) => `Skill ${index + 1}`)
  );
  const theme = useTheme();

  const isMedium = useMediaQuery(theme.breakpoints.down('md')) ;
  const isSmall = useMediaQuery(theme.breakpoints.down('sm')) ;

  return (
    <div className='hiring-container card'>
      {/* <div class="multi-button">
        <LightTooltip  TransitionComponent={Zoom} placement="top" title="View LinkedIn" arrow>
          <button class="fas fa-heart">

            <BsLinkedin color="white" />
          </button>
        </LightTooltip>
        <LightTooltip TransitionComponent={Zoom}  placement="top" title="View CV" arrow>
          <button class="fas fa-heart">
            <HiDocument color="white" />
          </button>
        </LightTooltip>
        <LightTooltip TransitionComponent={Zoom}  placement="top" title="Book Interview" arrow>
          <button class="fas fa-heart">
            <FaPeopleArrows color="white" />
          </button>
        </LightTooltip>


      </div>
      <div class="container"></div> */}
      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Stack direction='row' alignItems='center'>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar sx={{width: 50, height: 50}} alt="Remy Sharp" src={ManImage} />
            </StyledBadge>

            <Stack ml={2} direction='column'>
              <Typography sx={{lineHeight:1.3}} variant='h6' color='primary' >
                  Remy Sharp
              </Typography>
              <Typography sx={{lineHeight:1.3}} variant='caption' >
                Web Developer
              </Typography>
              <Typography sx={{lineHeight:1.3}} variant='caption' color='secondary'>
                Computer Science
              </Typography>
            </Stack>

        </Stack>
        <IconButton onClick={() => setIsFavorite((prev) => !prev)} color='primary' size='small'>
          { isFavorite ? <FavoriteIcon color='primary' fontSize='small' /> : <FavoriteBorderIcon color='primary' fontSize='small' /> }
        </IconButton>
      </Stack>

      <Chip
        icon={<BoltIcon  fontSize='small' />}
        label="Available for hire"
        variant="outlined"
        color='primary'
        size='small'
        className={classes.available}
        sx={{ transform: 'scale(0.85)'}}
      />

      <Typography mt={4} variant="body2">
        I am a passionate, full-stack developer, UI/UX designer, & SEO specialist. I have experience working with large corporations down to small businesses.
      </Typography>

      <Typography mt={2} color='primary' sx={{ fontWeight:'bold' }}>
        Languages
      </Typography>
			<Divider />
      <Stack mt={2} direction='row' spacing={1}>
        <Chip label="English" size='small' />
        <Chip label="Frensh" size='small' />
        <Chip label="Arabic" size='small' />
      </Stack>

      <Typography mt={3} color='primary' sx={{ fontWeight:'bold' }}>
        Skills
      </Typography>
			<Divider />
      <Stack mt={2} direction='row' spacing={1}>
        <Swiper
          onSwiper={setSwiperRef}
          slidesPerView={isMedium ? isSmall  ? 3 : 6 : 5}
          spaceBetween={2}
          navigation={true}
          virtual
        >
          {slides.map((slideContent, index) => (
            <SwiperSlide className='hiring-slide' key={slideContent} virtualIndex={index}>
              <Chip label={slideContent} variant='filled' size='small' />
            </SwiperSlide>
          ))}
        </Swiper>
      </Stack>
      {/* <LinkedInButton startIcon={<BsLinkedin color="white" />} variant='outlined'>
            View LinkedIn
          </LinkedInButton>
      <Stack mt={4} direction='row' justifyContent='flex-end'>
        <Stack direction='row'>
          
          <Button startIcon={<GrDocumentText />} variant='outlined' color='secondary'>
            View Resume
          </Button>
          <Button startIcon={<FaPeopleArrows />} variant='contained' color='primary'>
            Book Interview
          </Button>
        </Stack>
      </Stack> */}
      
      <Stack mt={4} direction='row' alignItems='center' justifyContent='center'>
        <Button sx={{fontSize:'10px'}} startIcon={<FaPeopleArrows color='#643A7A' />} variant='outlined' fullWidth>Book interview</Button>
      </Stack>

      <Stack mt={2} direction={isSmall ? 'column': 'row'} alignItems='center' justifyContent='space-between'>
        <Button fullWidth sx={{fontSize:'10px'}} startIcon={<BsLinkedin color='white' />}  variant='contained' color='primary'> 
          View LinkedIn 
        </Button>
        <Button fullWidth sx={{ fontSize:'10px', marginLeft: isSmall ? '0':'10px', marginTop: isSmall ? '10px': '0' }} startIcon={<HiDocument color='white' />} variant='contained' >View Resume</Button>
      </Stack>
      
    </div>
  )
}

  

export default HiringCard2; 