import React, { useState } from "react"
import { resetPassword } from "../services/api"
import { useNavigate } from "react-router-dom"
import "../styles/auth.css"

const ResetPassword = () => {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleReset = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    if (newPassword.length < 8) {
      setError("⚠️ Password must be at least 8 characters.")
      setLoading(false)
      return
    }

    try {
      await resetPassword(email, otp, newPassword)
      setMessage("✅ Password reset successfully.")
      setTimeout(() => navigate("/login", { replace: true }), 1500)
    } catch (err) {
      const detail = err.response?.data?.detail
      if (Array.isArray(detail)) {
        // FastAPI validation errors come as an array of { loc, msg, type }
        setError(detail.map((d) => d.msg).join(" | "))
      } else if (typeof detail === "string") {
        setError(detail)
      } else {
        setError("❌ Reset failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Reset Password</h2>

        {typeof message === "string" && message && (
          <p style={{ color: "green" }}>{message}</p>
        )}
        {typeof error === "string" && error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="OTP Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password (min. 8 chars)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
