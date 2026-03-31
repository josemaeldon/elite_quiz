import { useSelector } from 'react-redux'
import { sysConfigdata } from '@/store/reducers/settingsSlice'
import { RenderHtmlContent, getImageSource, handleImageError, imgError, t, useOverflowRefs } from '@/utils'
import { Progress } from '@/components/ui/progress'

const QuestionMiddleSectionOptions = ({
  isClickedAnswer,
  questions,
  currentQuestion,
  setAnswerStatusClass,
  handleAnswerOptionClick,
  probability,
  latex,
  math,
  exam_latex
}) => {
  const { buttonRefA, buttonRefB, buttonRefC, buttonRefD, buttonRefE } = useOverflowRefs(questions, currentQuestion)
  const green = '#01BF7A'
  // condition for latex and exam latex
  const systemconfig = useSelector(sysConfigdata)
  const Latex = systemconfig.latex_mode === '1' ? true : false
  const condition = exam_latex == undefined ? Latex || math : exam_latex

  return (
    <>
      <div className="morphisam !mb-6 lg:flex gap-6">
        <div className="w-full lg:w-2/3 flex-center h-auto bg-white dark:bg-[#3c3555] dark:backdrop-blur-[32px] rounded-[10px] flex-col py-4 text-center px-2 mb-[10px]">
          <div className="question-text mb-3">
            {condition ? (
              <RenderHtmlContent
                htmlContent={questions[currentQuestion]?.question}
              />
            ) : (
              questions[currentQuestion]?.question
            )}
          </div>

          {questions[currentQuestion]?.image ? (

            <div className="w-full lg:w-2/3  m-auto flex-center pt-8">
              <img
                className="max-h-full max-w-full object-contain mb-[10px] rounded-[5px] h-[300px]"
                src={getImageSource(questions[currentQuestion].image)}
                onError={handleImageError}
                alt="Question Image"
              />
            </div>
          ) : (
            ""
          )}
        </div>

        {/* options */}
        <div className="w-full lg:w-1/3">
          <div className="lg:mr-0  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 ">
            {questions[currentQuestion].optiona ? (
              <div className=" ">
                <div className="optionButton">
                  <button
                    ref={buttonRefA}
                    className={` optionBtn  ${setAnswerStatusClass("a")}`}
                    onClick={(e) => handleAnswerOptionClick("a")}
                    disabled={isClickedAnswer ? isClickedAnswer : false}
                  >
                    <div className="flex flex-wrap break-words">
                      <div className=" flex align-baseline text-start gap-[10px] [&>div]:break-all text-text-color audioQuestion">
                        <span className="font-bold text-[20px] leading-[30px] text-primary-color whitespace-nowrap">
                          {t("a")}&nbsp;
                        </span>{" "}
                        {condition ? (
                          <RenderHtmlContent
                            htmlContent={questions[currentQuestion]?.optiona}
                          />
                        ) : (
                          questions[currentQuestion].optiona
                        )}
                      </div>
                    </div>
                  </button>
                </div>
                {probability ? (
                  <>
                    {questions[currentQuestion].probability_a ? (
                      <div className=" text-end mt-[-44px] z-10 relative">
                        {questions[currentQuestion].probability_a}
                        <div>
                          <Progress
                            color={green}
                            className="h-[10px] dark:!bg-white"
                            value={questions[
                              currentQuestion
                            ].probability_a.replace("%", "")}
                            visuallyHidden
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                ) : null}
              </div>
            ) : (
              ""
            )}
            {questions[currentQuestion].optionb ? (
              <div className="">
                <div className=" optionButton">
                  <button
                    ref={buttonRefB}
                    className={`optionBtn  ${setAnswerStatusClass("b")}`}
                    onClick={(e) => handleAnswerOptionClick("b")}
                    disabled={isClickedAnswer ? isClickedAnswer : false}
                  >
                    <div className="flex flex-wrap break-words ">
                      <div className="flex align-baseline text-start gap-[10px] [&>div]:break-all text-text-color audioQuestion">
                        <span className="font-bold text-[20px] leading-[30px] text-primary-color whitespace-nowrap">
                          {t("b")}&nbsp;
                        </span>{" "}
                        {condition ? (
                          <RenderHtmlContent
                            htmlContent={questions[currentQuestion]?.optionb}
                          />
                        ) : (
                          questions[currentQuestion].optionb
                        )}
                      </div>
                    </div>
                  </button>
                </div>
                {probability ? (
                  <>
                    {questions[currentQuestion].probability_b ? (
                      <div className="col text-end mt-[-44px] z-10 relative">
                        {questions[currentQuestion].probability_b}
                        <div>
                          <Progress
                            className="h-[10px] dark:!bg-white"
                            value={questions[
                              currentQuestion
                            ].probability_b.replace("%", "")}
                            visuallyHidden
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                ) : null}
              </div>
            ) : (
              ""
            )}
            {questions[currentQuestion].question_type === "1" ? (
              <>
                {questions[currentQuestion].optionc ? (
                  <div className="">
                    <div className="optionButton">
                      <button
                        ref={buttonRefC}
                        className={`optionBtn  ${setAnswerStatusClass("c")}`}
                        onClick={(e) => handleAnswerOptionClick("c")}
                        disabled={isClickedAnswer ? isClickedAnswer : false}
                      >
                        <div className="flex flex-wrap break-words ">
                          <div className="flex align-baseline text-start gap-[10px] [&>div]:break-all text-text-color audioQuestion">
                            <span className="font-bold text-[20px] leading-[30px] text-primary-color whitespace-nowrap">
                              {t("c")}&nbsp;
                            </span>{" "}
                            {condition ? (
                              <RenderHtmlContent
                                htmlContent={
                                  questions[currentQuestion]?.optionc
                                }
                              />
                            ) : (
                              questions[currentQuestion].optionc
                            )}
                          </div>
                        </div>
                      </button>
                    </div>
                    {probability ? (
                      <>
                        {questions[currentQuestion].probability_c ? (
                          <div className="col text-end mt-[-44px] z-10 relative">
                            {questions[currentQuestion].probability_c}
                            <div>
                              <Progress
                                className="h-[10px] dark:!bg-white"
                                value={questions[
                                  currentQuestion
                                ].probability_c.replace("%", "")}
                                visuallyHidden
                              />
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </>
                    ) : null}
                  </div>
                ) : (
                  ""
                )}
                {questions[currentQuestion].optiond ? (
                  <div className="">
                    <div className="optionButton">
                      <button
                        ref={buttonRefD}
                        className={`optionBtn  ${setAnswerStatusClass("d")}`}
                        onClick={(e) => handleAnswerOptionClick("d")}
                        disabled={isClickedAnswer ? isClickedAnswer : false}
                      >
                        <div className="flex flex-wrap break-words ">
                          <div className="flex align-baseline text-start gap-[10px] [&>div]:break-all text-text-color audioQuestion">
                            <span className="font-bold text-[20px] leading-[30px] text-primary-color whitespace-nowrap">
                              {t("d")}&nbsp;
                            </span>{" "}
                            {condition ? (
                              <RenderHtmlContent
                                htmlContent={
                                  questions[currentQuestion]?.optiond
                                }
                              />
                            ) : (
                              questions[currentQuestion].optiond
                            )}
                          </div>
                        </div>
                      </button>
                    </div>
                    {probability ? (
                      <>
                        {questions[currentQuestion].probability_d ? (
                          <div className="col text-end mt-[-44px] z-10 relative">
                            {questions[currentQuestion].probability_d}
                            <div>
                              <Progress
                                className="h-[10px] dark:!bg-white"
                                value={questions[
                                  currentQuestion
                                ].probability_d.replace("%", "")}
                                visuallyHidden
                              />
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </>
                    ) : null}
                  </div>
                ) : (
                  ""
                )}

                {questions[currentQuestion].optione ? (
                  <div className="">
                    <div className="">
                      <div className="optionButton">
                        <button
                          ref={buttonRefE}
                          className={`optionBtn  ${setAnswerStatusClass("e")}`}
                          onClick={(e) => handleAnswerOptionClick("e")}
                          disabled={isClickedAnswer ? isClickedAnswer : false}
                        >
                          <div className="flex flex-wrap break-words ">
                            <div className="flex align-baseline text-start gap-[10px] [&>div]:break-all text-text-color audioQuestion">
                              <span className="font-bold text-[20px] leading-[30px] text-primary-color whitespace-nowrap">
                                {t("e")}&nbsp;
                              </span>{" "}
                              {condition ? (
                                <RenderHtmlContent
                                  htmlContent={
                                    questions[currentQuestion]?.optione
                                  }
                                />
                              ) : (
                                questions[currentQuestion].optione
                              )}
                            </div>
                          </div>
                        </button>
                      </div>
                      {probability ? (
                        <>
                          {questions[currentQuestion].probability_e ? (
                            <div className="col text-end mt-[-44px] z-10 relative">
                              {questions[currentQuestion].probability_e}
                              <div>
                                <Progress
                                  className="h-[10px] dark:!bg-white"
                                  value={questions[
                                    currentQuestion
                                  ].probability_e.replace("%", "")}
                                  visuallyHidden
                                />
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </>
                      ) : null}
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
        </div>
      </div>
    </>
  );
}

export default QuestionMiddleSectionOptions
