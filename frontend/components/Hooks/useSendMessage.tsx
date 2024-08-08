import { useState } from "react";
import useConversation from '../../zustand/useConversation';

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	const sendMessage = async (message: string) => {
		setLoading(true);
		try {
			const token = localStorage.getItem("token");
			const res = await fetch(`http://localhost:5000/api/chat/send/${selectedConversation._id}`, {
				method: "POST",	
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ message }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			setMessages([...messages, data]);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;