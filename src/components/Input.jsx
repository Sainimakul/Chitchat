import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (!text.trim() && !img) return; // Do nothing if text and image are empty

    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload failed", error);
        },
        async () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await sendMessage(text, downloadURL);
          });
        }
      );
    } else {
      await sendMessage(text);
    }

    // Reset input fields after sending message
    setText("");
    setImg(null);
  };

  const sendMessage = async (text, img = null) => {
    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
        ...(img && { img }),
      }),
    });

    // Update user chats with last message info
    const lastMessageInfo = {
      [data.chatId + ".lastMessage"]: { text },
      [data.chatId + ".date"]: serverTimestamp(),
    };
    await updateDoc(doc(db, "userChats", currentUser.uid), lastMessageInfo);
    await updateDoc(doc(db, "userChats", data.user.uid), lastMessageInfo);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="Attach" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="Upload" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;

