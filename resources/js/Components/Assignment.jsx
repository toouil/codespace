export default function Assignment({ assignment, timeOver, setCheckedAnswer }) {
    const { question, code, answers } = assignment;

    const handleCheck = ({ target: { checked } }, id) => {
        if (checked) {
            setCheckedAnswer(id);
        }
    };

    return (
        <div className="assignment_container">
            <div className="assignment_question">
                <h2 className="assignment_question_text">
                    {question}
                </h2>
            </div>

            {code && <div className="assignment_code">{code}</div>}

            <div className="assignment_answers">
                {answers &&
                    answers.map(({ answer, id }) => (
                        <div className="assignment_answer" key={id}>
                            <label htmlFor={id} className="content_center">
                                <input
                                    type="radio"
                                    onChange={(e) => handleCheck(e, id)}
                                    id={id}
                                    name="assignment answer"
                                    disabled={timeOver}
                                />
                                {answer}
                            </label>
                        </div>
                    ))}
            </div>
        </div>
    );
}

function shuffleArray(array) {
    let copyArray = [...array];
    let shuffledArray = [];
    let getRandomIndex = Math.round(Math.random() * copyArray.length - 1);

    while (copyArray.length > 0) {
        const getItem = copyArray.splice(getRandomIndex, 1);
        shuffledArray.push(getItem[0]);
        getRandomIndex = parseInt(Math.random() * copyArray.length - 1);
    }

    return shuffledArray;
}
