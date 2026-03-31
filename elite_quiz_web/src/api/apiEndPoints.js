

/** API ROUTES */

// Common Api
export const getCategoriesApi = "get_categories";
export const getSubcategoriesApi = "get_subcategory_by_maincategory";
export const getTableTrackerDataApi = "get_tracker_data";
export const reportQuestionApi = "report_question";

// LeaderBoard Api


export const getDailyLeaderBoardApi = "get_daily_leaderboard";
export const getMonthlyLeaderBoardApi = "get_monthly_leaderboard";
export const getGlobleLeaderBoardApi = "get_globle_leaderboard";

// Languages Api
export const getLanguagesApi = "get_languages";

// User Api
export const getUserByIdApi = "get_user_by_id";
export const getUserStatisticsApi = "get_users_statistics";
export const getUserCoinsApi = "get_user_coin_score";
export const getUserBadgesApi = "get_user_badges";
export const setUserCoinScoreApi = "set_user_coin_score";
export const registerApi = "user_signup";
export const updateUserProfileDataApi = "update_profile";
export const updateUserProfileImageApi = "upload_profile_image";
export const deleteUserAccountApi = "delete_user_account";
export const checkUserExistsApi = "check_user_exists";

// Bookmark Api
export const getBookmarkApi = "get_bookmark";
export const setBookmarkApi = "set_bookmark";

// Settings Api
export const getSettingsApi = "get_settings";
export const getSystemConfigurationsApi = "get_system_configurations";
export const getWebHomeSettingsApi = "get_web_home_settings";
export const getWebSettingsApi = "get_web_settings";


// Quiz Zone
export const getLevelDataApi = "get_level_data";
export const getQuestionApi = "get_questions_by_level";
export const getQuestionsWithoutLevelApi = "get_questions"; 

// Daily Quiz
export const getDailyQuizApi = "get_daily_quiz";

// True and False
export const getTrueAndFalseQuestionsApi = "get_questions_by_type";

// Fun and Learn
export const getFunAndLearnApi = "get_fun_n_learn";
export const funandlearnquestionsApi = "get_fun_n_learn_questions";

// Guess the Word
export const guessthewordApi = "get_guess_the_word";

// Self Challenge
export const getSelfQuestionApi = "get_questions_for_self_challenge";

// Contest Play
export const getContestApi = "get_contest";
export const getContestQuestionsApi = "get_questions_by_contest";
export const getContestLeaderboardApi = "get_contest_leaderboard";

// Battle
export const getRandomQuestionsApi = "get_random_questions";
export const getQuestionByRoomIdApi = "get_question_by_room_id";
export const getBattleStaticticsApi = "get_battle_statistics";
export const createRoomApi = "create_room";

// Audio Quiz
export const getAudioQuestionApi = "get_audio_questions";

// Maths Quiz
export const getMatchQuestionsApi = "get_maths_questions";

// Exam Quiz
export const getExamModualApi = "get_exam_module";
export const getExamModualQuestionsApi = "get_exam_module_questions";
export const setExamModualResultApi = "set_exam_module_result";

// Payment Request Api
export const getPaymentRequestApi = "get_payment_request";
export const setPaymentRequestApi = "set_payment_request";
export const deletePendingPaymentRequestApi = "delete_pending_payment_request";

// Premium Module
export const unlockPremiumCatApi = "unlock_premium_category";

// Notifications
export const getNotificationApi = "get_notifications";

// Language data
export const getSystemLanguageListApi = "get_system_language_list";
export const getSystemLanguageJsonApi = "get_system_language_json";

// multi match
export const getMultiMatchQuestionByLevelApi = "get_multi_match_questions_by_level";
export const multiMatchReportQuestionApi = "multi_match_report_question";
export const getMultiMatchLevelApi = "get_multi_match_level_data";
export const getMultiMatchQuestionsApi = "get_multi_match_questions";

// update fcm id
export const updateFcmIdApi = "update_fcm_id";

// Local auth endpoints
export const loginLocalApi = "Auth/login";
export const registerLocalApi = "Auth/register";
export const resetPasswordLocalApi = "Auth/reset_password";
export const verifyTokenLocalApi = "Auth/verify_token";

// Battle room endpoints (Postgres-backed)
export const createBattleRoomApi = "BattleRoom/create";
export const joinBattleRoomApi = "BattleRoom/join";
export const sendBattleMessageApi = "BattleRoom/messages";
export const getBattleMessagesApi = "BattleRoom/messages";
export const getBattleStateApi = "BattleRoom/state";

//update user coin and score
export const setQuizCoinScoreApi = "set_quiz_coin_score";

/// Note: Some of these are Admin Panel's internal Codes.
/// for consistency i have prefixed them with 'errorCode'
export const errorCodeInvalidAccessKey = '101';
export const errorCodeDataNotFound = '102';
export const errorCodeFillAllData = '103';
export const errorCodeUserRegisteredSuccessfully = '104';
export const errorCodeLoginSuccess = '105';
export const errorCodeProfileUpdateSuccess = '106';
export const errorCodeFileUploadFail = '107';
export const errorCodeBattleDestroyedSuccess = '108';
export const errorCodeReportSubmittedSuccess = '109';
export const errorCodeDataInsertSuccess = '110';
export const errorCodeDataUpdateSuccess = '111';
export const errorCodeDailyQuizAlreadyPlayed = '112';
export const errorCodeNoMatchesPlayed = '113';
export const errorCodeNoUpcomingContest = '114';
export const errorCodeNoContestAvailable = '115';
export const errorCodeNotPlayedContest = '116';
export const errorCodeAlreadyPlayedContest = '117';
export const errorCodePlayAndWinExcitingPrizes = '118';
export const errorCodeRoomAlreadyCreated = '119';
export const errorCodeRoomCreatedSuccessfully = '120';
export const errorCodeRoomDestroyedSuccessfully = '121';
export const errorCodeDefaultMessage = '122';
export const errorCodeNotificationSentSuccessfully = '123';
export const errorCodeInvalidHash = '124';
export const errorCodeAccountHasBeenDeactivated = '126';
export const errorCodeCanNotMakeRequest = '127';
export const errorCodeCategoryAlreadyPlayed = '128';
export const errorCodeUnauthorizedAccess = '129';
export const errorCodeUserExists = '130';
export const errorCodeUserDoesNotExists = '131';
export const errorCodeDataExists = '132'; // Not used in app.
export const errorCodeDailyAdsLimitSucceeded = '133';
export const errorCodeUserCanContinue = '134';
