import React from 'react';
import './App.css';
import Header from './Header'
import LandingContainer from './LandingContainer'
import SelectPlanetContainer from './SelectPlanetContainer'
import MainContainer from './MainContainer'


class App extends React.Component {
  constructor(){
    super()
    this.state = {
      apodImgUrl: '',
      apodCaption:'',
      apodParagraph:'',
      date:'',
      displayLandingPage: true,
      loggedUser: null,
      selectPlanet: false,
      displayProfile: false,
      planetStatus: 0,
      planetId: null,
      user: null,
      video:'',
      notification:''
    }
  }

  componentDidMount(){
      this.getApodData()
      // console.log('this should only run once');
  }


  logout = async () => {
    const logoutResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/user/logout`,{
      credentials: 'include'
    })
    // console.log(logoutResponse,'<-=----logout response ');
    this.setState({
      loggedUser: null,
      displayLandingPage: true,
      selectPlanet: false,
      displayProfile: false,
    })

    // so right here when i log out i have to save the planet status. 
    this.updatePlanetStatus()
    // console.log(updatePlanetStatus,'<--------updated plannet status response');
  }

  updatePlanetStatus=async () => {
    const updatePlanetStatus = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/planet/status/${this.state.planetId}`,{
          method: 'PUT',
          credentials: 'include',
          body: JSON.stringify({status:this.state.planetStatus}),
          headers: {
                'Content-Type': 'application/json'
              }
      })
  }


  getApodData = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/nasadata/load/apod`, {
          method: 'GET',
          credentials: 'include',
      })
      const parsdResponse = await response.json()
      // console.log(parsdResponse,"<------landing page apod data");
      if (parsdResponse.data.mediaType ==='video'){
        this.setState({
          apodImgUrl: 'https://apod.nasa.gov/apod/image/1909/PlutoTrueColor_NewHorizons_960.jpg',
          apodCaption: parsdResponse.data.imgCaption,
          apodParagraph: parsdResponse.data.explnation,
          date: parsdResponse.data.date,
          video:parsdResponse.data.imgUrl,
          notification: 'this background image is Pluto, taken on 9/10/2019. The following paragraph is the description of NASA image of the day, which it this video.'
        }) 
      } else {
        this.setState({
          apodImgUrl: parsdResponse.data.imgUrl,
          apodCaption: parsdResponse.data.imgCaption,
          apodParagraph: parsdResponse.data.explnation,
          date: parsdResponse.data.date,
        }) 
      }
      
  }

  toggleRegisterContainer = (user) => {
    this.setState({
      displayLandingPage: !this.state.displayLandingPage,
      loggedUser: user,
      selectPlanet: !this.state.selectPlanet,
      user: user
    })
  }

  toggleLogInContainer = (user) => {
    this.setState({
      displayLandingPage: !this.state.displayLandingPage,
      loggedUser: user,
      displayProfile: true,
      user: user
    })
  }

  togglePlanetContainer = () => {
    this.setState({
      selectPlanet: !this.state.selectPlanet,
      displayProfile: !this.state.displayProfile
    })
  }

  changePlanetStatus = (num, planetId) => {
    this.setState({
        planetStatus: num,
        planetId: planetId
    })
  }

  render(){
    console.log(process.env,'<-----process .env');
    // console.log(this.state,'<=====state in app');
    const appStyle = {
        backgroundImage: `url(${this.state.apodImgUrl})`,
        backgroundPosition: 'center'
      }
    // console.log(this.state,"<--------state in app");
    return (
      <div style={ appStyle } className="App">
        <Header loggedUser={this.state.loggedUser} logout={this.logout}/>
        {this.state.displayLandingPage? <LandingContainer toggleLoginContainer={this.toggleLogInContainer} toggleRegisterContainer={this.toggleRegisterContainer} caption={this.state.apodCaption} date={this.state.date} bio={this.state.apodParagraph} video={this.state.video} notification={this.state.notification}/> : null}
        {this.state.selectPlanet ? <SelectPlanetContainer toggleContainer={this.togglePlanetContainer} loggedUser={this.state.loggedUser}/> : null}
        {this.state.displayProfile ? <MainContainer updatePlanetStatus={this.updatePlanetStatus} changePlanetStatus={this.changePlanetStatus} user={this.state.user} togglePlanetContainer={this.togglePlanetContainer} loggedUser={this.state.loggedUser} /> : null}
      </div>
    ); 
  }
}



export default App;
