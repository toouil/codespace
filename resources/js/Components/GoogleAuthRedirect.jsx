import { Google } from "@/assets/icons";

export default function GoogleAuthRedirect() {
    const googleAuthRedirect = () => {
        window.open(route("auth.google"), "_self")
    }

  return (
    <div className="auth_with_google w_100">
        <button
            className="google_auth_btn w_100 content_center"
            onClick={googleAuthRedirect}
        >
            <span className="google_auth_btn_logo">
                <Google />
            </span>
            <span className="google_auth_btn_text">
                Continue with Google
            </span>
        </button>
    </div>
  )
}
