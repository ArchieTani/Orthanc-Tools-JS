import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal';

import apis from '../../../services/apis'

import RoleForm from './RoleForm'
export default class ModifyRole extends Component {

    state = { 
        show: false,
        data: {}, 
     };

    modify = (roleFormState) => {
        let permission = {
            ...roleFormState,
            name: this.props.name
        }
        apis.role.modifyRole(permission).then(() => this.setState({show: false})).catch(error => console.log(error))
    }

    handleClick = ()=> {
        let permission = {}
        apis.role.getPermission(this.props.name).then(answer => permission = answer[0]).then(()=>{
            this.setState({
                data: {...permission}, 
                show: true
            })
        }).catch(error => console.log(error))
    }

    render() {
        return (
            <Fragment>
                <button type='button' className='btn btn-warning' name='openModify' onClick={this.handleClick}>Edit</button>
                <Modal id='modify' show={this.state.show} onHide={() => this.setState({show: false})}>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Modify role {this.state.data.name}</h2>
                    </Modal.Header>
                    <Modal.Body>  
                        <RoleForm data={this.state.data} onSubmitRole = {this.modify}/>
                    </Modal.Body>
                </Modal>
            </Fragment>
            
        );
    }
}