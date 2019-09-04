import React from 'react'
import PlanetCards from '../PlanetCards'
import SearchPlanet from '../SearchPlanet'
import { Button } from 'semantic-ui-react'

class SelectPlanetContainer extends React.Component {
	constructor(){
		super()
		this.state={
			randomPlanet: [],

		}
	}

	componentDidMount(){
		this.getRandomPlanet()
	}


	getRandomPlanet = async () => {
		const url = `http://localhost:9000/api/v1/planet/default`
		const getRandomPlanet = await fetch(url, {
			method: 'GET',
			credientials: 'include'
		})

		const parsed = await getRandomPlanet.json()
		// console.log(parsed,"<0000000random planet in the planet container");
		// parsed.data is the array that we want. 
		this.setState({
			randomPlanet: parsed.data
		})
	}

	adoptPlanet = async (planet, bio) => {
		console.log(planet, bio, '<-----hitting adopt button');
		const data = {
			name: planet,
			bio: bio
		}
		const url = `http://localhost:9000/api/v1/planet/adopt`
		const createdPlanet = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			credentials: 'include',
			headers: {
		          'Content-Type': 'application/json'
		        }			
		})
		const parsed = await createdPlanet.json()
		console.log(parsed,'<00000000shou create the planet');
		// need to set state or do something else. so when the button is hit, switch to a new page. 

	}

	render(){
		console.log(this.state,"<-------state in the random planet");
		return(
			<div className='PlanetContainer'>
				<h4>Choose a planet to adopt!! you can pick from the following cards or select your own planet</h4>
				<SearchPlanet adoptPlanet={this.adoptPlanet}/>
				<div className='PlanetCard'>
					<PlanetCards randomPlanet={this.state.randomPlanet} adoptPlanet={this.adoptPlanet}/>
				</div>
				<Button onClick={this.getRandomPlanet.bind(null)}>Shuffle</Button>
			</div> 
		)
	}
}

export default SelectPlanetContainer