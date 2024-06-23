import GoogleAuthRedirect from "@/Components/GoogleAuthRedirect";
import { Logo } from "@/assets/icons";
import "@/styles/auth.css"

export default function Guest({ children }) {
    return (
        <main className="auth_page content_center">
            <div className="auth_container content_center">
                <div className="logo_section">
                    <Logo />
                </div>
                {children}

                <div className="or_section content_center">
                    <span className="divider_x"></span>
                    <span className="or">or</span>
                    <span className="divider_x"></span>
                </div>

                <GoogleAuthRedirect />
            </div>
        </main>
    );
}
