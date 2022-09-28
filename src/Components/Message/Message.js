import {useDispatch, useSelector} from "react-redux";
import {deleteMessage} from "../../redux/articles/messageReducer";
import "./Message.css";
import deleteLogo from '../../assets/delete.svg';

export default function Message ({message}) {
    const currentUserId = useSelector(state => state.currentUserId);
    const isSentByMe = message.senderId === currentUserId;

    const dispatch = useDispatch();
    const deleteCard = id => {
        dispatch(deleteMessage(id));
    }

    return (
        <div className={ "message-container " + (isSentByMe? "message--current-user" : "")}>
            <div className="message">
                {!isSentByMe && <p className='message__author'>Written by user #{message.senderId}</p>}
                <p className='message__text'>{message.text}</p>

                {isSentByMe &&
                    <button className='message__btn' onClick={() => deleteCard(message.id)}>
                        <img className='message__btn__img'
                             src={deleteLogo}
                             alt="deleteLogo"
                        />
                    </button>
                }
            </div>
        </div>
    )
}