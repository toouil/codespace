import { Head, Link } from "@inertiajs/react";
import { profilePictureFormatter } from "@/global/Functions";
import useApi from "@/hooks/useApi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useState } from "react";
import Loader from "@/Components/Loader";
import NotFound from "@/Components/NotFound";
import "@/styles/leaderboard.css";
import { Helmet } from "react-helmet";

function Page({ categories }) {
    const [response, setResponse] = useState(null)

    const changeCategory = (e) => {
        setData("category", JSON.parse(e.target.value));
    };

    const {
        data,
        setData,
        getRequest,
        fetched,
        fetching
    } = useApi({
        dataTemplate: { category: categories[0] },
        onSuccess: (res) => {
            if (res?.status == 200) {
                setResponse(res?.data)
            }
        }
    });

    useEffect(() => {
        if (categories) {
            getRequest(route("scores.get"), { category: data?.category?.name })
        }
    }, [data])


    return (
        <>
            <div className="leaderboard_page">
                <div className="leaderboard_header">
                    <div className="leaderboard_header_left_part">
                        <h1 className="leaderboard_title">Leaderboard</h1>
                    </div>
                    <div className="leaderboard_header_right_part">
                        <select
                            onChange={(e) => changeCategory(e)}
                            name="score_category"
                            id="score_category"
                            defaultValue={data?.category?.name}
                            className="container"
                        >
                            {categories &&
                                categories.map((category, index) => (
                                    <option
                                        key={index}
                                        value={JSON.stringify(category)}
                                        defaultValue={category?.name.toLowerCase() == data?.category?.name.toLowerCase()}
                                    >
                                        {category?.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                <div className="leaderboard_scores">
                    {response &&
                        response?.scores.map((score, index) => (
                            <div
                                className={`leaderboard_score_container container rank_${
                                    score?.rank
                                }${
                                    response?.userscore?.id ==
                                    score?.id
                                        ? " user_score"
                                        : ""
                                }`}
                                key={index}
                            >
                                <div className="rand_and_info">
                                    <div className="score_rank">
                                        <p>{score?.rank}</p>
                                    </div>
                                    <div className="score_user_info content_center">
                                        <Link
                                            href={`/profile/${score?.username}`}
                                            className="user_img_link"
                                        >
                                            <img
                                                src={
                                                    score?.picture
                                                }
                                                alt={score?.username}
                                            />
                                        </Link>
                                        <Link
                                            href={`/profile/${score?.username}`}
                                            className="user_name_link"
                                        >
                                            {score?.username}
                                        </Link>{" "}
                                        {response?.userscore?.id ==
                                            score?.id && (
                                            <span className="you">
                                                {"(You)"}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="score_pointes">
                                    {(!!score?.passed ) && <img src={data.category.profile_badge} alt="score baadge" />}
                                    <p>{score?.score}</p>
                                </div>
                            </div>
                        ))}
                </div>

                {(!response?.userscore && fetched) && (
                    <div className="leaderboard_didnt_passtest container">
                        <div className="didnt_passtest_message">
                            <p>You haven't passed the test yet</p>
                            <Link
                                href={`/categories/${data?.category?.name}`}
                                className="passtest_link content_center"
                            >{`Start ${data?.category?.name} test`}</Link>
                        </div>
                    </div>
                )}
            </div>

            {fetching && <Loader text="Loading scores ..." />}
        </>
    );
}



export default function Leaderboard ({ auth, categories }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Helmet>
                <title>Leaderboard | CodeSpace</title>
            </Helmet>
            { (categories && categories.length > 0) ? <Page categories={categories} /> : <NotFound text="No categories found to get scores" />} 
        </AuthenticatedLayout>
    )
}