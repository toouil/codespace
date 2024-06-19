import React, { useEffect, useState } from "react";

export default function LoadingPost() {
    const [tags, setTags] = useState([]);
    const [content, setContent] = useState([]);

    useEffect(() => {
        const loop = Math.floor(Math.random() * (6 - 2 + 1) + 2);
        let i = 0;
        let tagsArr = [];

        while (i < loop) {
            tagsArr.push(i);
            i++;
        }

        setTags(tagsArr);
    }, []);

    useEffect(() => {
        const loop_ = Math.floor(Math.random() * (5 - 2 + 1) + 2);
        let i = 0;
        let contentArr = [];

        while (i < loop_) {
            contentArr.push(i);
            i++;
        }

        setContent(contentArr);
    }, []);

    const randomPadding = () => {
        const px = Math.floor(Math.random() * (60 - 30 + 1) + 30);
        const s = Math.random() * (2 - 1 + 1) + 1;
        return { padding: `11.5px ${px}px`, animationDelay: `-${s}s` };
    };

    return (
        <div className="post container post_loader">
            <div className="post_header">
                <div className="post_header_user">
                    <div className="user_picture"></div>

                    <div className="user_post_details">
                        <div className="post_details_username"></div>

                        <div className="post_details_date"></div>
                    </div>
                </div>
            </div>

            <div className="post_tags">
                {tags &&
                    tags.map((tag, index) => (
                        <div
                            key={index}
                            className="post_tag"
                            style={randomPadding()}
                        ></div>
                    ))}
            </div>

            <div className="post_content_">
                {content.map((ele, indexs) => (
                    <div
                        key={indexs}
                        style={{
                            animationDelay: randomPadding().animationDelay,
                        }}
                        className="post_content_div"
                    ></div>
                ))}
            </div>

            <div className="divider_x"></div>

            <div className="post_reactions">
                <button
                    className="like_reaction_btn content_center reaction_btn"
                    type="button"
                ></button>

                <button
                    className="comment_reaction_btn content_center reaction_btn"
                    type="button"
                ></button>
            </div>
        </div>
    );
}
