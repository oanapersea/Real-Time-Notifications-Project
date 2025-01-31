import React from 'react';

import BackgroundImg from '../commons/images/future-medicine.jpg';
import background from '../commons/images/maxresdefault.jpg';
import background1 from '../commons/images/sinum_bg_hems_ok.jpg';

import {Button, Container, Jumbotron} from 'reactstrap';
import {Link} from "react-router-dom";


const backgroundStyle = {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: "100%",
    height: "700px",
    backgroundImage: `url(${background1})`
};
const textStyle = {color: 'grey', fontWeight: 'bold' };
const textStyle1 = {color: 'black', fontWeight: 'bold' };

class Home extends React.Component {


    render() {

        return (

            <div>
                <Jumbotron fluid style={backgroundStyle}>
                    <Container fluid>
                        <h1 className="display-3" color= 'black' style={textStyle1}>Energy Management System</h1>
                        <p className="lead" style={textStyle}> <b>Our solutions for distribution system operators bring transparency to the low voltage grid</b> </p>
                        <hr className="my-2"/>
                        <p className="lead">
                            <Button color="primary" tag={Link} to="/user/login">
                                Login
                            </Button>
                        </p>
                    </Container>
                </Jumbotron>

            </div>
        )
    };
}

export default Home
