import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { styled, useTheme } from "@mui/styles";
import {
  Stack,
  Autocomplete,
  Checkbox,
  Divider,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  Button,
} from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import "./styles.scss";
import useResizeObserver from "beautiful-react-hooks/useResizeObserver";
import Loader from "../../components/Loader";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import HiringCard2 from "../../components/HiringCard/HiringCard";
import SwiperCore, { Virtual, Navigation, Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import { useAxios } from "../../context/axios";
import { useAuth0 } from "@auth0/auth0-react";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { YearCalendar } from "@mui/x-date-pickers/YearCalendar";
import Cookies from 'js-cookie';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

SwiperCore.use([Virtual, Navigation, Pagination, Autoplay]);


export const CustomTextField = styled(TextField)({
  "& .MuiFilledInput-root": {
    borderRadius: "10px",
    background: "white",
  },
  "& .MuiFilledInput-underline:before": {
    borderBottom: "none !important",
  },
  "& .MuiFilledInput-underline:after": {
    borderBottom: "none !important",
  },
});

const HiringPortal = () => {
  const { axios, Api } = useAxios();
  const { logout } = useAuth0();
  

  const [filterData, setFilterData] = useState({
    languages: [],
    jobTypes: [],
    majors: [],
    skills: [],
  });

  const [languages, setLanguages] = useState([]);
  const [jobTypes, setJobsTypes] = useState([]);
  const [majors, setMajors] = useState([]);
  const [skills, setSkills] = useState([]);
  const [students, setStudents] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const [currentUser, setCurrentUser] = useState({});
  const [cycleDate, setCycleDate] = useState(dayjs());
  const [closed, setClosed] = useState(true);
  const [ available, setAvailable ] = useState(false);
  const [ recruited, setRecruited ] = useState(false);

	const [ openSnackar, setOpenSnackbar ] = useState(false);
  

  const [isLoading, setIsLoading] = useState(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [cycles, setCycles] = useState(false);
  const theme = useTheme();
  const [filterMounted, setFilterMounted] = useState(false);
  const filterRef = useRef(null);
  const filterSize = useResizeObserver(filterMounted && filterRef);
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isSM = useMediaQuery(theme.breakpoints.down("sm"));


  // useEffect(() => {
  //   const buttons = document.querySelectorAll('.MuiPickersYear-yearButton');
  //   buttons.forEach((button) => {
  //     const buttonText = button.textContent;
  //     button.textContent = buttonText.slice(2); // Remove first and second characters
  //   });
  // }, []);

  const clearFilters = useCallback(() => {
    setLanguages([]);
    setJobsTypes([]);
    setMajors([]);
    setSkills([]);
    setFavoritesOnly(false);
    setCycleDate(dayjs());
    setClosed(true);
    setCycles(false);
    setAvailable(false);
    setRecruited(false);
  }, []);
  const noFiltersSelected = useMemo(() => {
    return (
      languages.length === 0 &&
      jobTypes.length === 0 &&
      majors.length === 0 &&
      skills.length === 0 &&
      !favoritesOnly &&
      !cycles &&
      !available && 
      !recruited
    );
  }, [languages, jobTypes, majors, skills, favoritesOnly, cycles, available, recruited]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      Api.getSkills(),
      Api.getLanguages(),
      Api.getJobTypes(),
      Api.getMajors(),
      Api.getInitialStudent(),
      Api.getCurrentUser(),
    ])
      .then((responses) => {
        // Handle the responses
        const response1 = responses[0]?.data;
        const response2 = responses[1]?.data;
        const response3 = responses[2]?.data;
        const response4 = responses[3]?.data;
        const response5 = responses[4]?.data;
        const response6 = responses[5]?.data;
        setStudents(response5);
        setCurrentUser(response6);
        setFilterData({
          languages: response2,
          jobTypes: response3,
          majors: response4,
          skills: response1,
        });
      })
      .catch((error) => {
        if ( error.response.status === 403 ) {
          // access token expired
          Cookies.remove('nawaya-token');
          logout();
          // refresh the page to get a new access token
          window.location.reload();
        }
        setOpenSnackbar(true);
      })
      .finally(() => setIsLoading(false));
  }, [ axios ]);
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      let cyclesFilter = {};
      if (cycleDate && cycles) {
        cyclesFilter.cycleDate = cycleDate?.["$y"]?.toString()?.slice(2); 
      }
      try {
        const response = await Api.getStudents({
          languages,
          job_types: jobTypes,
          majors,
          skills,
          favorite: favoritesOnly,
          ...cyclesFilter,
          available,
          recruited
        });
        setStudents(response?.data);
      } catch (err) {
        console.log(err);
        setOpenSnackbar(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [showResults]);

  // const handleDateChange = useCallback((date) => {
  //   if (cycleDate["$y"] === date["$y"]) {
  //     setClosed(true);
  //   }
  //   setCycleDate(date);
  // }, [ cycleDate ]);

  return (
    <div className={"hiring-portal-wrapper"}>
			<Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackar} autoHideDuration={8000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%', minWidth:'50vw' }}>
          An unexpected error occurred. Please try again later, Or refresh the page.
        </Alert>
      </Snackbar>
      <div className={"hiring-portal-container"}>
        <div className={"hiring-portal-cards-container"}>
          <div
            style={{ display: "" }}
            className={"hiring-portal-intro-container"}
          >
            <Grid container>
              <Grid item xs={12} sm={12} md={12} lg={12} ref={filterRef}>
                <div>
                  <div
                    className={"hiring-portal-popover"}
                    style={{ width: filterSize?.width }}
                  >
                    <Typography variant={"h5"} fontWeight={700} fontSize={20}>
                      Search Candidates Here
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        marginTop: "25px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          marginTop: "20px",
                          width: !isSmall ? "50%" : "100%",
                          flexBasis: !isSmall ? "50%" : "100%",
                        }}
                      >
                        <Typography my={1} variant={"h5"} fontSize={"17px"}>
                          Job Type
                        </Typography>
                        <Autocomplete
                          multiple
                          value={jobTypes}
                          onChange={(e, newValue) => {
                            setJobsTypes(newValue);
                          }}
                          options={filterData.jobTypes}
                          filterSelectedOptions
                          sx={{ zIndex: "10000000000" }}
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
                      <div
                        style={{
                          marginTop: "20px",
                          width: !isSmall ? "50%" : "100%",
                          flexBasis: !isSmall ? "50%" : "100%",
                          padding: !isSmall ? "0 0 0 10px" : "5px 0",
                        }}
                      >
                        <Typography my={1} variant={"h5"} fontSize={"17px"}>
                          Skills
                        </Typography>
                        <Autocomplete
                          multiple
                          value={skills}
                          onChange={(e, newValue) => {
                            setSkills(newValue);
                          }}
                          options={filterData.skills}
                          filterSelectedOptions
                          sx={{ zIndex: "10000000000" }}
                          renderInput={(params) => (
                            <CustomTextField
                              {...params}
                              id={"languages"}
                              variant={"filled"}
                              sx={{ backroundColor: "white !important" }}
                              label="Choose Skills here"
                            />
                          )}
                        />
                      </div>
                      <div
                        style={{
                          marginTop: "20px",
                          width: !isSmall ? "50%" : "100%",
                          flexBasis: !isSmall ? "50%" : "100%",
                        }}
                      >
                        <Typography my={1} variant={"h5"} fontSize={"17px"}>
                          Major
                        </Typography>
                        <Autocomplete
                          multiple
                          value={majors}
                          onChange={(e, newValue) => {
                            setMajors(newValue);
                          }}
                          options={filterData.majors}
                          filterSelectedOptions
                          sx={{ zIndex: "10000000000" }}
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
                      <div
                        style={{
                          marginTop: "20px",
                          width: !isSmall ? "50%" : "100%",
                          flexBasis: !isSmall ? "50%" : "100%",
                          padding: !isSmall ? "0 0 0 10px" : "5px 0",
                        }}
                      >
                        <Typography my={1} variant={"h5"} fontSize={"17px"}>
                          Language
                        </Typography>
                        <Autocomplete
                          multiple
                          value={languages}
                          onChange={(e, newValue) => {
                            setLanguages(newValue);
                          }}
                          options={filterData.languages}
                          filterSelectedOptions
                          sx={{ zIndex: "10000000000" }}
                          renderInput={(params) => (
                            <CustomTextField
                              {...params}
                              id={"languages"}
                              variant={"filled"}
                              sx={{ backroundColor: "white !important" }}
                              label="Choose language Proficiency here"
                            />
                          )}
                        />
                      </div>
                      <div
                        style={{
                          marginTop: "20px",
                          width: !isSmall ? "50%" : "100%",
                          flexBasis: !isSmall ? "50%" : "100%",
                          padding: "5px 0",
                          display: "flex",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: "10px",
                            maxWidth: "200px",
                          }}
                        >
                          {/* <div
                            className={`cycles-check ${
                              cycles && "cycles-check-open"
                            }`}
                          >
                            <Typography
                              color="primary"
                              my={1}
                              mr={2}
                              variant={"h5"}
                              fontSize={"17px"}
                            >
                              Specified Cycle
                            </Typography>
                            <Checkbox
                              checked={cycles}
                              onChange={(event) => {
                                setCycles(event.target.checked);
                                setClosed(!event.target.checked);
                              }}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                            {cycles && closed && (
                              <div className="year-specified">
                                <Typography
                                  onClick={() => setClosed(false)}
                                  sx={{ cursor: "pointer" }}
                                  color="primary"
                                  fontWeight={"bold"}
                                  my={1}
                                  mr={2}
                                  variant={"h5"}
                                  fontSize={"18px"}
                                >
                                  {cycleDate?.["$y"]?.toString()?.slice(2)}
                                </Typography>
                              </div>
                            )}

                            <div
                              className={`cycles-autocomplete ${
                                closed && "cycles-autocomplete-closed"
                              }`}
                            >
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["YearCalendar"]}>
                                  <DemoItem label="Cycle">
                                    <YearCalendar
                                      minDate={dayjs("1900-01-01")}
                                      maxDate={dayjs("1999-01-01")}
                                      yearsPerRow={3}
                                      defaultValue={dayjs("1990-01-01")}
                                      value={cycleDate}
                                      onChange={(newValue) => {
                                        handleDateChange(newValue);
                                      }}
                                    />
                                  </DemoItem>
                                </DemoContainer>
                              </LocalizationProvider>
                            </div>
                          </div> */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              color="primary"
                              my={1}
                              mr={2}
                              variant={"h5"}
                              fontSize={"17px"}
                            >
                              Favorites
                            </Typography>
                            <Checkbox
                              checked={favoritesOnly}
                              onChange={(event) =>
                                setFavoritesOnly(event.target.checked)
                              }
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginTop: "10px",
                            }}
                          >
                            <Typography
                              color="primary"
                              mr={2}
                              variant={"h5"}
                              fontSize={"17px"}
                            >
                              Available for Hire
                            </Typography>
                            <Checkbox
                              checked={available}
                              size="medium"
                              onChange={(event) => {
                                setAvailable(event.target.checked);
                                setRecruited(false);
                              }}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              color="primary"
                              mr={2}
                              variant={"h5"}
                              fontSize={"17px"}
                            >
                              Employed
                            </Typography>
                            <Checkbox
                              checked={recruited}
                              size="medium"
                              onChange={(event) => {
                                setRecruited(event.target.checked);
                                setAvailable(false);
                              }}
                              inputProps={{ "aria-label": "controlled" }}
                              sx={{ borderRadius: '50%'}}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`clear-filters ${noFiltersSelected && "clear-filters-closed"}`}
                    >
                      <Button
                        color={"primary"}
                        // fullWidth
                        startIcon={<HighlightOffIcon />}
                        sx={{
                          height: "40px",
                          marginLeft: '-7px'
                        }}
                        onClick={() => clearFilters()}
                        variant="text"
                      >
                        Clear Filters
                      </Button>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        color={"primary"}
                        // fullWidth
                        startIcon={<SearchIcon />}
                        sx={{
                          height: "40px",
                          minWidth: "200px",
                          maxWidth: "300px",
                          width: "30%",
                        }}
                        onClick={() => setShowResults((prev) => !prev)}
                        variant="contained"
                      >
                        Show Results
                      </Button>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          <Grid container spacing={isSM ? 0 : isSmall ? 2 : 5} marginBottom={3}>
            {isLoading ? (
              <Loader SELogo />
            ) : (
              <>
                <Grid item xs={12} my={2}></Grid>
                {(students?.length === 0 || !students ) && !isLoading && (
                  <Stack mt={7} mb={5} sx={{ width: '100%' }} direction="column" alignItems='center' justifyContent='center'>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      sx={{ width: "100%" }}
                      mb={1}
                    >
                      <Typography
                        variant={"h6"}
                        mr={2}
                        color="primary"
                        fontSize="28px"
                        textAlign={"center"}
                        fontWeight={'bold'}
                      >
                        Sorry! No results found
                      </Typography>
                      <SentimentDissatisfiedIcon color="primary" />
                    </Stack>
                    <Typography 
                        variant={"h4"}
                        color="secondary"
                        fontSize="18px"
                        textAlign="center"
                        fontWeight={600}
                        sx={{display: 'block'}}
                      >
                        We couldn't find any condidate matching your search criteria
                      </Typography>
                  </Stack>
                )}
                {
                 students?.length > 0 &&
                  students?.map((props, index) => (
                    <Grid
                      style={{
                        marginTop: isSmall && "10px",
                        marginBottom: isSmall && "10px",
                      }}
                      key={`card-${index}`}
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={4}
                      mt={2}
                    >
                      {/* <HiringCard {...props} /> */}
                      <HiringCard2
                        currentUser={currentUser}
                        {...props}
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        mt={2}
                      />
                    </Grid>
                  ))
                }
              </>
            )}
          </Grid>
        </div>
        <Grid container className="hiring-grid" spacing={2} mt={12} mb={7}>
          <Grid item xs={12}>
            <Typography
              color="primary"
              variant={isSmall ? "h6" : "h4"}
              sx={{ fontWeight: "bold" }}
              textAlign={"center"}
            >
              Trusted by some of the leading companies
            </Typography>
          </Grid>
          <Grid item xs={12}>
          </Grid>
          <Grid item xs={12}>
            <Divider mb={-2} style={{ height: "2px" }} />
          </Grid>

          <Swiper
            spaceBetween={50}
            slidesPerView={isSmall ? 3 : 6}
            // pagination={{ clickable: true }}
            autoplay={{ delay: 1500, disableOnInteraction: false }}
            // loop={true}
            style={{ width: "100%" }}
            loop={true}
          >
            <SwiperSlide>
              <img
                className="partners-picture"
                // src="	https://nawaya.org/wp-content/uploads/2021/12/0001-600x369.jpg"
                alt={"partners"}
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="partners-picture"
                // src="https://nawaya.org/wp-content/uploads/2021/12/logo-f.png"
                alt={"partners"}
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="partners-picture"
                // src="https://nawaya.org/wp-content/uploads/2022/01/web-GlobalGiving-Logo-400x400.jpg"
                alt={"partners"}
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="partners-picture"
                // src="	https://nawaya.org/wp-content/uploads/2022/02/The-Netherlands.jpg"
                alt={"partners"}
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="partners-picture"
                // src="	https://nawaya.org/wp-content/uploads/2022/02/partner-10.jpg"
                alt={"partners"}
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="partners-picture"
                // src="	https://nawaya.org/wp-content/uploads/2022/02/eu-300x266-1.png"
                alt={"partners"}
              />
            </SwiperSlide>

            <SwiperSlide>
              <img
                className="partners-picture"
                // src="https://nawaya.org/wp-content/uploads/2022/01/web-partner-22-750x465.jpg"
                alt={"partners"}
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="partners-picture"
                // src="	https://nawaya.org/wp-content/uploads/2022/01/web-GlobalFundforChildren-750x465.jpg"
                alt={"partners"}
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="partners-picture"
                // src="https://nawaya.org/wp-content/uploads/2022/01/web-gizlogo-unternehmen-de-sw-300.jpg"
                alt={"partners"}
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="partners-picture"
                // src="https://nawaya.org/wp-content/uploads/2022/02/web-al-gurair-750x465.jpg"
                alt={"partners"}
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="partners-picture"
                // src="https://nawaya.org/wp-content/uploads/2022/02/alfanar-logo-print.jpg"
                alt={"partners"}
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="partners-picture"
                // src="https://nawaya.org/wp-content/uploads/2022/02/partner-4.jpg"
                alt={"partners"}
              />
            </SwiperSlide>
          </Swiper>
        </Grid>
      </div>
    </div>
  );
};

export default HiringPortal;
