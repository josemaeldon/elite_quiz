import { useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { imgError, t, useOverflowRefs } from "@/utils/index";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import Image from "next/image";
import { MdDragHandle } from "react-icons/md";

const SelectQuestionMiddleSection = ({
  checkAnswer,
  questions,
  currentQuestion,
  setAnswerStatusClass,
  handleAnswerOptionClick,
  isClickedAnswer,
  isAnswerd,
  nextQuestion,
  rightWrongIcon,
  isSelectAns,
  arrangedOptions,
  decryptedAnswers,
}) => {
  const { buttonRefA, buttonRefB, buttonRefC, buttonRefD, buttonRefE } =
    useOverflowRefs(questions, currentQuestion);

  // condition for latex and exam latex
  const systemconfig = useSelector(sysConfigdata);
  // const Latex = systemconfig.latex_mode === "1" ? true : false
  // const condition = exam_latex == undefined ? (Latex || math) : exam_latex
  const [totalOptions, setTotalOptions] = useState();

  const defaultOptions = [
    { option: "optiona", ref: buttonRefA, opt: "a" },
    { option: "optionb", ref: buttonRefB, opt: "b" },
    { option: "optionc", ref: buttonRefC, opt: "c" },
    { option: "optiond", ref: buttonRefD, opt: "d" },
    { option: "optione", ref: buttonRefE, opt: "e" },
  ];
  const [options, setOptions] = useState(defaultOptions);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    let totalOpt = options.filter(
      (option) => questions[currentQuestion][option.option] !== ""
    );

    const items = Array.from(totalOpt);

    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setOptions(items);
    let selectSequence = items.map((item) => item.opt);
    arrangedOptions(selectSequence);
  };
  useEffect(() => {
    let totalOpt = options.filter(
      (option) => questions[currentQuestion][option.option]
    ).length;

    setTotalOptions(totalOpt);
  }, []);
  useEffect(() => {
    const filteredOptions = defaultOptions.filter(
      (option) =>
        questions[currentQuestion]?.[option.option] &&
        questions[currentQuestion][option.option] !== ""
    );
    setOptions(filteredOptions);
  }, [currentQuestion, questions]);

  return (
    <>
      <div className="morphisam mb-4 lg:flex flex-wrap darkSecondaryColor">
        <div className="mb-2 ">
          {questions[currentQuestion]?.answer_type == "1"
            ? t("multi_select")
            : t("arrange")}
        </div>

        <div className="flex justify-center lg:justify-normal flex-wrap lg:flex-nowrap w-full gap-6">
          <div className="w-full lg:w-2/3 flex-center h-auto bg-white rounded-[10px] mb-[20px] flex-col px-1 py-4 text-center darkSecondaryColor">
            <p className="question-text">
              {questions[currentQuestion]?.question}
            </p>

            {questions[currentQuestion]?.image ? (
              <div className="col-12 col-lg-8 imagedash w-full h-full px-10">
                <Image
                  className="w-full h-full mx-auto object-cover aspect-square rounded-lg"
                  width={0}
                  height={0}
                  src={questions[currentQuestion].image}
                  onError={imgError}
                  alt="question image"
                />
              </div>
            ) : (
              ""
            )}
          </div>

          {/* options */}
          <div className="w-full lg:w-1/3">
            <div className="mr-5 ml-5 lg:mr-0 mb-4">
              {isSelectAns ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-5">
                  {options.map((option, index) => {
                    // Check if the option exists
                    if (questions[currentQuestion][option.option]) {
                      return (
                        <button
                          key={index}
                          ref={option.ref}
                          className={`btn button__ui relative bg-white dark:bg-[#3c3555] w-100 ${setAnswerStatusClass(
                            option.opt
                          )} border-[2px] border-transparent font-bold text-[20px] leading-[30px] text-primary-color whitespace-nowrap flex items-center justify-between rounded-lg
                                                            `}
                          onClick={() => handleAnswerOptionClick(option.opt)}
                          disabled={isClickedAnswer || isAnswerd}
                        >
                          <div className="optionBtn">
                            <span className="optionIndex">
                              {t(option.opt)}&nbsp;
                            </span>
                            <span className="text-wrap text-start">
                              {questions[currentQuestion][option.option]}
                            </span>
                          </div>
                          {rightWrongIcon(option.opt) && (
                            <div className="right_wrong_ans_icon p-4">
                              {rightWrongIcon(option.opt)}
                            </div>
                          )}
                        </button>
                      );
                    } else {
                      return null; // Skip rendering if the option doesn't exist
                    }
                  })}
                </div>
              ) : (
                <div className="mb-4">
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="options">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          // className="sm:grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-3"
                        >
                          {options.map((option, index) => {
                            const optionContent =
                              questions[currentQuestion]?.[option.option];

                            if (!optionContent) {
                              return null;
                            }

                            return (
                              <Draggable
                                key={option.opt}
                                draggableId={option.opt || `option-${index}`}
                                index={index}
                                isDragDisabled={isAnswerd}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`${setAnswerStatusClass(
                                      option.opt
                                    )} bg-white dark:border-[#3c3555] mb-6 w-full border rounded-lg dark:!bg-[#3c3555]`}
                                    disabled={isClickedAnswer}
                                  >
                                    <div
                                      ref={option.ref}
                                      className={`flex justify-between items-start w-full rounded-lg p-6 relative`}
                                      onClick={() =>
                                        handleAnswerOptionClick(option.opt)
                                      }
                                      disabled={isClickedAnswer}
                                    >
                                      <div className="w-full px-2 flex text-start items-baseline gap-2.5 font-bold rounded-lg break-words text-[17px]">
                                        <span className="optionIndex text-primary-color">
                                          {t(option.opt)}&nbsp;
                                        </span>
                                        {
                                          questions[currentQuestion][
                                            option.option
                                          ]
                                        }
                                      </div>
                                      <div className="right_wrong_ans_icon top-[50%] translate-y-[-50%] p-4">
                                      <MdDragHandle className="right_wrong_ans" />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )}
            </div>
            {/* <div className='col-12 col-md-6 col-lg-12'> */}
            <div className="arrangeSubmitBtn flex justify-center items-center mb-[10px] ">
              <button
                ref={buttonRefE}
                className="  darkSecondaryColor w-[244px] h-[56px] text-text-color bg-[var(--background-2)] border-0 rounded-lg hover:cursor-pointer p-4 hover:!bg-primary-color hover:text-white transition-all duration-500 ease-in hover:border-transparent"
                onClick={() => (isAnswerd ? nextQuestion() : checkAnswer())}
                disabled={isClickedAnswer ? isClickedAnswer : false}
              >
                {questions?.length == currentQuestion + 1 && isAnswerd
                  ? t("submit")
                  : isAnswerd
                  ? t("next")
                  : t("check")}
              </button>
              {/* </div> */}
            </div>
          </div>
        </div>
        <div>
          {isAnswerd && (
            <span>
              {t("correct_answer_is")} : {decryptedAnswers.join(",")}
            </span>
          )}
        </div>
      </div>
      {/* <div className="text-center review-answer-data">
                <small className="review-latext-note flex flex-col sm:flex-row justify-center items-center my-5">
                    {questions[currentQuestion]?.note ?
                        <><span className="">{t("note")} :- &nbsp; </span>{systemconfig.latex_mode === "1" ? <p className="mb-0"><RenderHtmlContent htmlContent={questions[currentQuestion]?.note} /></p> : <p dangerouslySetInnerHTML={{ __html: questions[currentQuestion]?.note }}></p>}</>
                        :
                        ""
                    }
                </small>
            </div> */}
    </>
  );
};

export default SelectQuestionMiddleSection;
