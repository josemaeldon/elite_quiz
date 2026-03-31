import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { decryptAnswer, getImageSource, handleBookmarkClick, imgError } from '@/utils'
import { useSelector } from 'react-redux'
import checkIcon from '../../../assets/images/check-circle-score-screen.svg'
import crossIcon from '../../../assets/images/x-circle-score-screen.svg'

import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine } from 'react-icons/ri'
import Bookmark from '@/components/Common/Bookmark'

function GuessthewordReviewAnswer({ questions, goBack, t }) {
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

  // decrypt answer
  let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData?.data?.firebase_id)

  useEffect(() => {
    if(questions?.length <= 1){
      setDisableNext(true)
      setDisablePrev(true)
    }
  },[questions])
  return (
    <React.Fragment>
      <div className=' darkSecondaryColor morphisam flex-center !justify-between max-767:flex-wrap gap-1 max-767:gap-2 max-479:!justify-center'>
        <div className=''>
          <h4 className='font-extrabold text-[32px] max-767:text-[22px]'>{t('review_answers')}</h4>
        </div>
       
          <div className='flex-center gap-7'>
            <h5 className='p-[13px_24px] rounded-[50px] border-[2px] border-border mb-0 bordercolor dark:bg-[#3c3555]'>
              {currentQuestion + 1} - {questions?.length}
            </h5>

            <div className=' bg-[var(--background-2)] dark:bg-[#3c3555] text-center rounded-full h-[56px] w-[56px] flex-center text-base'>
              <Bookmark id={questions[currentQuestion].id} onClick={handleBookmarkClick} type={'3'} />
            </div>
          </div>
        
      </div>
<div className='morphisam mb-6 darkSecondaryColor '>
      <div className=' mb-6 text-center'>
        <p className=''>{questions[currentQuestion].question}</p>
      </div>

      {questions[currentQuestion].image ? (
        <div className='flex-center m-auto mb-4'>
          <img className='h-80 max-w-full max-h-full mb-3 object-contain rounded-[5px]' src={getImageSource(questions[currentQuestion].image)} onError={imgError} alt='Error Image' />
        </div>
      ) : (
        ''
      )}

      {/* review answer show  */}
      <div className='flex-center text-center text-text-color'>
        {(() => {
          if (questions[currentQuestion].selected_answer.toLowerCase() == decryptedAnswer.toLowerCase()) {
            return (
              <div className='flex-center mb-5 gap-8'>
                <div className='p-[10px_20px] rounded-[50px] border-[2px] border-[#d3d3d3]'>
                  <span className='text-text-color font-extrabold text-[20px] flex max-479:flex-col '>
                    <img className='mr-2 max-479:h-7' src={getImageSource(checkIcon.src)} alt='correct' />
                    {t('correct_answer')} :<span className='font-normal '>{` ${decryptedAnswer}`}</span>
                  </span>
                  {/* {`correct answer : ${decryptedAnswer}`} */}
                </div>
              </div>
            )
          } else {
            return (
              <>
                <div className='flex-center mb-5 gap-8 flex-col '>
                  <div className='p-[10px_20px] rounded-[50px] border-[2px] border-[#d3d3d3]'>
                    <span className='text-text-color font-extrabold text-[20px] flex max-479:flex-col'>
                      <img className='mr-2 max-479:h-7'  src={getImageSource(crossIcon.src)} alt='incorrect' />
                      {t('your_ans')} :<span className='font-normal'>{` ${questions[currentQuestion].selected_answer}`}</span>
                    </span>
                  </div>
                  <div className='p-[10px_20px] rounded-[50px] border-[2px] border-[#d3d3d3]'>
                    <span className='text-text-color font-extrabold text-[20px] flex max-479:flex-col' >
                      <img className='mr-2 max-479:h-7' src={getImageSource(checkIcon.src)} alt='correct' />
                      {t('correct_answer')} :<span className='font-normal'>{` ${decryptedAnswer}`}</span>
                    </span>
                  </div>
                </div>
              </>
            )
          }
        })()}
      </div>

      {/* <div className='row'>
        {questions[currentQuestion].optiona ? (
          <div className='col-md-6 col-12'>
            <div className='inner__questions'>
              <button className={`btn button__ui w-100 ${setAnswerStatusClass('a')}`}>
                {questions[currentQuestion].optiona}
              </button>
            </div>
          </div>
        ) : (
          ''
        )}
        {questions[currentQuestion].optionb ? (
          <div className='col-md-6 col-12'>
            <div className='inner__questions'>
              <button className={`btn button__ui w-100 ${setAnswerStatusClass('b')}`}>
                {questions[currentQuestion].optionb}
              </button>
            </div>
          </div>
        ) : (
          ''
        )}
        {questions[currentQuestion].question_type === '1' ? (
          <>
            {questions[currentQuestion].optionc ? (
              <div className='col-md-6 col-12'>
                <div className='inner__questions'>
                  <button className={`btn button__ui w-100 ${setAnswerStatusClass('c')}`}>
                    {questions[currentQuestion].optionc}
                  </button>
                </div>
              </div>
            ) : (
              ''
            )}
            {questions[currentQuestion].optiond ? (
              <div className='col-md-6 col-12'>
                <div className='inner__questions'>
                  <button className={`btn button__ui w-100 ${setAnswerStatusClass('d')}`}>
                    {questions[currentQuestion].optiond}
                  </button>
                </div>
              </div>
            ) : (
              ''
            )}
            {questions[currentQuestion].optione !== '' ? (
              <div className='row d-flex justify-content-center'>
                <div className='col-md-6 col-12'>
                  <div className='inner__questions'>
                    <button className={`btn button__ui w-100 ${setAnswerStatusClass('e')}`}>
                      <div className='row'>
                        <div className='col'>{questions[currentQuestion].optione}</div>
                        {questions[currentQuestion].probability_e ? (
                          <div className='col text-end'>{questions[currentQuestion].probability_e}</div>
                        ) : (
                          ''
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
          </>
        ) : (
          ''
        )}
      </div> */}
      <div className='w-full text-end'>
        {!questions[currentQuestion].selected_answer ? (
          <div className='text-end'>
            <span>*{t('not_att')}</span>
          </div>
        ) : (
          ''
        )}
</div>
        </div>
      <div className='flex justify-evenly'>
        <div className=''>
          <button className='reviewBtn ' onClick={previousQuestion} disabled={disablePrev}>
            <RiArrowLeftDoubleLine size={25} />
          </button>
        </div>
        <div className=''>
          <button className='reviewBtn ' onClick={goBack}>
            {t('back')}
          </button>
        </div>
        <div className=''>
          <button className='reviewBtn' onClick={nextQuestion} disabled={disableNext}>
            <RiArrowRightDoubleLine size={25} />
          </button>
        </div>
      </div>

      <div className='text-center text-white'>
        <div className="flex flex-start mt-5 my-2 text-bold">
          {questions[currentQuestion].note ? <p className="text-lg">{t('note') + ' : ' + questions[currentQuestion].note}</p> : ''}
        </div>
      </div>
    </React.Fragment>
  )
}

GuessthewordReviewAnswer.propTypes = {
  questions: PropTypes.array.isRequired,
  goBack: PropTypes.func
}

export default withTranslation()(GuessthewordReviewAnswer)
