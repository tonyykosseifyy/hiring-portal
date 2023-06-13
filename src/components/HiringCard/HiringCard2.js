import React, { useEffect } from 'react'
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
import { LanguageSharp } from '@mui/icons-material';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import { createFavorite, deleteFavorite } from '../../context/axios/herlper';
import { useCallback } from 'react';

// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';


SwiperCore.use([Virtual, Navigation, Pagination]);

// function that takes an array of majors and returns a string of majors seperated by "-" if the array has more than one element
const displayContent = (content, type, field) => {
  if (content.length === 0) {
    return `No ${type}`
  } else if (content.length === 1) {
    return content[0]?.[field]
  } else {
    let contentString = ""
    for (let i = 0; i < content.length; i++) {
      if (i === content.length - 1) {
        contentString += content[i]?.[field]
      } else {
        contentString += content[i]?.[field] + " - "
      }
    }
    return contentString
  }
} ;

const includesFavorite = ( favorite_users, currentUser ) => {
  for (let i = 0; i < favorite_users?.length; i++) {
    if (favorite_users[i]?.id === currentUser?.id) {
      return true
    }
  }
  return false
};


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


const useStyles = makeStyles({
  available: {
    marginLeft: '-5px',
    marginTop: '15px'
  },
});
  

function HiringCard2({ favorite_users, currentUser, id, languages, description, gender, full_name, job_types, majors, skills,Available, linkedin, cv, interview }) {
  const classes = useStyles();
  const [ isFavorite, setIsFavorite ] = useState(false);
  const [swiperRef, setSwiperRef] = useState(null);
  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.down('md')) ;
  const isSmall = useMediaQuery(theme.breakpoints.down('sm')) ;
  
  const toggleIsFavorite = useCallback(() => {
    if (isFavorite) {
      deleteFavorite(id);
    } else {
      createFavorite(id);
    }
    setIsFavorite((prev) => !prev);
  },[isFavorite, id])

  useEffect(() => {
    setIsFavorite(includesFavorite(favorite_users, currentUser));
  },[favorite_users, currentUser])
  
  return (
    <div className={`hiring-container card ${Available ? '' : 'hiring-container-blurred'}`}>
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
          {Available ? <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar sx={{width: 50, height: 50}} alt={full_name} src={gender === 'Male' ? ManImage:WomanImage} />
            </StyledBadge> 
            :   
            <Avatar sx={{width: 50, height: 50}} alt={full_name} src={gender === 'Male' ? ManImage:WomanImage} />

          }

            <Stack ml={2} direction='column'>
              <Typography sx={{lineHeight:1.3}} variant='h6' color='primary' >
                  {full_name}
              </Typography>
              <Typography sx={{lineHeight:1.3}} variant='caption' >
                {displayContent(job_types, 'Job Types', 'job_type')}
              </Typography>
              <Typography sx={{lineHeight:1.3}} variant='caption' color='secondary'>
                {displayContent(majors, 'Majors', 'major')}
              </Typography>
            </Stack>

        </Stack>
        <IconButton onClick={() => toggleIsFavorite()} color='primary' size='small'>
          { isFavorite ? <FavoriteIcon color='primary' fontSize='small' /> : <FavoriteBorderIcon color='primary' fontSize='small' /> }
        </IconButton>
      </Stack>

      <Chip
        icon={Available ? <BoltIcon  fontSize='small' />: <DoNotDisturbAltIcon fontSize='small' />}
        label={Available ? "Available for hire":"Not available"}
        variant="outlined"
        color='primary'
        size='small'
        className={classes.available}
        sx={{ transform: 'scale(0.85)'}}
      />

      <Typography sx={{ height: '50px' }} mt={4} variant="body2">
        {description}
      </Typography>

      <Typography mt={2} color='primary' sx={{ fontWeight:'bold' }}>
        Languages
      </Typography>
			<Divider />
      <Stack mt={2} direction='row' spacing={1}>
        { languages?.map((language, index) => (
          <Chip key={language?.language} label={language?.language} size='small' />
        ))}

      </Stack>

      <Typography mt={3} color='primary' sx={{ fontWeight:'bold' }}>
        Skills
      </Typography>
			<Divider />
      <Stack mt={2} direction='row' spacing={1}>
        <Swiper
          onSwiper={setSwiperRef}
          slidesPerView={isMedium ? isSmall  ? 2 : 5 : 3}
          spaceBetween={2}
          navigation={true}
          virtual
        >
          {skills?.map((skill, index) => (
            <SwiperSlide className='hiring-slide' key={skill?.skill} virtualIndex={index}>
              <Chip label={skill?.skill} variant='filled' size='small' />
            </SwiperSlide>
          ))}
        </Swiper>
      </Stack>
      
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