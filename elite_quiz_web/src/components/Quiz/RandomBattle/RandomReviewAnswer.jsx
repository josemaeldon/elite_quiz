import React, { useEffect, useState } from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { decryptAnswer, getImageSource, imgError, reportQuestion } from '@/utils'
import { useSelector } from 'react-redux'
import { t } from '@/utils'
function RandomReviewAnswer({ questions, goBack, reportquestions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [disablePrev, setDisablePrev] = useState(true)
  const [disableNext, setDisableNext] = useState(currentQuestion + 1 === questions?.length ? true : false)

  // store data get
  const userData = useSelector(state => state.User)

  const previousQuestion = () => {
    const prevQuestion = currentQuestion - 1
    if (prevQuestion >= 0) {
      if (prevQuestion > 0) {
        setDisablePrev(false)
      } else {
        setDisablePrev(true)
      }
      setDisableNext(false)
      setCurrentQuestion(prevQuestion)
    }
  }

  const nextQuestion = () => {
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questions?.length) {
      if (nextQuestion + 1 === questions?.length) {
        setDisableNext(true)
      } else {
        setDisableNext(false)
      }
      setDisablePrev(false)
      setCurrentQuestion(nextQuestion)
    }
  }

  const setAnswerStatusClass = option => {
    let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData?.data?.firebase_id)
    if (decryptedAnswer === option) {
      return 'bg-success'
    } else if (questions[currentQuestion].selected_answer === option) {
      return 'bg-danger'
    }
  }

  useEffect(() => {
    if (questions?.length <= 1) {
      setDisableNext(true)
      setDisablePrev(true)
    }
  }, [questions])
  return (
    <React.Fragment>
      <div className="morphisam flex-center !justify-between max-767:flex-wrap gap-1 max-767:gap-2 ">
        <div className="text-center">
          <h4 className="font-extrabold text-[32px] max-767:text-[22px]">
            {t("review_answers")}
          </h4>
        </div>
        <div className="flex-center gap-7">
          <div>
            <h5 className="p-[13px_24px] rounded-[50px] border-[2px] border-border mb-0 bordercolor dark:bg-[#3c3555]">
              {currentQuestion + 1} | {questions?.length}
            </h5>
          </div>
          {reportquestions ? (
            <div className="bg-[#09002921] text-center rounded-full p-[12px_10px_6px_10px] text-base ">
              <button
                title="Report Question"
                onClick={() => reportQuestion(questions[currentQuestion].id)}
              >
                <FaExclamationTriangle className="fa-2x" />
              </button>
            </div>
          ) : (
            false
          )}
        </div>
      </div>
      <div className="morphisam mb-6 lg:flex darkSecondaryColor">
        <div className="w-full lg:w-2/3 flex-center h-auto bg-white rounded-[10px]  flex-col py-4 text-center dark:bg-[#3c3555] mb-[10px]">
          <p>{questions[currentQuestion].question}</p>

          {questions[currentQuestion].image ? (
            <div className="w-full lg:w-2/3  m-auto flex-center max-991:px-3 pt-8">
              <img
                className="max-h-full max-w-full object-contain mb-[10px] rounded-[5px] h-[300px]"
                src={getImageSource(questions[currentQuestion].image)}
                onError={imgError}
                alt="Error Image"
              />
            </div>
          ) : (
            ""
          )}
        </div>

        <div className=" w-full lg:w-1/3">
          <div className=" mr-5 ml-5 lg:mr-0  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 ">
            {questions[currentQuestion].optiona ? (
              <div className="optionButton">
                <button className={`optionBtn ${setAnswerStatusClass("a")}`}>
                  {questions[currentQuestion].optiona}
                </button>
              </div>
            ) : (
              ""
            )}
            {questions[currentQuestion].optionb ? (
              <div className="optionButton">
                <button className={`optionBtn ${setAnswerStatusClass("b")}`}>
                  {questions[currentQuestion].optionb}
                </button>
              </div>
            ) : (
              ""
            )}
            {questions[currentQuestion].question_type === "1" ? (
              <>
                {questions[currentQuestion].optionc ? (
                  <div className="optionButton">
                    <button
                      className={`optionBtn ${setAnswerStatusClass("c")}`}
                    >
                      {questions[currentQuestion].optionc}
                    </button>
                  </div>
                ) : (
                  ""
                )}
                {questions[currentQuestion].optiond ? (
                  <div className="optionButton">
                    <button
                      className={`optionBtn ${setAnswerStatusClass("d")}`}
                    >
                      {questions[currentQuestion].optiond}
                    </button>
                  </div>
                ) : (
                  ""
                )}
                {questions[currentQuestion].optione ? (
                  <div className="row d-flex justify-content-center">
                    <div className="optionButton">
                      <button
                        className={`optionBtn ${setAnswerStatusClass("e")}`}
                      >
                        {/* <div className="row">
                                                <div className="col">{questions[currentQuestion].optione}</div>
                                                {questions[currentQuestion].probability_e ? <div className="col text-end">{questions[currentQuestion].probability_e}</div> : ""}
                                            </div> */}
                        {questions[currentQuestion].optione}
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </div>
          {!questions[currentQuestion].selected_answer ? (
            <div className="text-end">
              <span className="">*{t("not_att")}</span>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="flex justify-evenly">
        <div className="">
          <button
            className="reviewBtn"
            onClick={previousQuestion}
            disabled={disablePrev}
          >
            &lt;
          </button>
        </div>
        <div className="">
          <button className="reviewBtn" onClick={goBack}>
            {t("back")}
          </button>
        </div>
        <div className="">
          <button
            className="reviewBtn"
            onClick={nextQuestion}
            disabled={disableNext}
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="mb-14">
        <div className="flex flex-start mt-5 my-2 text-bold">
          {questions[currentQuestion].note ? (
            <>
              <span className="text-nowrap font-bold text-lg text-red-700">{t("note")} :- &nbsp; </span>{" "}
              <p
                className="text-lg"
                dangerouslySetInnerHTML={{
                  __html: questions[currentQuestion].note,
                }}
              ></p>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

RandomReviewAnswer.propTypes = {
  questions: PropTypes.array.isRequired,
  goBack: PropTypes.func
}

export default withTranslation()(RandomReviewAnswer)
