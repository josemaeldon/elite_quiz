"use client"
import React, { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { RenderHtmlContent, decryptAnswer, getImageSource, handleBookmarkClick, imgError, reportQuestion, useOverflowRefs } from "@/utils/index";
import { useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine } from "react-icons/ri";
import { t } from "@/utils";

import Bookmark from "../../Common/Bookmark.jsx";
import rightTickIcon from '@/assets/images/check-circle-score-screen.svg'
import crossIcon from '@/assets/images/x-circle-score-screen.svg'
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import Image from "next/image";


const MultiMatchReviewAnswer = ({ questions, goBack, reportquestions, showLevel, latex, showBookmark, isMulti }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [disablePrev, setDisablePrev] = useState(true);
    const [disableNext, setDisableNext] = useState(currentQuestion + 1 === questions?.length ? true : false);
    const [decryptedAnsArr, setDecryptedAnswers] = useState([])
    const { buttonRefA, buttonRefB, buttonRefC, buttonRefD, buttonRefE } = useOverflowRefs(questions, currentQuestion);
    const [totalOptions, setTotalOptions] = useState()

    const defaultOptions = [
        { option: 'optiona', ref: buttonRefA, opt: 'a' },
        { option: 'optionb', ref: buttonRefB, opt: 'b' },
        { option: 'optionc', ref: buttonRefC, opt: 'c' },
        { option: 'optiond', ref: buttonRefD, opt: 'd' },
        { option: 'optione', ref: buttonRefE, opt: 'e' },
    ];
    const reorderOptions = (defaultOptions, selectedAnswer) => {
        // Step 1: Create a map for quick lookup of options by 'opt'
        const optionsMap = {};
        defaultOptions.forEach((option) => {
            optionsMap[option.opt] = option;
        });

        // Step 2: Reorder the options based on the order of 'selectedAnswer'
        const reorderedOptions = [];
        selectedAnswer.forEach((opt) => {
            if (optionsMap[opt]) {
                reorderedOptions.push(optionsMap[opt]);
                delete optionsMap[opt]; // Remove from map to avoid duplicates
            }
        });

        // Step 3: Append any remaining options that were not in 'selectedAnswer'
        Object.values(optionsMap).forEach((option) => {
            reorderedOptions.push(option);
        });

        return reorderedOptions;
    };
    const [options, setOptions] = useState(defaultOptions);
    useEffect(() => {
        
        let totalOpt = options.filter((option) => questions[currentQuestion][option.option]).length
        setTotalOptions(totalOpt)
    }, [])
    useEffect(() => {
        setOptions(defaultOptions);
    }, [currentQuestion]);

    useEffect(() => {
        let decryptedAnswers = [];
        let isAnswerArray = Array.isArray(questions[currentQuestion].answer)
        if(isAnswerArray){
            questions[currentQuestion].answer?.map((data) => {
                decryptedAnswers.push(decryptAnswer(data, userData?.data?.id))
            })
        }else{
            decryptedAnswers.push(decryptAnswer(questions[currentQuestion].answer, userData?.data?.id))
        }
        setDecryptedAnswers([...decryptedAnswers])
    }, [currentQuestion])
    const systemconfig = useSelector(sysConfigdata);

    // store data get
    const userData = useSelector((state) => state.User);


    const previousQuestion = () => {
        const prevQuestion = currentQuestion - 1;
        if (prevQuestion >= 0) {
            if (prevQuestion > 0) {
                setDisablePrev(false);
            } else {
                setDisablePrev(true);
            }
            setDisableNext(false);
            setCurrentQuestion(prevQuestion);
        }
    };

    const nextQuestion = () => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions?.length) {
            if (nextQuestion + 1 === questions?.length) {
                setDisableNext(true);
            } else {
                setDisableNext(false);
            }
            setDisablePrev(false);
            setCurrentQuestion(nextQuestion);
        }
    };

    let count = 0;
    const setAnswerStatusClass = (option) => {
        let decryptedAnsArr = [];
        let isAnswerArray = Array.isArray(questions[currentQuestion].answer)
        if(isAnswerArray){
            questions[currentQuestion].answer?.map((data) => {
                decryptedAnsArr.push(decryptAnswer(data, userData?.data?.id))
            })
        }else{
            decryptedAnsArr.push(decryptAnswer(questions[currentQuestion].answer, userData?.data?.id))
        }

        if (questions[currentQuestion]?.answer_type == "2") {
            if (questions[currentQuestion]?.isAnswered) {
                if (option === decryptedAnsArr[count]) { // Compare with decrypted answers
                    count++;
                    return "border border-green-600 border-[2px]";
                } else {
                    count++;
                    return "border border-red-600 border-[2px]";
                }
            } else {
                // Check for Arrange and isAnswered is false
                if (option === decryptedAnsArr[count]) {
                    count++;
                    return "border border-green-600 border-[2px]"
                } else {
                    count++;
                    return "border border-red-600 border-[2px]";
                }
            }
        }
        if (questions[currentQuestion]?.selected_answer && questions[currentQuestion]?.isAnswered) {
            if (decryptedAnsArr.includes(option)) { // Check if option exists in decrypted answers
                return "border border-green-600 border-[2px]";
            } else if (!decryptedAnsArr.includes(option) && questions[currentQuestion]?.selected_answer.includes(option)) {
                return "border border-red-600 border-[2px]";
            } else {
                return false;
            }
        } else {
            if (decryptedAnsArr.includes(option)) { // Check if option exists in decrypted answers
                return "border border-green-600 border-[2px]";
            } else {
                return false;
            }
        }
    }


    const rightWrongIcon = (option) => {
        let decryptedAnsArr = questions[currentQuestion].answer?.map((data) => {
            return decryptAnswer(data, userData?.data?.id)
        })
        if (questions[currentQuestion].isAnswered) {
            if (decryptedAnsArr.includes(option) && questions[currentQuestion]?.selected_answer?.includes(option)) {
                return <img src={getImageSource(rightTickIcon.src)} className='right_wrong_ans' alt="rightTickIcon" />
            } else if (!decryptedAnsArr.includes(option) && questions[currentQuestion]?.selected_answer?.includes(option)) {
                return <img src={getImageSource(crossIcon.src)} className='right_wrong_ans' alt="crossIcon" />
            } else if (decryptedAnsArr.includes(option) && !questions[currentQuestion]?.selected_answer?.includes(option)) {
                return <img src={getImageSource(crossIcon.src)} className='right_wrong_ans' alt="crossIcon" />
            } else if (!decryptedAnsArr.includes(option) && !questions[currentQuestion]?.selected_answer?.includes(option)) {
                return false
            }
        }
    }

    useEffect(() => {
        if (questions?.length <= 1) {
            setDisableNext(true)
            setDisablePrev(true)
        }
    }, [questions])
    return (
        <>
            <div className="max-479:!justify-center reviewUpperDiv flex items-center morphisam p-8 mb-4 rounded-[20px] morphisam flex-center !justify-between max-767:flex-wrap gap-1 max-767:gap-2 darkSecondaryColor ">
                {showLevel ?
                    <div className="leftSec">
                        <div className="level">
                            <span>
                                {t("level")} : {questions[currentQuestion]?.level}
                            </span>
                        </div>
                    </div> :
                    null}


                <div className="centerSec">
                    <div className="text-center reviewHeadline font-extrabold text-[32px] max-767:text-[22px] ">
                        <h4 className="">{t("review_answers")}</h4>
                    </div>
                </div>



                <div className="rightSec flex items-center justify-center gap-7">
                    <div className="p-[13px_24px] rounded-[50px] border-[2px] border-border mb-0 bordercolor dark:bg-[#3c3555]">
                        <span>
                            {currentQuestion + 1} - {questions?.length}
                        </span>
                    </div>

                    {showBookmark ? (
                        <div className="bookmark_area">
                            <div className="btn bookmark_btn">

                                <Bookmark
                                    id={questions[currentQuestion].id}
                                    onClick={handleBookmarkClick}
                                    type={'1'}
                                />
                            </div>
                        </div>
                    ) : (
                        ''
                    )}

                    {reportquestions ? (
                        <div className="bg-[var(--background-2)] dark:bg-[#3c3555] text-center rounded-full h-[56px] w-[56px] flex-center text-base">
                            <button title="Report Question" className="btn bookmark_btn  " onClick={() => reportQuestion(questions[currentQuestion]?.id, isMulti)}>
                                <FaExclamationTriangle className="fa-2x h-[24px] w-[24px]" />
                            </button>
                        </div>
                    ) : (
                        false
                    )}
                </div>

            </div>
            <div className="morphisam  mb-3 lg:flex flex-wrap darkSecondaryColor">
                <div className="mb-2">{questions[currentQuestion]?.answer_type == "1" ? t("multi_select") : t("arrange")}
                </div>
                <div className="flex flex-wrap w-full">
                    <div className="w-full lg:w-2/3 flex-center h-auto bg-white rounded-[10px]  flex-col py-4 text-center dark:bg-[#3c3555] mb-[10px]">
                        <p className="question-text">
                            {systemconfig.latex_mode === "1" ?
                                <RenderHtmlContent htmlContent={questions[currentQuestion]?.question} />
                                :
                                questions[currentQuestion]?.question
                            }
                        </p>
                        {questions[currentQuestion]?.image ? (
                            <div className="imagedash w-full h-full px-10">
                                <Image className="w-full h-full mx-auto object-cover aspect-square rounded-lg" width={0} height={0} src={questions[currentQuestion]?.image} onError={imgError} alt="error" />
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                    <div className="w-full lg:w-1/3">
                        <div className='mr-5 ml-5 lg:mr-0 mb-4'>
                            {questions[currentQuestion]?.answer_type == "1" ?
                                <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-5'>
                                    {options.map((option, index) => {
                                        // Check if the option exists
                                        if (questions[currentQuestion][option.option]) {
                                            return (
                                                <button
                                                    key={index}
                                                    ref={option.ref}
                                                    className={`btn button__ui relative bg-white dark:bg-[#3c3555] w-100 ${setAnswerStatusClass(option.opt)} font-bold text-[20px] leading-[30px] text-primary-color whitespace-nowrap flex items-center justify-between rounded-lg
                                                        `}
                                                    //  onClick={() => handleAnswerOptionClick(option.opt)}
                                                    disabled={true}
                                                >
                                                    <div className="optionBtn">
                                                        <span className="optionIndex">
                                                            {t(option.opt)}&nbsp;
                                                        </span>
                                                        <span className='text-wrap text-start'>{questions[currentQuestion][option.option]}</span>
                                                    </div>
                                                    {rightWrongIcon(option.opt) && <div className='right_wrong_ans_icon p-4'>
                                                        {rightWrongIcon(option.opt)}
                                                    </div>}
                                                </button>
                                            );
                                        } else {
                                            return null; // Skip rendering if the option doesn't exist
                                        }
                                    })}
                                </div> : <div className='mb-4'>
                                    <DragDropContext >
                                        <Droppable droppableId="options">
                                            {(provided) => {
                                                const selectedAnswers = questions[currentQuestion]?.selected_answer || [];
                                                const reorderedOptions = reorderOptions(options, selectedAnswers);
                                                return (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        {reorderedOptions.map((option, index) => {
                                                            const optionContent = questions[currentQuestion]?.[option.option];

                                                            if (!optionContent) {
                                                                return null;
                                                            }

                                                            return (
                                                                <Draggable
                                                                    key={option.opt}
                                                                    draggableId={option.opt || `option-${index}`}
                                                                    index={index}
                                                                    isDragDisabled={true}
                                                                >
                                                                    {(provided) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            className={`${setAnswerStatusClass(option.opt)} bg-white mb-6 w-full border-[2px] rounded-lg dark:!bg-[#3c3555]`}
                                                                            disabled={true}
                                                                        >
                                                                            <div
                                                                                ref={option.ref}
                                                                                className={`flex justify-between items-start w-full rounded-lg p-3 md:p-6`}
                                                                            >
                                                                                <div className="w-full px-2 flex text-start items-baseline gap-2.5 font-bold rounded-lg break-words text-[17px]">
                                                                                    <span className="optionIndex text-primary-color">
                                                                                        {t(option.opt)}&nbsp;
                                                                                    </span>
                                                                                    {questions[currentQuestion][option.option]}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            );
                                                        })}
                                                        {provided.placeholder}
                                                    </div>
                                                )
                                            }}
                                        </Droppable>
                                    </DragDropContext>
                                </div>
                            }
                        </div>
                        {questions[currentQuestion]?.selected_answer?.length > 0 && !questions[currentQuestion]?.isAnswered ? (
                            <div className="text-end">
                                <span className="">*{t("not_att")}</span>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>


                <div>{t("correct_answer_is")} : {decryptedAnsArr.join(",")}
                </div>
            </div>
            {/* <div className='divider'>
                <hr style={{ width: '112%', backgroundColor: 'gray', height: '2px' }} />
            </div> */}

            <div className="flex justify-evenly mb-4">
                <div className="">
                    <button className="reviewBtn disabled:opacity-50 disabled:cursor-default disabled:hover:scale-100 disabled:hover:border-transparent" onClick={previousQuestion} disabled={disablePrev}>
                        <RiArrowLeftDoubleLine size={25} />
                    </button>
                </div>
                <div className="">
                    <button className="reviewBtn" onClick={goBack}>
                        {t("back")}
                    </button>
                </div>
                <div className="">
                    <button className="reviewBtn disabled:opacity-50 disabled:cursor-default disabled:hover:scale-100 disabled:hover:border-transparent" onClick={nextQuestion} disabled={disableNext}>
                        <RiArrowRightDoubleLine size={25} />
                    </button>
                </div>
            </div>
            <div className="text-center review-answer-data">
                <div className="flex flex-start mt-5 my-2 text-bold">
                    {questions[currentQuestion]?.note ?
                        <><span className="text-nowrap font-bold text-lg text-red-700">{t("note")} :- &nbsp; </span>{systemconfig.latex_mode === "1" ? <p className="mb-0 text-lg"><RenderHtmlContent htmlContent={questions[currentQuestion]?.note} /></p> : <p className="mb-0 text-lg" dangerouslySetInnerHTML={{ __html: questions[currentQuestion]?.note }}></p>}</>
                        :
                        ""
                    }
                </div>
            </div>
        </>
    );
}

MultiMatchReviewAnswer.propTypes = {
    questions: PropTypes.array.isRequired,
    goBack: PropTypes.func,
};

export default withTranslation()(MultiMatchReviewAnswer);
