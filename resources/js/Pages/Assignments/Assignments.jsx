import { useEffect, useState } from "react";
import Assignment from "@/Components/Assignment";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import "@/styles/assignments.css";
import Loader from "@/Components/Loader";
import useCountdown from "@/hooks/useCountdown";
import useApi from "@/hooks/useApi";
import ScoreResults from "@/Components/ScoreResults";
import { notify_error } from "@/Components/Notify";
import { Helmet } from "react-helmet";

export default function Assignments({ auth, assignments, category }) {
    const { formattedCountdown, isTimeOut, stopCountdown, resetCountdown } =
        useCountdown(60);

    const { data, setData, postRequest, success, response, fetching } = useApi({
        dataTemplate: {
            category,
            answers: [],
        },
        onSuccess: (res) => {
            if (res?.status != 200) {
                notify_error("Something went wrong .. please try later")
            }
        }
    });

    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [checkedAnswer, setCheckedAnswer] = useState(null);
    const [submit, setSubmit] = useState(false);

    const isLastAssignment = currentIndex >= assignments.length - 1;

    const handleNext = (e) => {
        e.preventDefault();
        setData("answers", [...data?.answers, checkedAnswer]);
        stopCountdown();
        setCheckedAnswer(null);

        if (isLastAssignment) {
            handleSubmit();
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleSubmit = () => {
        setSubmit(true);
        postRequest(route("scores.store"), {
            answers: [...data?.answers, checkedAnswer],
        });
    };

    useEffect(() => {
        setCurrentAssignment(assignments[currentIndex]);
        resetCountdown();
    }, [currentIndex]);

    if (success && response?.status == 200) {
        return <ScoreResults results={response} />;
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Helmet>
                <title>{`${category}'s assignments`} | CodeSpace</title>
            </Helmet>

            <div className="assignments_page">
                <form className="assignments_container container">
                    <div className="assignments_header content_center">
                        <h3 className="assignments_category">{`${category}'s assignment`}</h3>
                    </div>

                    <div className="divider_x"></div>

                    <div className="assignments_content">
                        {currentAssignment && (
                            <Assignment
                                key={currentIndex}
                                assignment={currentAssignment}
                                setCheckedAnswer={setCheckedAnswer}
                                timeOver={isTimeOut}
                            />
                        )}
                    </div>

                    <div className="assignments_progress_bar">
                        {assignments && currentIndex >= 0 && (
                            <div
                                className="assignments_progress_bar_inner"
                                style={{
                                    "--width": `${
                                        ((currentIndex + 1) /
                                            assignments.length) *
                                        100
                                    }%`,
                                }}
                            ></div>
                        )}
                    </div>

                    <div className="assignments_footer">
                        <div className="assignments_footer_left_part content_center">
                            <div className="assignments_count">
                                {assignments &&
                                    currentIndex >= 0 &&
                                    `Q${currentIndex + 1} / ${
                                        assignments.length
                                    }`}
                            </div>

                            <div className="assignments_timer">
                                {formattedCountdown}
                            </div>
                        </div>

                        <div className="assignments_footer_right_part">
                            <div className="next_assignments">
                                <button
                                    className="next_assignment_btn content_center"
                                    disabled={
                                        !(
                                            (checkedAnswer || isTimeOut) &&
                                            !submit
                                        )
                                    }
                                    type="button"
                                    onClick={handleNext}
                                >
                                    {isLastAssignment ? "submit" : "next"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {fetching && <Loader />}
            </div>
        </AuthenticatedLayout>
    );
}
