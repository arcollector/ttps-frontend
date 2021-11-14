import React from 'react';
import {Modal as SemanticaUiModal, Icon} from 'semantic-ui-react';
import './Modal.scss';

export function Modal(props) {

    const {show, setShow, title, children}= props;

    const onClose=()=>{
        setShow(false);
    }

    return (
        <SemanticaUiModal 
            open={show}
            onClose={onClose}
            className="basic-modal"
            size="tiny"    
        >   
            <SemanticaUiModal.Header>

                <h3>{title}</h3>
                <Icon name="close" onClick={onClose}/>

            </SemanticaUiModal.Header>
            <SemanticaUiModal.Content>
                {children}
            </SemanticaUiModal.Content>



        </SemanticaUiModal>
            
        
    )
}
