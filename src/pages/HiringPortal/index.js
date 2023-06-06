import React, { useEffect, useRef, useState } from 'react';
import { styled, useTheme } from "@mui/styles";
import { Autocomplete, Checkbox, Divider, Grid, TextField, Typography, useMediaQuery, Button } from "@mui/material";
import HiringCard from "../../components/HiringCard/HiringCard";
// import { LANGUAGES } from "../../utils/constants/languages";
import { PROJECT_TYPES,JOB_TYPES, LANGUAGES, MAJORS, SKILLS } from "../../utils/constants/projects-types";
import SearchIcon from '@mui/icons-material/Search';
import { arraySubset } from "../../utils/helpers/arraySubset";
import './styles.scss';
import { AVAILABLE_FOR_HIRE, HIRED, HIRING_STATUS } from "../../utils/constants/hiring-status";
// import Fanar from "../../assets/partners/AlFanar.jpeg";
// import Drosos from "../../assets/partners/Drosos.png";
// import EU from "../../assets/partners/EU.png";
// import HopesLeb from "../../assets/partners/HopesLeb.png";
// import Life from "../../assets/partners/Life.jpeg";
// import Unicef from "../../assets/partners/Unicef.png";
// import Netherlands from '../../assets/partners/netherlands.png';
// import AbdelAziz from '../../assets/partners/abdelAziz.png';
// import Deloitte from '../../assets/partners/deloitte.png';
// import Generations from '../../assets/partners/generationOfInnovation.png';
import Partners from '../../assets/partners/SEF_sponsors apr 2023.png';
import { ReactComponent as ArrowDown } from '../../assets/common/Vector.svg'
import { Popover } from "react-tiny-popover";
import useResizeObserver from 'beautiful-react-hooks/useResizeObserver';
import { hooks } from "../../api";
import Loader from "../../components/Loader";
import SEButton from "../../components/SEButton";
import { SE_GREY } from "../../utils/constants/colors";
import { portalAccessed, searchLog } from "../../logger/analyticsTracking";
import { useAuth0 } from "@auth0/auth0-react";
import HiringCard2 from '../../components/HiringCard/HiringCard2';
import SwiperCore, { Virtual, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

SwiperCore.use([Virtual, Navigation, Pagination]);


export const CustomTextField = styled(TextField)({
    '& .MuiFilledInput-root': {
        borderRadius: '10px',
        background: 'white'
    },
    '& .MuiFilledInput-underline:before': {
        borderBottom: 'none !important',
    },
    '& .MuiFilledInput-underline:after': {
        borderBottom: 'none !important',
    },
});

const HiringPortal = () => {
    const { data: user, isLoading: isLoadingUser } = hooks.useCurrentUser();
    const [languages, setLanguages] = useState([]);
    const [projectTypes, setProjectTypes] = useState([]);
    const [ majors, setMajors ] = useState([]) ;
    const [ skills, setSkills ] = useState([]);

    const [hiringStatus, setHiringStatus] = useState('');
    const [prevLanguages, setPrevLanguages] = useState([])
    const [prevProjectTypes, setPrevProjectTypes] = useState([])
    const [prevFilterOpen, setPrevFilterOpen] = useState(false)
    const [filters, setFilters] = useState({})
    const [filterOpen, setFilterOpen] = useState(false)
    const [languageOptions, setLanguageOptions] = useState([])
    const { data: students, isLoading: isLoadingStudents } = hooks.useStudents()
    const { data: favorites, isLoading: isLoadingFavorites } = hooks.useFavorites()
    const [favoritesOnly, setFavoritesOnly] = useState(false);
    const [prevFavoritesOnly, setPrevFavoritesOnly] = useState(false);
    const [ cycles, setCycles ] = useState(false);
    const theme = useTheme()
    const [filterMounted, setFilterMounted] = useState(false)
    const filterRef = useRef(null)
    const filterSize = useResizeObserver(filterMounted && filterRef);
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));
    const isSM = useMediaQuery(theme.breakpoints.down('sm'));
    const [cards, setCards] = useState([])

    useEffect(() => {
        if (filterRef.current) {
            setFilterMounted(true)
        }
    })

    useEffect(() => {
        if (students) {
            const languageOptionsTemp = new Set()

            students.forEach(student => {
                student.attributes.programmingLanguages.forEach(e => {
                    if (e.language) {
                        languageOptionsTemp.add(e.language)
                    }
                }
                )
            })

            setLanguageOptions(Array.from(languageOptionsTemp).sort())
        }
    }, [students])

    useEffect(() => {
        if (students) {

            setCards(
                students.filter((proj) =>
                    prevLanguages.length !== 0 ? arraySubset(prevLanguages, proj.attributes.programmingLanguages.map(e => e.language)) : true
                )
                    .filter((proj) =>
                        prevProjectTypes.length !== 0 ? arraySubset(prevProjectTypes, proj.attributes.projectType.map(e => e.type)) : true
                    )
                    .filter((proj) => {
                        if (prevFavoritesOnly) {
                            const favoriteIds = favorites.map((e) => e?.attributes?.student?.data?.id)
                            return favoriteIds.includes(proj.id)
                        }
                        return true
                    }).sort((a, b) => { return a.attributes.name > b.attributes.name ? 1 : -1 })
            )
            searchLog({ user, prevLanguages, prevProjectTypes })
        }
    }, [students, prevLanguages, prevProjectTypes, prevFavoritesOnly, favorites])

    useEffect(() => {
        portalAccessed({ user })
    }, [])
    // useEffect(()=> {
    //
    //     setCards(projects.filter((proj) =>
    //             prevProjectTypes.length!==0?arraySubset(prevProjectTypes,proj.projectType):true
    //         ).filter((proj) =>
    //             prevLanguages.length!==0?arraySubset(prevLanguages,proj.languages):true
    //         ))
    //
    // },[prevLanguages,prevProjectTypes])

    useEffect(() => {
        // window.addEventListener(
        //     "scroll",
        //     () => setFilterOpen(false),
        //     { passive: true }
        // )
        // by me
    }, [])

    return (
        <div className={"hiring-portal-wrapper"}>
            <div className={"hiring-portal-container"}>
                <div className={"hiring-portal-cards-container"}>
                    {/* <Typography variant={"h3"} marginTop={4} fontWeight={600} fontSize={40}>
                        Hiring Portal
                    </Typography>
                    <Typography variant={"h5"} fontSize={33}>
                        Hire Our Qualified, Job-Ready Tech Grads from Lebanon
                    </Typography> */}
                    <div style={{display: ''}} className={"hiring-portal-intro-container"}>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={12} lg={12} ref={filterRef}>
                                <div>
                                    <div className={"hiring-portal-popover"} style={{ width: filterSize?.width }}>
                                        <Typography variant={'h5'} fontWeight={700} fontSize={20}>
                                            Search Candidates Here
                                        </Typography>
                                        <div style={{ display: 'flex', marginTop: '25px', flexWrap: 'wrap' }}>

                                            <div style={{ marginTop: '20px', width: !isSmall ? '50%' : '100%', flexBasis: !isSmall ? '50%' : '100%' }}>
                                                <Typography my={1} variant={"h5"} fontSize={"17px"}>
                                                    Job Type 
                                                </Typography>
                                                <Autocomplete
                                                    multiple
                                                    value={projectTypes}
                                                    onChange={(e, newValue) => {
                                                        setProjectTypes(newValue)
                                                    }}
                                                    options={JOB_TYPES}
                                                    onClick={e => { e.preventDefault(); setFilterOpen(true) }}
                                                    filterSelectedOptions
                                                    sx={{ zIndex: '10000000000' }}
                                                    renderInput={(params) => (
                                                        <CustomTextField
                                                            {...params}
                                                            id={"languages"}
                                                            variant={"filled"}
                                                            label="Choose Job Type Here"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div style={{ marginTop: '20px', width: !isSmall ? '50%' : '100%', flexBasis: !isSmall ? '50%' : '100%', padding: !isSmall ? '0 0 0 10px' : '5px 0' }}>
                                                <Typography my={1} variant={"h5"} fontSize={"17px"}>
                                                    Skills
                                                </Typography>
                                                <Autocomplete
                                                    multiple
                                                    value={skills}
                                                    onChange={(e, newValue) => {
                                                        setSkills(newValue)
                                                    }}
                                                    options={SKILLS}
                                                    filterSelectedOptions
                                                    sx={{ zIndex: '10000000000' }}
                                                    renderInput={(params) => (
                                                        <CustomTextField
                                                            {...params}
                                                            id={"languages"}
                                                            variant={"filled"}
                                                            sx={{backroundColor: 'white !important'}}
                                                            label="Choose Skills here"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div style={{ marginTop: '20px', width: !isSmall ? '50%' : '100%', flexBasis: !isSmall ? '50%' : '100%' }}>
                                                <Typography my={1} variant={"h5"} fontSize={"17px"}>
                                                    Major 
                                                </Typography>
                                                <Autocomplete
                                                    multiple
                                                    value={majors}
                                                    onChange={(e, newValue) => {
                                                        setMajors(newValue)
                                                    }}
                                                    options={MAJORS}
                                                    onClick={e => { e.preventDefault(); setFilterOpen(true) }}
                                                    filterSelectedOptions
                                                    sx={{ zIndex: '10000000000' }}
                                                    renderInput={(params) => (
                                                        <CustomTextField
                                                            {...params}
                                                            id={"languages"}
                                                            variant={"filled"}
                                                            label="Choose Major Here"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div style={{ marginTop: '20px', width: !isSmall ? '50%' : '100%', flexBasis: !isSmall ? '50%' : '100%', padding: !isSmall ? '0 0 0 10px' : '5px 0' }}>
                                                <Typography my={1} variant={"h5"} fontSize={"17px"}>
                                                    Language 
                                                </Typography>
                                                <Autocomplete
                                                    multiple
                                                    value={languages}
                                                    onChange={(e, newValue) => {
                                                        setLanguages(newValue)
                                                    }}
                                                    options={LANGUAGES}
                                                    filterSelectedOptions
                                                    sx={{ zIndex: '10000000000' }}
                                                    renderInput={(params) => (
                                                        <CustomTextField
                                                            {...params}
                                                            id={"languages"}
                                                            variant={"filled"}
                                                            sx={{backroundColor: 'white !important'}}
                                                            label="Choose language Proficiency here"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div style={{ marginTop: '20px', width: !isSmall ? '50%' : '100%', flexBasis: !isSmall ? '50%' : '100%', padding: '5px 0' }}>
                                                <div style={{ display: "flex",flexDirection:'column', marginTop: '10px' ,maxWidth: '170px' }}>
                                                <div style={{display: 'flex', alignItems:'center', justifyContent: "space-between"}}>
                                                        <Typography color='primary' my={1} mr={2} variant={"h5"} fontSize={"17px"}>
                                                            All Cycles
                                                        </Typography>
                                                        <Checkbox
                                                            checked={cycles}
                                                            onChange={(event) => setCycles(event.target.checked)}
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                        />
                                                    </div>
                                                    <div style={{display: 'flex', alignItems:'center', justifyContent: "space-between"}}>
                                                        <Typography color='primary' my={1} mr={2} variant={"h5"} fontSize={"17px"}>
                                                            Only Favorites
                                                        </Typography>
                                                        <Checkbox
                                                            checked={favoritesOnly}
                                                            onChange={(event) => setFavoritesOnly(event.target.checked)}
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                        />
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div style={{display: 'flex', alignItems:'center', justifyContent:'center', marginTop: '20px'}}>
                                            <Button
                                                color={"primary"}
                                                // fullWidth
                                                startIcon={<SearchIcon />}
                                                sx={{
                                                    height: '40px',
                                                    minWidth: '160px',
                                                    maxWidth: '300px',
                                                    width: '30%'
                                                }}
                                                variant='contained'
                                                onClick={() => {
                                                    setPrevProjectTypes(projectTypes)
                                                    setPrevLanguages(languages)
                                                    setFilterOpen(false)
                                                    setPrevFavoritesOnly(favoritesOnly)

                                                }
                                                }
                                            >
                                                Show Results
                                            </Button>
                                            {/*<Typography*/}
                                            {/*    onClick={() => {*/}
                                            {/*        setPrevProjectTypes(projectTypes)*/}
                                            {/*        setPrevLanguages(languages)*/}
                                            {/*        setFilterOpen(false)*/}
                                            {/*        setPrevFavoritesOnly(favoritesOnly)*/}

                                            {/*        }*/}
                                            {/*    }*/}
                                            {/*    variant={"h5"} fontSize={"15px"} style={{cursor:'pointer'}} fontWeight={700} marginTop={4}>*/}
                                            {/*    Show Results*/}
                                            {/*</Typography>*/}
                                        </div>
                                    </div>
                                </div>
                                    
                                
                                {/* <div className={"hiring-portal-upper-section-filter"} onClick={() => {
                                    setFilterOpen(true)
                                }}>
                                    <div style={{
                                        display: 'flex', 'margin': 'auto 0px',
                                        placeContent: 'space-between',
                                        'width': '100%'
                                    }}>

                                        <Typography
                                            variant={"body2"}
                                            textAlign={isSmall ? "center" : "start"}
                                            fontSize={18}
                                            fontWeight={"bold"}
                                            style={{ color: '#888888' }}
                                        >
                                            Filter By
                                        </Typography>
                                        <div style={{ display: 'flex', margin: 'auto 0' }}>
                                            <ArrowDown />
                                        </div> */}
                                        {/*<Typography*/}
                                        {/*    variant={"body2"}*/}
                                        {/*    textAlign={isSmall? "center":"start"}*/}
                                        {/*    fontSize={14}*/}
                                        {/*    sx={{color:'#888888',cursor:'pointer'}}*/}
                                        {/*    onClick={() => {*/}
                                        {/*        setLanguages([])*/}
                                        {/*        setProjectTypes([])*/}
                                        {/*        setHiringStatus('')*/}
                                        {/*    }}*/}
                                        {/*>*/}
                                        {/*    Reset All*/}
                                        {/*</Typography>*/}
                                    {/* </div>

                                </div> */}
                            </Grid>
                        </Grid>
                    </div>
                    <Grid container spacing={isSM ? 0 : isSmall ? 2 : 5} marginBottom={3}>
                        {
                            isLoadingFavorites || isLoadingStudents ?
                                <Loader SELogo />
                                :
                                <>
                                    <Grid item xs={12} my={2}>

                                        {/* <Typography variant={"h5"} fontSize={"18px"}>
                                            Can't find what you're looking for? Some students might have in-depth knowledge in specific technologies and didn't use them in the final project.
                                            <span style={{ fontWeight: '700' }}> Please reach out!  <a href="mailto: hire@sefactory.io" style={{ color: `unset` }}>hire@sefactory.io</a></span>
                                        </Typography> */}

                                    </Grid>
                                    {
                                        // cards?.length > 0 ?
                                        cards.map((props, index) => (
                                            <Grid style={{
                                                marginTop: isSmall && '10px', marginBottom: isSmall && '10px'

                                            }} key={`card-${index}`} item xs={12} sm={12} md={6} lg={4} mt={2}>
                                                {/* <HiringCard {...props} /> */}
                                                <HiringCard2 {...props} item xs={12} sm={12} md={12} lg={12} mt={2} />
                                            </Grid>
                                        )
                                        )
                                        // :
                                        // <>
                                        //     <Grid item xs={12} my={2}>
                                        //
                                        //         <Typography variant={"h5"} fontSize={"18px"}>
                                        //             Can't find what you're looking for? Some students might have in-depth knowledge in specific technologies and didn't use them in the final project.
                                        //             <span style={{fontWeight:'700'}}> Please reach out!  <a href="mailto: hire@sefactory.io" style={{color:`unset`}}>hire@sefactory.io</a></span>
                                        //         </Typography>
                                        //
                                        //     </Grid>
                                        //     {
                                        //         students?.map((props,index) => (
                                        //             <Grid style={{
                                        //                 marginTop: isSmall && '10px', marginBottom: isSmall && '10px'
                                        //
                                        //             }} key={`card-${index}`} item xs={12} sm={6} md={6} lg={4} mt={2}>
                                        //                 <HiringCard {...props} />
                                        //             </Grid>
                                        //         ))
                                        //     }
                                        // </>

                                    }</>
                        }

                    </Grid>
                </div>
                <Grid container className='hiring-grid' spacing={2} mt={12} mb={7}>
                    <Grid item xs={12}>
                        <Typography color='primary' variant={isSmall ? "h6" : "h4"} sx={{ fontWeight:'bold'}} textAlign={"center"}>
                            Trusted by some of the leading global agencies
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {/* <Typography variant={isSmall ? "body1" : "h6"} textAlign={"center"}>
                            SE Factory partners have been critical to the success, growth, and expansion of our programs.
                        </Typography> */}
                    </Grid>
                    <Grid item xs={12}>
                        <Divider mb={-2} style={{ height: '2px' }} />
                    </Grid>
                    {/* <Grid item xs={12} sm={12} md={5} lg={5}>
                        <div style={{
                            display: 'flex',
                            height: '100%'
                        }}>
                            <img className='partners-picture' style={{
                                width: "250%",
                                margin: 'auto',
                                mixBlendMode: 'multiply'
                            }} src={Partners} alt={'partners'} />
                        </div>
                    </Grid> */}

                    <Swiper 
                        spaceBetween={50}
                        slidesPerView={isSmall ? 3 : 6}
                        // pagination={{ clickable: true }}
                        autoplay={{ delay: 1500, disableOnInteraction: false }}
                        // loop={true}
                        style={{width:'100%'}}

                    >
                        <SwiperSlide>
                            <img className='partners-picture' src='	https://nawaya.org/wp-content/uploads/2021/12/0001-600x369.jpg' alt={'partners'} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img className='partners-picture' src='https://nawaya.org/wp-content/uploads/2021/12/logo-f.png' alt={'partners'} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img className='partners-picture' src='https://nawaya.org/wp-content/uploads/2022/01/web-GlobalGiving-Logo-400x400.jpg' alt={'partners'} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img className='partners-picture' src='	https://nawaya.org/wp-content/uploads/2022/02/The-Netherlands.jpg' alt={'partners'} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img className='partners-picture' src='	https://nawaya.org/wp-content/uploads/2022/02/partner-10.jpg' alt={'partners'} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img className='partners-picture' src='	https://nawaya.org/wp-content/uploads/2022/02/eu-300x266-1.png' alt={'partners'} />
                        </SwiperSlide>

                        <SwiperSlide>
                            <img className='partners-picture' src='https://nawaya.org/wp-content/uploads/2022/01/web-partner-22-750x465.jpg' alt={'partners'} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img className='partners-picture' src='	https://nawaya.org/wp-content/uploads/2022/01/web-GlobalFundforChildren-750x465.jpg' alt={'partners'} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img className='partners-picture' src='https://nawaya.org/wp-content/uploads/2022/01/web-gizlogo-unternehmen-de-sw-300.jpg' alt={'partners'} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img className='partners-picture' src='https://nawaya.org/wp-content/uploads/2022/02/web-al-gurair-750x465.jpg' alt={'partners'} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img className='partners-picture' src='https://nawaya.org/wp-content/uploads/2022/02/alfanar-logo-print.jpg' alt={'partners'} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img className='partners-picture' src='https://nawaya.org/wp-content/uploads/2022/02/partner-4.jpg' alt={'partners'} />
                        </SwiperSlide>
                        {/*  */}
                    </Swiper>
                    {/* <Grid item xs={12} sm={12} md={5} lg={5}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }} src={Fanar} alt={'fanar'} />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:isSmall? "45%":"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }}  src={EU} alt={'eu'} />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5} lg={5}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }}  src={Life} alt={'life'} />
                        </div>
                    </Grid>
                    <Grid item md={1} lg={1}/>
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }}  src={Drosos} alt={'droso'} />
                        </div>
                    </Grid>
                    <Grid item md={1} lg={1}/>
                    <Grid item xs={12} sm={12} md={3} lg={3} >
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }}  src={Unicef} alt={'unicef'} />
                        </div>
                    </Grid>
                    <Grid item md={1} lg={1}/>
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }}  src={HopesLeb} alt={'hopes'} />
                        </div>
                    </Grid>
                    <Grid item md={1} lg={1}/>

                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }}  src={AbdelAziz} alt={'hopes'} />
                        </div>
                    </Grid>
                    <Grid item md={1} lg={1}/>

                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply',
                                
                            }}  src={Generations} alt={'hopes'} />
                        </div>
                    </Grid>
                    <Grid item md={1} lg={1}/>

                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }}  src={Deloitte} alt={'hopes'} />
                        </div>
                    </Grid>
                    <Grid item md={1} lg={1}/>

                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }}  src={Netherlands} alt={'hopes'} />
                        </div>
                    </Grid> */}
                </Grid>
            </div>
        </div>
    );
};

export default HiringPortal;