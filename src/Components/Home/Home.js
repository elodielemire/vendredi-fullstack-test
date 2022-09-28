import './Home.css';
import {useSelector} from "react-redux";
import {useEffect, useRef} from "react";
import Form from "../Form/Form";
import Message from "../Message/Message";

export default function Home () {
    const messages = useSelector(state => state.messages);
    const userId = useSelector(state => state.currentUserId);
    const divToScroll = useRef();

    useEffect(() => {
        divToScroll.current.scrollIntoView({behavior: "smooth", block: "end"});
    }, [messages])

    return(
        <>
            <img className="home__logo" alt="logo vendredi" src={require("../../assets/logo-vendredi.jpeg")}/>
            <h1 className="home__title">Vendredi ChatX</h1>
            <h2 className="home__subtitle">Welcome, user #{userId} !</h2>
            <div className="home__cards-container">
                {messages.map((item, i) => <Message key={i} message={item}/>)}
            </div>
            <div ref={divToScroll}></div>
            <Form/>
        </>
    )
}