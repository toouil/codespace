import "@/styles/notFound.css";

export default function NotFound({ text = "Not found" }) {
    return (
        <div className="notFound">
            <div className="image_container">
                <img
                    src="https://res.cloudinary.com/zakaria-touil-ml/image/upload/v1717349079/codespace/dm1jy5tc1tlkjebinkeg.gif"
                    alt="lost john travolta"
                />
            </div>
            <div className="text_container">{text}</div>
        </div>
    );
}
