import React, { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import Axios from 'axios';
import moment from 'moment'
import { ThemeProvider, makeStyles, fade } from '@material-ui/core/styles'
import {
  Divider,
  Box,
  Typography,
  Toolbar,
  AppBar,
  Container,
  InputBase,
  Grid,
  Card,
  CardActionArea,
  CardActions,
  CardMedia,
  CardContent,
  Paper,
  Switch,
  Menu,
  MenuItem,
  Link,
  createMuiTheme,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Mic from '@material-ui/icons/Mic';
import Hearing from '@material-ui/icons/Hearing';
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "2rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.2rem"
    }
  },
  appbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  fab: {
    margin: 0,
    height: 56,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
    marginLeft: theme.spacing(1),
  },
  hero: {
    backgroundImage: "linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('./news1.jpg')",
    height: "100vh",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    position: "relative",
    backgroundAttachment: "fixed",
    alignItems: "center",
    color: "#fff",
    fontSize: "4rem",
    [theme.breakpoints.down("sm")]: {
      height: 300,
      fontSize: "2rem"
    }
  },
  newsContainer: {
    paddingTop: theme.spacing(3),
  },
  newsTitle: {
    fontWeight: 800,
    paddingBottom: theme.spacing(3)
  },
  card: {
    maxWidth: "100%",
    height: "auto"
  },
  media: {
    height: 240
  },
  cardActions: {
    display: "flex",
    margin: "0 10px",
    justifyContent: "space-between",
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function App() {
  const synth = window.speechSynthesis;
  const SpeechRecognition = window.webkitSpeechRecognition;
  const [darkMode, setDarkMode] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [category, setCategory] = useState('articles')
  const [articles, setArticles] = useState([])
  const [isOffline, setOffline] = useState(false)
  const [text, setText] = useState('')
  const [isListening, setListening] = useState(false)
  const [ai, setAi] = useState('')

  useEffect(() => {
    const getData = () => {
      Axios.get(`https://api.spaceflightnewsapi.net/v3/${category}`)
        .then(res => {
          setArticles(res.data)
          localStorage.setItem(category, JSON.stringify(res.data))
        }).catch(err => {
          setOffline(true)
          let dataCollection = localStorage.getItem(category)
          setArticles(JSON.parse(dataCollection))
        })
    }
    getData();
  }, [category])

  const aiSpeak = (textSpeak) => {
    let voices = [];
    voices = synth.getVoices();
    let toSpeak = new SpeechSynthesisUtterance(textSpeak)
    toSpeak.voice = voices[1];
    toSpeak.onend = e => {
      console.log("done...")
    }
    toSpeak.onerror = e => console.log("Error", e.error)
    synth.speak(toSpeak);
  }
  const speakRobot = (whatTo) => {
    setAi(whatTo);
    aiSpeak(whatTo);
  }

  const handleAI = () => {
    speakRobot("hey reader ! would you like to read me all the headlines ?")
    setTimeout(() => {
      aiRecognize();
    }, 5000);
  }

  const yes = (str) => {
    const conditions = ['yes', 'yeah', "sure", 'why not'];
    return conditions.some(el => str.includes(el))
  }
  const no = (str) => {
    const conditions = ['no', 'stop', 'shut up'];
    return conditions.some(el => str.includes(el))
  }

  const aiRecognize = () => {
    let recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.onstart = () => {
      setListening(true)
      console.log("listening...")
    }
    recognition.onspeechend = (e) => {
      recognition.stop();
      setListening(false)
      console.log("done recognizing")
    }
    recognition.onerror = (e) => {
      console.log("error=", e.error)
      setListening(false)
    };
    recognition.onresult = (e) => {
      var current = e.resultIndex;
      var transcript = e.results[current][0].transcript;
      if (e.results[0].isFinal) {
        setAi(transcript)
        if (yes(transcript.toLowerCase())) {
          articles.forEach((item) => {
            aiSpeak(item.title);
          })
        }
        else if (no(transcript.toLowerCase())) {
          aiSpeak('okay, no problem !');
        }
        else {
          aiSpeak(`sorry! I can't understand, please tell my developer ashish badgujar !`);
        }
      }
    }
    recognition.start();
  }

  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#333" : "#fff"
      }
    }
  })
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme} >
      <Paper>
        {isOffline && <Alert severity="warning">You are offline , check your internet connection !</Alert>}
        <Box className={classes.hero}>
          <Box>
            <AppBar position="static" color="transparent" elevation={0} >
              <Toolbar className={classes.appbar}>
                <Typography className={classes.title} onClick={(e) => setAnchorEl(e.currentTarget)}>
                  {category}
                </Typography>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={() => {
                    setCategory("articles")
                    setAnchorEl(null)
                  }}>Articles</MenuItem>
                  <MenuItem onClick={() => {
                    setCategory("blogs")
                    setAnchorEl(null)
                  }}>Blogs</MenuItem>
                  <MenuItem onClick={() => {
                    setCategory("reports")
                    setAnchorEl(null)
                  }}>Reports</MenuItem>
                </Menu>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search…"
                    type="text"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
                <Switch
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
              </Toolbar>
            </AppBar>
            <Divider />
          </Box>
          <Box id="headline" >
            World in Headlines
          </Box>
        </Box>
        <Container maxWidth="lg" className={classes.newsContainer}>
          <Typography variant="h4" className={classes.newsTitle}>
            Latest
          </Typography>
          <Grid container spacing={3}>
            {articles && articles.map((item) => {
              if (item.title.toLowerCase().includes(text.toLowerCase())) {
                return (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card className={classes.card}>
                      <CardActionArea>
                        <CardMedia
                          className={classes.media}
                          image={item.imageUrl}
                          title="IT"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            <Link href={item.url} target="_blank" color="inherit">
                              {item.title}
                            </Link>
                          </Typography>
                          <Typography variant="body2" color="textSecondary" component="p">
                            {item.summary}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions className={classes.cardActions}>
                        <Typography variant="subtitle2" color="textSecondary" component="p">
                          {item.newsSite}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary" component="p">
                          {moment(item.updatedAt).fromNow()}
                        </Typography>
                      </CardActions>
                    </Card>
                  </Grid>
                )
              } else {
                return null;
              }
            })}
          </Grid>
        </Container>
        <Fab color="primary" variant="extended" aria-label="add" className={classes.fab} onClick={() => handleAI()}>
          {ai}
          {isListening ? <Hearing /> : <Mic />}
        </Fab>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
