import { createSelector, createSlice } from '@reduxjs/toolkit'
import { store } from '../store'

const initialState = {
  data: {},
  contestLeaderboarddata: {},
  playwithfrienddata: {},
  examQuestionData: [],
  examCompletedata: {
    totalQuestions: null,
    Correctanswer: null,
    InCorrectanswer: null
  },
  examsetQuiz: {
    remianingtimer: null,
    statistics: null,
    totalmarks: ''
  },
  resultTempData: {},
  questionsData: [],
  quizZoneCompletedata: {
    Correctanswer: null,
    InCorrectanswer: null
  },
  reviewAnswerShow: false,
  quizShow: false,
  percentage: 0,
  funandlearnComphremsionData: {},
  randomBattleBackToBackWin: 0,
  selectedCategory: {},
  selectedSubCategory: {},
  quizResultData: {},
  battleResultData: {
    play_questions: [],
    quiz_type: null,
    match_id: null,
    is_bot: false,
  },
  totalNumOfHint: null,
}
export const tempSlice = createSlice({
  name: 'Tempdata',
  initialState,
  reducers: {
    tempdataSuccess: (temporary, action) => {
      temporary.data = action.payload.data
    },
    contestLeaderboarddataSuccess: (temporary, action) => {
      temporary.contestLeaderboarddata = action.payload.data
    },
    playwithFrienddataSuccess: (temporary, action) => {
      temporary.playwithfrienddata = action.payload.data
    },
    examcompletedataSuccess: (temporary, action) => {
      temporary.examCompletedata.totalQuestions = action.payload.totalQuestions
      temporary.examCompletedata.Correctanswer = action.payload.Correctanswer
      temporary.examCompletedata.InCorrectanswer = action.payload.InCorrectanswer
    },
    examsetquizSuccess: (temporary, action) => {
      temporary.examsetQuiz.remianingtimer = action.payload.remianingtimer
      temporary.examsetQuiz.statistics = action.payload.statistics
      temporary.examsetQuiz.totalmarks = action.payload.totalmarks
    },
    examquestionsSuccess: (temporary, action) => {
      temporary.examQuestionData = action.payload.data
    },
    resultTempDataSuccess: (temporary, action) => {
      temporary.resultTempData = action.payload
    },
    updateTempdataSuccess: (temporary, action) => {
      temporary.data.level = action.payload.data ?? temporary.data.level
    },
    quizZonecompletedataSuccess: (temporary, action) => {
      if (temporary.quizZoneCompletedata) {
        temporary.quizZoneCompletedata.Correctanswer = action.payload.Correctanswer
        temporary.quizZoneCompletedata.InCorrectanswer = action.payload.InCorrectanswer
      }
    },
    quizZonequizShowSucess: (temporary, action) => {
      if (temporary.quizShow !== action.payload.data) {
        temporary.quizShow = action.payload.data
      }
    },
    percentageSuccess: (temporary, action) => {
      temporary.percentage = action.payload
    },
    reviewAnswerShowSuccess: (temporary, action) => {
      temporary.reviewAnswerShow = action.payload
    },
    questionsDataSuceess:(temporary,action) => {
      temporary.questionsData = action.payload
    },
    funandlearnComphremsionDataSuccess: (temporary, action) => {
      temporary.funandlearnComphremsionData = action.payload;
    },
    setRandomBattleBackToBackWin: (temporary, action) => {
      temporary.randomBattleBackToBackWin = action.payload;
    },
    resetRandomBattleBackToBackWin: (temporary) => {
      temporary.randomBattleBackToBackWin = 0;
    },
    selectedCategorySuccess: (temporary, action) => {
      temporary.selectedCategory = action.payload;
    },
    selectedSubCategorySuccess: (temporary, action) => {
      temporary.selectedSubCategory = action.payload;
    },
    quizResultDataSuccess: (temporary, action) => {
      temporary.quizResultData = action.payload;
    },
    battleResultDataSuccess: (temporary, action) => {
      temporary.battleResultData.play_questions = action.payload.play_questions;
      temporary.battleResultData.quiz_type = action.payload.quiz_type;
      temporary.battleResultData.match_id = action.payload.match_id;
      temporary.battleResultData.is_bot = action.payload.is_bot;
    },
    totalNumOfHintSuccess: (temporary, action) => {

      temporary.totalNumOfHint = Number(temporary.totalNumOfHint) + Number(action.payload);
    },
    resetTotalNumOfHint: (temporary) => {
      temporary.totalNumOfHint = 0;
    }
  }
})

export const {
  percentageSuccess,
  quizZonequizShowSucess,
  resultTempDataSuccess,
  updateTempdataSuccess,
  tempdataSuccess,
  contestLeaderboarddataSuccess,
  playwithFrienddataSuccess,
  exammarksSuccess,
  examcompletedataSuccess,
  examsetquizSuccess,
  examquestionsSuccess,
  reviewAnswerShowSuccess,
  quizZonecompletedataSuccess,
  questionsDataSuceess,
  funandlearnComphremsionDataSuccess,
  setRandomBattleBackToBackWin,
  resetRandomBattleBackToBackWin,
  selectedCategorySuccess,
  selectedSubCategorySuccess,
  quizResultDataSuccess,
  battleResultDataSuccess,
  totalNumOfHintSuccess,
  resetTotalNumOfHint
} = tempSlice.actions;
export default tempSlice.reducer

export const Loadtempdata = data => {
  store.dispatch(tempdataSuccess({ data }))
}

export const updateTempdata = data => {
  store.dispatch(updateTempdataSuccess({ data }))
}

export const LoadcontestLeaderboard = data => {
  store.dispatch(contestLeaderboarddataSuccess({ data }))
}

export const playwithFrienddata = data => {
  store.dispatch(playwithFrienddataSuccess({ data }))
}

export const LoadexamCompletedata = (totalQuestions, Correctanswer, InCorrectanswer) => {
  store.dispatch(examcompletedataSuccess({ totalQuestions, Correctanswer, InCorrectanswer }))
}

export const Loadexamsetquiz = (remianingtimer, statistics, totalmarks) => {
  store.dispatch(examsetquizSuccess({ remianingtimer, statistics, totalmarks }))
}

export const LoadExamQuestion = data => {
  store.dispatch(examquestionsSuccess({ data }))
}

export const LoadQuizZoneCompletedata = (Correctanswer, InCorrectanswer) => {
  store.dispatch(quizZonecompletedataSuccess({ Correctanswer, InCorrectanswer }))
}

export const LoadQuizZonepercentage = data => {
  store.dispatch(quizZonequizShowSucess({ data }))
}

export const LoadRandomBattleBackToBackWin = (data) => {
  store.dispatch(setRandomBattleBackToBackWin(data));
}

export const ResetRandomBattleBackToBackWin = () => {
  store.dispatch(resetRandomBattleBackToBackWin());
}

export const setQuizResultData = (data) => {
  store.dispatch(quizResultDataSuccess(data));
}

export const setBattleResultData = (data) => {
  store.dispatch(battleResultDataSuccess(data));
}

export const setTotalNumOfHint = (data) => {
  store.dispatch(totalNumOfHintSuccess(data));
}

export const ResetTotalNumOfHint = () => {
  store.dispatch(resetTotalNumOfHint());
}


// selector
export const selecttempdata = createSelector(
  state => state.Tempdata,
  Tempdata => Tempdata.data
)

export const contestleaderboard = createSelector(
  state => state.Tempdata,
  Tempdata => Tempdata.contestLeaderboarddata
)

export const playwithfreind = createSelector(
  state => state.Tempdata,
  Tempdata => Tempdata.playwithfrienddata
)

export const examCompletedata = createSelector(
  state => state.Tempdata.examCompletedata,
  Tempdata => Tempdata
)

export const getexamsetQuiz = createSelector(
  state => state.Tempdata.examsetQuiz,
  Tempdata => Tempdata
)

export const getexamQuestion = createSelector(
  state => state.Tempdata,
  Tempdata => Tempdata.examQuestionData
)
export const getQuizEndData = createSelector(
  state => state.Tempdata,
  Tempdata => Tempdata.quizZoneCompletedata
)


// selector
export const selectResultTempData = state => state.Tempdata.resultTempData

export const selectQuizZonePercentage = state => state.Tempdata.quizShow

export const selectPercentage = state => state.Tempdata.percentage

export const reviewAnswerShowData = state => state.Tempdata.reviewAnswerShow

export const questionsData = state => state.Tempdata.questionsData

export const funandlearnComphremsionData = state => state.Tempdata.funandlearnComphremsionData

export const RandomBattleBackToBackWin = state => state.Tempdata.randomBattleBackToBackWin;

export const getSelectedCategory = state => state.Tempdata.selectedCategory;

export const getSelectedSubCategory = state => state.Tempdata.selectedSubCategory;

export const getQuizResultData = state => state.Tempdata.quizResultData;

export const getBattleResultData = state => state.Tempdata.battleResultData;

export const getTotalNumOfHint = state => state?.Tempdata?.totalNumOfHint ?? 0;