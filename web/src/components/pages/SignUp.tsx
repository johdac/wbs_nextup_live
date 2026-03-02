import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../ui/LogoutButton";
import LoginButton from "../ui/LoginButton";
import { Profile } from "../ui/Profile";

export default function SignUp() {
  const { isAuthenticated, isLoading, error } = useAuth0();

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading-state">
          <div className="loading-text">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-state">
          <div className="error-title">Oops!</div>
          <div className="error-message">Something went wrong</div>
          <div className="error-sub-message">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="main-card-wrapper">
        <div className="text-2xl font-black italic tracking-tighter">
          NextUp Live<span className="not-italic ml-1">✦</span>
        </div>
        <h1 className="main-title">Welcome to NextUp Live</h1>

        {isAuthenticated ? (
          <div className="logged-in-section">
            <div className="logged-in-message">Successfully authenticated!</div>
            <Profile />
            <LogoutButton />
          </div>
        ) : (
          <div className="action-card">
            <p className="action-text">Get started by signing in to your account</p>
            <LoginButton />
          </div>
        )}
      </div>
    </div>
  );
}
