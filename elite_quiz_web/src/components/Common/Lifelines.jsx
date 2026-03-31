'use client'
import React, { useState } from 'react'
import { FaRegClock } from 'react-icons/fa'
import { RiArrowRightDoubleLine } from 'react-icons/ri'
import PropTypes from 'prop-types'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { updateUserDataInfo } from '@/store/reducers/userSlice'
import { sysConfigdata } from '@/store/reducers/settingsSlice'
import { TbUsers } from 'react-icons/tb'
import { t } from '@/utils'

const Lifelines = ({
  handleFiftFifty,
  handleAudiencePoll,
  handleResetTime,
  handleSkipQuestion,
  showFiftyFifty,
  audiencepoll,
  currentquestions,
  totalQuestions
}) => {
  const [status, setStatus] = useState({
    fifty_fifty: false,
    audience_poll: false,
    reset_time: false,
    skip_question: false
  })

  // store data get
  const userData = useSelector(state => state.User)

  const systemconfig = useSelector(sysConfigdata)

  const lifeline_deduct_coin = systemconfig?.quiz_zone_lifeline_deduct_coin

  const lifeLineClick = type => {
    let update
    if (type === 'Fifty Fifty') {
      if (currentquestions.audeincePoll) {
        toast.error(t('cant_use_fifty_fifty_after_poll'))
        return false
      }
      if (!status.fifty_fifty) {
        if (checkIfUserhasCoins() && handleFiftFifty()) {
          if (deductCoins()) {
            update = { ...status, fifty_fifty: true }
            setStatus(update)
          }
        }
      } else {
        toast.error(t('lifeline_already_used'))
      }
    } else if (type === 'Audience Poll') {
      if (currentquestions.fiftyUsed) {
        toast.error(t('cant_use_poll_after_fifty_fifty'))
        return
      }
      if (!status.audience_poll) {
        if (deductCoins()) {
          update = { ...status, audience_poll: true }
          handleAudiencePoll()
          setStatus(update)
        }
      } else {
        toast.error(t('lifeline_already_used'))
      }
    } else if (type === 'Reset Time') {
      if (!status.reset_time) {
        if (deductCoins()) {
          update = { ...status, reset_time: true }
          handleResetTime()
          setStatus(update)
        }
      } else {
        toast.error(t('lifeline_already_used'))
      }
    } else if (type === 'Skip Question') {
      if (!status.skip_question) {
        if (deductCoins()) {
          update = { ...status, skip_question: true }
          handleSkipQuestion()
          setStatus(update)
        }
      } else {
        toast.error(t('lifeline_already_used'))
      }
    }
  }

  const deductCoins = async () => {
    if (checkIfUserhasCoins()) {
      

      return true
    } else {
      return false
    }
  }

  const checkIfUserhasCoins = () => {
    if (userData?.data?.coins < (Number(lifeline_deduct_coin) ? Number(lifeline_deduct_coin) : 0)) {
      toast.error(t('no_enough_coins'))
      return false
    } else {
      return true
    }
  }
  return (
    <div className='lifelineParantDiv'>
      {showFiftyFifty ? (
        <div className='mb-3 w-full md:w-1/4 pr-10 max-767:px-5 between-576-767:w-1/2'>
          <button
            className={` lifelinebtn group ${status.fifty_fifty && 'bg-secondary hover:!border-none'}`}
            onClick={() => lifeLineClick('Fifty Fifty')}
            disabled={status.fifty_fifty}
          >
            <span>50/50</span>
          </button>
        </div>
      ) : (
        ''
      )}

      {audiencepoll ? (
        <div className=' mb-3 w-full md:w-1/4 px-5 between-576-767:w-1/2'>
          <button
            className={`lifelinebtn group ${status.audience_poll && 'bg-secondary hover:!border-none'}`}
            onClick={() => lifeLineClick('Audience Poll')}
            disabled={status.audience_poll}
          >
            <span className={`opacity-100 block ${!status.audience_poll ? 'group-hover:hidden group-hover:opacity-0' : ''}`}>
              {' '}
              <TbUsers />
            </span>
            {!status.audience_poll && <span className='group-hover:opacity-100 group-hover:block hidden opacity-0'>{t('audience_poll')}</span>}
          </button>
        </div>
      ) : (
        ''
      )}
      <div className='  mb-3 w-full md:w-1/4 px-5 between-576-767:w-1/2'>
        <button
          className={`lifelinebtn group ${status.reset_time && 'bg-secondary hover:!border-none' }`}
          onClick={() => lifeLineClick('Reset Time')}
          disabled={status.reset_time}
        >
          <span className={`opacity-100 block ${!status.reset_time ? 'group-hover:hidden group-hover:opacity-0' : ''}`}>
            <FaRegClock />
          </span>
          {!status.reset_time && <span className='group-hover:opacity-100 group-hover:block hidden opacity-0'>{t('reset_time')}</span>}
        </button>
      </div>
      {totalQuestions > 1 && (
        <div className=' mb-3 w-full md:w-1/4 pl-10 max-767:px-5 between-576-767:w-1/2'>
          <button
            className={`lifelinebtn group ${status.skip_question && 'bg-secondary hover:!border-none'}`}
            onClick={() => lifeLineClick('Skip Question')}
            disabled={status.skip_question}
          >
            <span className={`opacity-100 block ${!status.skip_question ? 'group-hover:hidden group-hover:opacity-0' : ''}`}>
              {' '}
              <RiArrowRightDoubleLine size={25} />
            </span>
            {!status.skip_question && <span className='group-hover:opacity-100 group-hover:block hidden opacity-0'>{t('skip_question')}</span>}
          </button>
        </div>
      )}
    </div>
  )
}
Lifelines.propTypes = {
  handleFiftFifty: PropTypes.func.isRequired,
  handleAudiencePoll: PropTypes.func.isRequired,
  handleResetTime: PropTypes.func.isRequired,
  handleSkipQuestion: PropTypes.func.isRequired
}
export default withTranslation()(Lifelines)
