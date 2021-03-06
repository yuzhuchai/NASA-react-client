import React from 'react'

function Apod (props){
	console.log(props);
	return(
		<div className='Apod'>
			{props.video ? 
				<div>
					<h2>{props.notification}<a href={props.video}> <i>click here to see the video</i></a></h2>
					<h3>{props.caption}</h3>
					<p>{props.bio}</p>
					<p>{props.date.split('T')[0]}</p>
				</div> 
				:
				<div>
					<h3>{props.caption}</h3>
					<p>{props.bio}</p>
					<p>{props.date.split('T')[0]}</p>
				</div>
			}
		</div>
	)
}

export default Apod