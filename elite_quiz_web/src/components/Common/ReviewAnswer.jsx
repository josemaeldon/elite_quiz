'use client'
import React, { useEffect, useState } from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { RenderHtmlContent, decryptAnswer, getImageSource, handleBookmarkClick, imgError, reportQuestion } from '@/utils'
import { useSelector } from 'react-redux'
import { sysConfigdata } from '@/store/reducers/settingsSlice'
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine } from 'react-icons/ri'
import { t } from '@/utils'

import Bookmark from './Bookmark'

const ReviewAnswer = ({ questions, goBack, reportquestions, showLevel, latex, showBookmark }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [disablePrev, setDisablePrev] = useState(true)
  const [disableNext, setDisableNext] = useState(false)

  const systemconfig = useSelector(sysConfigdata)

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
    let decryptedAnswer = decryptAnswer(questions[currentQuestion]?.answer, userData?.data?.id)
    if (decryptedAnswer === option) {
      return 'bg-success'
    } else if (questions[currentQuestion].selected_answer === option) {
      return 'bg-danger'
    }
  }
useEffect(() => {
  if(questions?.length <= 1){
    setDisableNext(true)
    setDisablePrev(true)
  }
},[questions])
  return (
    <>
      <div className="morphisam flex-center !justify-between max-991:flex-col  max-991:gap-5 darkSecondaryColor">
        {showLevel ? (
          <div className="coins">
            <div className="">
              <span>
                {t("level")} : {questions[currentQuestion]?.level}
              </span>
            </div>
          </div>
        ) : null}

        <div className="text-center ">
          <h4 className="font-extrabold text-[32px] max-767:text-[22px] ">
            {t("review_answers")}
          </h4>
        </div>

        <div className="flex-center gap-7">
          <div className="">
            <h5 className="p-[13px_24px] rounded-[50px] border-[2px] border-border mb-0 bordercolor dark:bg-[#3c3555]">
              {currentQuestion + 1} - {questions?.length}
            </h5>
          </div>

          {showBookmark ? (
            <div className="bg-[var(--background-2)] dark:bg-[#3c3555] text-center rounded-full h-[56px] w-[56px] flex-center text-base	">
              <Bookmark
                id={questions[currentQuestion].id}
                onClick={handleBookmarkClick}
                type={"1"}
              />
            </div>
          ) : (
            ""
          )}

          {reportquestions ? (
            <div className="bg-[var(--background-2)] dark:bg-[#3c3555] text-center rounded-full h-[56px] w-[56px] flex-center text-base	 ">
              <button
                title="Report Question"
                className=""
                onClick={() => reportQuestion(questions[currentQuestion]?.id)}
              >
                <FaExclamationTriangle className="h-[24px] w-[24px]" />
              </button>
            </div>
          ) : (
            false
          )}
        </div>
      </div>
      <div className="morphisam mb-6 lg:flex darkSecondaryColor">
        <div className="w-full lg:w-2/3 flex-center h-auto bg-white rounded-[10px]  flex-col py-4 text-center dark:bg-[#3c3555] mb-[10px] lg:mb-0">
          <p>
            {systemconfig.latex_mode === "1" ? (
              <RenderHtmlContent
                htmlContent={questions[currentQuestion]?.question}
              />
            ) : (
              questions[currentQuestion]?.question
            )}
          </p>

          {questions[currentQuestion]?.image ? (
            <div className="w-full lg:w-2/3  m-auto flex-center max-991:px-3 pt-8">
              <img
                className="max-h-full max-w-full object-contain mb-[10px] rounded-[5px] h-[300px]"
                src={getImageSource(questions[currentQuestion]?.image)}
                onError={imgError}
                alt="Error Image"
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="w-full lg:w-1/3">
          <div className="mr-5 ml-5 lg:mr-0  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3  ">
            {questions[currentQuestion]?.optiona ? (
              <div className="optionButton">
                <button className={`optionBtn ${setAnswerStatusClass("a")}`}>
                  {systemconfig.latex_mode === "1" ? (
                    <RenderHtmlContent
                      htmlContent={questions[currentQuestion]?.optiona}
                    />
                  ) : (
                    questions[currentQuestion]?.optiona
                  )}
                </button>
              </div>
            ) : (
              ""
            )}
            {questions[currentQuestion]?.optionb ? (
              <div className="optionButton">
                <button className={`optionBtn ${setAnswerStatusClass("b")}`}>
                  {systemconfig.latex_mode === "1" ? (
                    <RenderHtmlContent
                      htmlContent={questions[currentQuestion]?.optionb}
                    />
                  ) : (
                    questions[currentQuestion]?.optionb
                  )}
                </button>
              </div>
            ) : (
              ""
            )}
            {questions[currentQuestion]?.question_type === "1" ? (
              <>
                {questions[currentQuestion]?.optionc ? (
                  <div className="optionButton">
                    <button
                      className={`optionBtn ${setAnswerStatusClass("c")}`}
                    >
                      {systemconfig.latex_mode === "1" ? (
                        <RenderHtmlContent
                          htmlContent={questions[currentQuestion]?.optionc}
                        />
                      ) : (
                        questions[currentQuestion]?.optionc
                      )}
                    </button>
                  </div>
                ) : (
                  ""
                )}
                {questions[currentQuestion]?.optiond ? (
                  <div className="optionButton">
                    <button
                      className={`optionBtn ${setAnswerStatusClass("d")}`}
                    >
                      {systemconfig.latex_mode === "1" ? (
                        <RenderHtmlContent
                          htmlContent={questions[currentQuestion]?.optiond}
                        />
                      ) : (
                        questions[currentQuestion]?.optiond
                      )}
                    </button>
                  </div>
                ) : (
                  ""
                )}
                {questions[currentQuestion]?.optione ? (
                  <div className="row d-flex justify-content-center">
                    <div className="optionButton">
                      <button
                        className={`optionBtn ${setAnswerStatusClass("e")}`}
                      >
                        <div className="row">
                          <div className="col">
                            {systemconfig.latex_mode === "1" ? (
                              <RenderHtmlContent
                                htmlContent={
                                  questions[currentQuestion]?.optione
                                }
                              />
                            ) : (
                              questions[currentQuestion]?.optione
                            )}
                          </div>
                        </div>
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
          {!questions[currentQuestion]?.selected_answer ? (
            <div className="text-end">
              <span className="">*{t("not_att")}</span>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {/* <div className='divider'>
                <hr style={{ width: '112%', backgroundColor: 'gray', height: '2px' }} />
            </div> */}

      <div className="flex justify-evenly">
        <div className="">
          <button
            className="reviewBtn"
            onClick={previousQuestion}
            disabled={disablePrev}
          >
            <RiArrowLeftDoubleLine size={25} />
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
            <RiArrowRightDoubleLine size={25} />
          </button>
        </div>
      </div>
      <div className="text-center ">
        <div className="flex flex-start mt-5 my-2 text-bold">
          {questions[currentQuestion]?.note ? (
            <>
              <span className="text-nowrap font-bold text-lg text-red-700">{t("note")} :- &nbsp; </span>
              {systemconfig.latex_mode === "1" ? (
                <p className="mb-0 text-lg">
                  <RenderHtmlContent
                    htmlContent={questions[currentQuestion]?.note}
                  />
                </p>
              ) : (
                <p
                  className="mb-0 text-lg"
                  dangerouslySetInnerHTML={{
                    __html: questions[currentQuestion]?.note,
                  }}
                ></p>
              )}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

ReviewAnswer.propTypes = {
  questions: PropTypes.array.isRequired,
  goBack: PropTypes.func,
}

export default withTranslation()(ReviewAnswer)
