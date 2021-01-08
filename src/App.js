import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import moment from 'moment'
import { ThemeProvider, makeStyles, fade } from '@material-ui/core/styles'
import {
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

const useStyles = makeStyles((theme) => ({
  appbar: {
    display: "flex",
    justifyContent: "space-between"
  },
  hero: {
    backgroundImage: "linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('./news1.jpg')",
    height: 500,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: "4rem",
    [theme.breakpoints.down("sm")]: {
      height: 300,
      fontSize: "3rem"
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
    justifyContent: "space-between"
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
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
  const [darkMode, setDarkMode] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [category, setCategory] = useState('articles')
  const [articles, setArticles] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    getData();
  }, [category])

  const getData = async () => {
    let res = await Axios.get(`https://spaceflightnewsapi.net/api/v2/${category}`)
    let res2 = res.data
    setArticles(res2)
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
        <AppBar position="static" color="primary" >
          <Toolbar className={classes.appbar}>
            <Typography variant="h4" onClick={(e) => setAnchorEl(e.currentTarget)}>
              React-{category}
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
        <Box className={classes.hero}>
          <Box>
            The World in Headlines !
        </Box>
        </Box>
        <Container maxWidth="lg" className={classes.newsContainer}>
          <Typography variant="h4" className={classes.newsTitle}>
            Latest
          </Typography>
          <Grid container spacing={3}>
            {articles.map((item) => {
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
      </Paper>
    </ThemeProvider>
  );
}

export default App;
