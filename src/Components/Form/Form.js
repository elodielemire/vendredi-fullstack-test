import './Form.css';
import {useRef, useState} from "react";
import {sendMessage} from "../../redux/articles/messageReducer";
import {useDispatch} from "react-redux";

export default function Form () {
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();
    const textArea = useRef();

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(sendMessage(message));
        setMessage('');
        textArea.current.focus();
    };

    const handleShiftEnter = e => {
        if (e.shiftKey && e.key === 'Enter') {
            handleSubmit(e);
        }
    }

    return(
        <div className="form-container">
            <form onSubmit={handleSubmit} className="form">
                <textarea
                    ref={textArea}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleShiftEnter}
                    value={message}
                    type="text"
                    className="form__textarea"/>
                <button className="form__button">Send</button>
            </form>
        </div>
    )
}