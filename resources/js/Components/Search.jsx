import { SearchIcon } from "@/assets/icons";
import "@/styles/search.css";

export default function Search({ name }) {
    const searchString = window.location.search;
    const urlParams = new URLSearchParams(searchString);
    const paramValue = urlParams.get("query") || "";

    return (
        <div className="search container">
            <form className="search_form" method="GET" action={route(name)}>
                <input
                    type="search"
                    className="search_input"
                    placeholder="Search"
                    required
                    name="query"
                    defaultValue={paramValue}
                />
                <button type="submit" className="search_btn content_center">
                    <SearchIcon />
                </button>
            </form>
        </div>
    );
}
