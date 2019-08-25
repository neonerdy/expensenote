import React, {Component} from 'react';
import {Navbar,Nav} from 'react-bootstrap';
import {Link} from 'react-router-dom';


export class Header extends Component
{

    render() {

        return(
            <div>

                <Navbar bg="success" variant="dark">
                    <Navbar.Brand href="#"><h2><small>expense<b>note</b></small></h2></Navbar.Brand>
                    <Nav>
                        <Nav.Link><Link to="/expense"><div style={{color:'white'}}>Expense</div></Link></Nav.Link>
                        <Nav.Link><Link to="/account"><div style={{color:'white'}}>Account</div></Link></Nav.Link>
                        <Nav.Link><Link to="/category"><div style={{color:'white'}}>Category</div></Link></Nav.Link>
                        <Nav.Link><Link to="/chart"><div style={{color:'white'}}>Chart</div></Link></Nav.Link>
                     </Nav>
   
                </Navbar>
                

            </div>
        )
    }




}