import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");  // Navigate to home on successful login
    } catch (err) {
      // Display an alert and then redirect back to login page
      alert("Error in login...");  // Alert with the custom message
      navigate("/login", { replace: true });  // Redirect to login for reset (might need adjustment if "/login" isn't correct)
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chit-Chat</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <button>Sign in</button>
        </form>
        <p>You don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
