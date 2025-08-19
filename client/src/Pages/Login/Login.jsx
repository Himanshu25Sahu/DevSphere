 

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { login } from "../../Slices/authSlice.js"
import "./Login.css"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import Loader from "../../components/Loader/Loader.jsx"
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaRocket, FaUser } from "react-icons/fa"

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.user)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState("")

  const handleLogin = async (e, demoCredentials = null) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Modern toast for server wakeup
    toast(
      <div className="modern-toast">
        <div className="toast-icon-wrapper">
          <div className="toast-spinner"></div>
          <span className="toast-icon">🚀</span>
        </div>
        <div className="toast-content">
          <div className="toast-title">Waking up the server...</div>
          <div className="toast-subtitle">This may take up to 40 seconds. Thanks for your patience!</div>
        </div>
        <div className="toast-progress"></div>
      </div>,
      {
        duration: 6000,
        position: "top-center",
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
          transform: "translateX(-60px)",
        },
      },
    )

    demoCredentials = {
      email: import.meta.env.VITE_DEMO_EMAIL,
      password: import.meta.env.VITE_DEMO_PASSWORD
    }
    let credentials;
    if(email && password){
      credentials={email,password}
    }
    else{
      credentials=demoCredentials
    }
    
    
    try {
      const result = await dispatch(login(credentials)).unwrap()
      if (result) {
              if (result.token) {
        localStorage.setItem('fallbackToken', result.token);
      }
        toast.success("Login Successful", {
          style: {
            background: "linear-gradient(135deg, #7c78eb 0%, #605dd3 100%)",
            color: "white",
            border: "1px solid rgba(124, 120, 235, 0.3)",
            borderRadius: "12px",
            padding: "16px 20px",
            fontSize: "16px",
            fontWeight: "500",
            boxShadow: "0 8px 32px rgba(124, 120, 235, 0.3)",
          },
          iconTheme: {
            primary: "white",
            secondary: "#7c78eb",
          },
        })
        // console.log(result, "latest update 6.50")
        navigate("/post")
      }
    } catch (err) {
      toast.error(err || "Login failed. Please check your credentials.", {
        style: {
          background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
          color: "white",
          border: "1px solid rgba(255, 107, 107, 0.3)",
          borderRadius: "12px",
          padding: "16px 20px",
          fontSize: "16px",
          fontWeight: "500",
          boxShadow: "0 8px 32px rgba(255, 107, 107, 0.3)",
        },
        iconTheme: {
          primary: "white",
          secondary: "#ff6b6b",
        },
      })
      console.error("LOGIN.JSX ERROR: ", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = (e) => {
    const demoCredentials = {
      email: import.meta.env.VITE_EMAIL,
      password: import.meta.env.VITE_PASSWORD,
    }
    handleLogin(e, demoCredentials)
  }

  return (
    <div className="login-page">
      <div className="login-background">
        
      </div>
      
      <div className="login-container">
        <div className="login-header">
          <div className="logo-section">
            <div className="logo-icon">
              <FaRocket />
            </div>
            <h1 className="login-title">
              Welcome <span className="title-accent">Back</span>
            </h1>
            <p className="login-subtitle">Sign in to continue your journey</p>
          </div>
        </div>

        {/* {loading && <Loader />} */}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-container">
            <div className={`form-group ${focusedField === 'email' ? 'focused' : ''} ${email ? 'filled' : ''}`}>
              <label className="form-label">
                <FaEnvelope className="label-icon" />
                <span>Email Address</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Enter your email"
                  required
                  className="form-input"
                />
                <div className="input-border"></div>
              </div>
            </div>

            <div className={`form-group ${focusedField === 'password' ? 'focused' : ''} ${password ? 'filled' : ''}`}>
              <label className="form-label">
                <FaLock className="label-icon" />
                <span>Password</span>
              </label>
              <div className="input-wrapper password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Enter your password"
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <div className="input-border"></div>
              </div>
            </div>
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="login-button primary-button" 
              disabled={isSubmitting || loading}
            >
              <span className="button-content">
                {isSubmitting || loading ? (
                  <>
                    <div className="button-spinner"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <FaUser className="button-icon" />
                    <span>Sign In</span>
                  </>
                )}
              </span>
              <div className="button-glow"></div>
            </button>

            <button
              type="button"
              className="login-button demo-button"
              onClick={handleDemoLogin}
              disabled={isSubmitting || loading}
            >
              <span className="button-content">
                {isSubmitting || loading ? (
                  <>
                    <div className="button-spinner"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <FaRocket className="button-icon" />
                    <span>Try Demo</span>
                  </>
                )}
              </span>
              <div className="button-glow"></div>
            </button>
          </div>

          <div className="form-footer">
            <div className="divider">
              <span className="divider-text">New here?</span>
            </div>
            <p className="register-text">
              Don't have an account?{" "}
              <Link to="/register" className="register-link">
                Create one now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
