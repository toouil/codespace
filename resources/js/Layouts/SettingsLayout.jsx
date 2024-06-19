import { Link } from "@inertiajs/react";
import '@/styles/settings.css';

export default function SettingsLayout({ children }) {
    return (
        <div className="settings_page">
            <div className="settings_header">
                <div className="settings_item">
                    <Link
                        href="profile"
                        className="settings_item_inner content_center"
                    >
                        Profile settings
                    </Link>
                </div>
                <div className="settings_item">
                    <Link
                        href="account"
                        className="settings_item_inner content_center"
                    >
                        Account settings
                    </Link>
                </div>
            </div>

            <div className="settings_content">
                { children }
            </div>
        </div>
    );
}
