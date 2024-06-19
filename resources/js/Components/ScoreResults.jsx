import { Head, Link } from "@inertiajs/react";

export default function ScoreResults({ results }) {
    const { passed, badge, name, message, score, oldscore, action } =
        results?.data;

    return (
        <>
            <Head title={"Score result - " + score + " points"} />
            <main className="score_results_container content_center">
                <div className="score_results">
                    <div className="score_results_header">
                        <h1 className="score_results_header_title">
                            Score result
                        </h1>
                    </div>
                    <div className="score_results_content">
                        <div className="score_results_content_passed">
                            {passed ? (
                                <h3 className="success">You passed the test</h3>
                            ) : (
                                <h3 className="failed">
                                    Sorry ... you didn't pass the test
                                </h3>
                            )}
                        </div>

                        <div className="score_results_content_score">
                            <h1>
                                You got
                                <span className="score_points">{score}</span>
                                points
                            </h1>
                        </div>

                        {!!passed && action != "none" && (
                            <div className="score_results_content_badge">
                                <div className="bagde_display">
                                    <img src={badge} alt={`${name}_badge`} />
                                </div>
                                <div className="bagde_title">
                                    You've earned a
                                    <span className="bold_text">{name}</span>'s
                                    badge
                                </div>
                            </div>
                        )}

                        <div className="score_results_message">
                            {action == "update" ? (
                                <p>
                                    {message} from
                                    <span className="score_points">
                                        {oldscore}
                                    </span>
                                    to
                                    <span className="score_points">
                                        {score}
                                    </span>
                                    points`
                                </p>
                            ) : (
                                <p>{message}</p>
                            )}
                        </div>
                    </div>
                    <div className="score_results_footer">
                        <Link
                            href="/categories"
                            className="back_link content_center"
                        >
                            Back to categories
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}
