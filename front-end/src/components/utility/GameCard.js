import React from 'react'
import { Link } from 'react-router-dom'

function GameCard(props){
    const images = props.data.screenshot_url.split(',');
    const rand = Math.floor(Math.random() * images.length)
    const image = images[rand]
    return(
        <div className="col s3 game-card">
            <Link to={`/game/${props.data.id}`}>
                <div className="card">
                    <div className="card-image waves-effect waves-block waves-light">
                        <img className="activator" src={image} />
                    </div>
                    <div className="card-content">
                        <span className="card-title activator grey-text text-darken-4">{props.data.name}<i className="material-icons right">more_vert</i></span>
                        {/* <p><a href="#">This is a link</a></p> */}
                    </div>
                </div>        
            </Link>
        </div>
    )
}

export default GameCard;