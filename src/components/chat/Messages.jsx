import React, { Component } from 'react';
import Message from './Message'

export default class Messages extends Component {
    
    componentDidUpdate() {
        const objDiv = document.getElementById('messages-list');
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    render(){
        const messages = this.props.messages.map( (message, i) => {
            return (
                <Message
                    key={i}
                    username={message.username}
                    message={message.message}
                    fromMe={message.fromMe} />
            );
        });
        return(
            <div className="messages" id = 'messages-list'>
                {messages}
            </div>
        )
    }
}