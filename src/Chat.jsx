import { Client } from "tmi.js";
import { twitch_username } from "../config";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./chat.css";

export default function Chat() {
	const [messages, setMessages] = useState([]);
	const client = useRef(null);

	useEffect(() => {
		client.current = new Client({
			channels: [twitch_username],
		});

		client.current.connect();

		client.current.on("message", async (channel, tags, message) => {
			const newMessage = { channel, tags, message };
			setMessages((currentMessages) => {
				const messages_ = [...currentMessages, newMessage];
				return messages_;
			});
			await new Promise((r) => setTimeout(r, 5000));
			setMessages((currentMessages) => {
				const messageCopy = [...currentMessages];
				const messageFound = messageCopy.findIndex(
					(m) => m.id == message.id
				);
				messageCopy.splice(messageFound, 1);
				return messageCopy;
			});
			window.scrollTo(0, document.body.scrollHeight);
		});

		return async () => {
			console.log("closing", client);
			if (client.current != undefined) {
				// client.current?.ws?.onmessage = () => {};
				await new Promise((r) => setTimeout(r, 2000));
				client.current.disconnect();
			}
		};
	}, []);

	return <Messages messages={messages} />;
}

function Messages({ messages }) {
	const scrollableDivRef = useRef(null);

	useEffect(() => {
		scrollableDivRef.current.scrollTop =
			scrollableDivRef.current.scrollHeight;
	}, [messages]);

	return (
		<>
			<div className="chat" ref={scrollableDivRef}>
				{messages.map((m) => (
					<Message
						key={m.tags.id}
						message={m.message}
						username={m.tags["display-name"]}
						color={m.tags.color}
					/>
				))}
			</div>
		</>
	);
}

function Message(props) {
	return (
		<>
			<div className="chatRow">
				<div className="username" style={{ color: props.color }}>
					{props.username}
				</div>
				<div className="message">{props.message}</div>
			</div>
		</>
	);
}

Messages.propTypes = {
	messages: PropTypes.array,
};

Message.propTypes = {
	username: PropTypes.string,
	message: PropTypes.string,
	color: PropTypes.string,
};
