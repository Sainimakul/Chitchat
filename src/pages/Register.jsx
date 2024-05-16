import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [imageUploaded, setImageUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    if (!file) {
      alert("Image not uploaded.");
      return;
    }

    setLoading(true);

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            console.error(err);
            alert("Failed to create account");
            setLoading(false);
          }
        });
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create account");
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageUploaded(true);  // Indicate that an image has been successfully loaded
      alert("Image upload successful.");
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chit-Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <input required style={{ display: "none" }} type="file" id="file" onChange={handleImageChange} />
          <label htmlFor="file">
            <img src={Add} alt="" />
            {imageUploaded ? <span>Image upload successful.</span> : <span>Add an avatar</span>}
          </label>
          <button disabled={loading}>Sign up</button>
          
        </form>
        <p>
          You do have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
