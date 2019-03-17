
import React, {Component} from 'react';
import {Navbar,NavItem} from 'react-materialize';
import {NavLink, Link} from 'react-router-dom';

export class Header extends Component
{
   constructor(props) {
        super(props);

    }

    render() {

        const title = ()=> {
            return(
                <span>&nbsp;&nbsp;expense<b>note</b></span>
            )
        }

        return(
            <div>
                <Navbar brand={title()} right className="green">
                    <li><Link to="/expense">Expense</Link ></li>
                    <li><Link to="/account">Account</Link ></li>
                    <li><Link to="/category">Category</Link ></li>
                    <li><Link to="/chart">Chart</Link ></li>
                </Navbar>
            </div>
        )
    }

}