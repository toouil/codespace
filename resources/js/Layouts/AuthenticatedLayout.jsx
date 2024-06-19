import NavBar from "@/Components/NavBar";
import SideBar from "@/Components/SideBar";
import "@/styles/homelayout.css"

export default function AuthenticatedLayout({ user, children }) {
    return (
        <>
            <NavBar user={user} />
            <main className="home_layout_page w_100">
                <SideBar />
                {children}
            </main>
        </>
    );
}