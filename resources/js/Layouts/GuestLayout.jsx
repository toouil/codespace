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
            </div>
        </main>
    );
}
