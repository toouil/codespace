import { Head, Link } from "@inertiajs/react";
import "@/styles/categories.css";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Categories({ auth, categories }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Assignments categories" />
            <main className="categories_page">
                <div className="categories_title">
                    <h2>Select a category :</h2>
                </div>

                <div className="categories_container">
                    {categories.map((category, index) => (
                        <div
                            className="category_container container"
                            key={index}
                        >
                            <Link
                                href={"/categories/" + category?.name}
                                className="category_link content_center"
                            >
                                <div className="category_name">
                                    <h3>{category?.name}</h3>
                                </div>
                                <div className="category_logo">
                                    <img
                                        src={category?.logo}
                                        alt="category_logo"
                                    />
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
