import api from "./apiMiddleware";
import * as apiEndPoints from "./apiEndPoints";
import { store } from "@/store/store";

export const loginLocal = async ({ email = "", mobile = "", password = "" }) => {
  try {
    const formData = new FormData();
    if (email) formData.append("email", email);
    if (mobile) formData.append("mobile", mobile);
    formData.append("password", password);

    const response = await api.post(apiEndPoints.loginLocalApi, formData);
    if (response.status !== 200) {
      throw new Error("Failed to login");
    }
    return response?.data;
  } catch (error) {
    console.error("loginLocal error:", error);
    return null;
  }
};

export const registerLocal = async ({ email = "", password = "", name = "", mobile = "", friends_code = "", web_language = "english", app_language = "english", web_fcm_id = "" }) => {
  try {
    const formData = new FormData();
    if (email) formData.append("email", email);
    if (password) formData.append("password", password);
    if (name) formData.append("name", name);
    if (mobile) formData.append("mobile", mobile);
    if (friends_code) formData.append("friends_code", friends_code);
    if (web_language) formData.append("web_language", web_language);
    if (app_language) formData.append("app_language", app_language);
    if (web_fcm_id) formData.append("web_fcm_id", web_fcm_id);

    const response = await api.post(apiEndPoints.registerLocalApi, formData);
    if (response.status !== 200) {
      throw new Error("Failed to register");
    }
    return response?.data;
  } catch (error) {
    console.error("registerLocal error:", error);
    return null;
  }
};

export const resetLocalPassword = async ({ email = "", newPassword = "" }) => {
  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("new_password", newPassword);
    const response = await api.post(apiEndPoints.resetPasswordLocalApi, formData);
    if (response.status !== 200) {
      throw new Error("Failed to reset password");
    }
    return response?.data;
  } catch (error) {
    console.error("resetLocalPassword error:", error);
    return null;
  }
};

export const createBattleRoomApi = async (payload = {}) => {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    const response = await api.post(apiEndPoints.createBattleRoomApi, formData);
    if (response.status !== 200) {
      throw new Error("Failed to create battle room");
    }
    return response?.data;
  } catch (error) {
    console.error("createBattleRoomApi error:", error);
    return null;
  }
};

export const joinBattleRoomApi = async ({ room_id, user_id, role }) => {
  try {
    const formData = new FormData();
    formData.append("room_id", room_id);
    formData.append("user_id", user_id);
    if (role) formData.append("role", role);
    const response = await api.post(apiEndPoints.joinBattleRoomApi, formData);
    if (response.status !== 200) {
      throw new Error("Failed to join battle room");
    }
    return response?.data;
  } catch (error) {
    console.error("joinBattleRoomApi error:", error);
    return null;
  }
};

export const sendBattleMessage = async ({ room_id, sender_id, message, payload, is_text = true }) => {
  try {
    const formData = new FormData();
    formData.append("room_id", room_id);
    formData.append("sender_id", sender_id);
    formData.append("is_text", String(is_text));
    if (payload) {
      formData.append("payload", JSON.stringify(payload));
    } else if (message) {
      formData.append("message", message);
    }
    const response = await api.post(apiEndPoints.sendBattleMessageApi, formData);
    if (response.status !== 200) {
      throw new Error("Failed to send battle message");
    }
    return response?.data;
  } catch (error) {
    console.error("sendBattleMessage error:", error);
    return null;
  }
};

export const getBattleMessages = async ({ room_id, limit = 30 }) => {
  try {
    const response = await api.get(apiEndPoints.getBattleMessagesApi, {
      params: {
        room_id,
        limit,
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch messages");
    }
    return response?.data;
  } catch (error) {
    console.error("getBattleMessages error:", error);
    return null;
  }
};

export const getBattleState = async ({ room_id }) => {
  try {
    const response = await api.get(apiEndPoints.getBattleStateApi, {
      params: {
        room_id,
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch room state");
    }
    return response?.data;
  } catch (error) {
    console.error("getBattleState error:", error);
    return null;
  }
};

//get language from storage
export const getLanguage = async () => {
  let language = store.getState().Languages.currentLanguage;

  let sysconfig = store.getState().Settings.systemConfig;

  if (language) {
    if (sysconfig && sysconfig.language_mode === "1") {
      return language;
    } else {
      return { id: 0 };
    }
  }
  return { id: 0 };
};

//get system language from storage
export const getSystemLanguage = async () => {
  let language = store.getState().Languages.currenApplang;

  let sysconfig = store.getState().Settings.systemConfig;

  if (language) {
    if (sysconfig && sysconfig.language_mode === "1") {
      return language;
    } else {
      return "english";
    }
  }
  return "english";
};

// 1. check user exists
export const checkUserExistsApi = async ({ firebase_id = "" }) => {
  try {
    const formData = new FormData();
    formData.append("firebase_id", firebase_id);

    const response = await api.post(apiEndPoints.checkUserExistsApi, formData);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 2. register
export const registerApi = async ({
  firebase_id = "",
  type = "",
  username = "",
  email = "",
  image_url = "",
  mobile = "",
  web_fcm_id = "",
  friends_code = "",
  web_language = "",
}) => {
  /**
   * @param
   * type : email / gmail / fb / mobile / apple
   */

  try {
    const formData = new FormData();
    formData.append("firebase_id", firebase_id);
    formData.append("type", type);
    if (username) formData.append("name", username);
    if (email) formData.append("email", email);
    if (image_url) formData.append("profile", image_url);
    if (mobile) formData.append("mobile", mobile);
    if (web_fcm_id) formData.append("web_fcm_id", web_fcm_id);
    if (friends_code) formData.append("friends_code", friends_code);
    if (web_language) formData.append("web_language", web_language);
    const response = await api.post(apiEndPoints.registerApi, formData);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 3. delete user account
export const deleteAccountApi = async () => {
  try {
    const response = await api.post(apiEndPoints.deleteUserAccountApi);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 4. update image profile
export const updateUserProfileImageApi = async ({ image = "" }) => {
  /**
   * @param
   * image : image file
   */

  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await api.post(
      apiEndPoints.updateUserProfileImageApi,
      formData
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 5. update user profile
export const updateUserProfileDataApi = async ({
  email = "",
  name = "",
  mobile = "",
}) => {
  /**
   * @param
   * email : email
   * name : name
   * mobile : mobile
   */

  try {
    const language = await getSystemLanguage();
    const formData = new FormData();
    if (email) formData.append("email", email);
    if (name) formData.append("name", name);
    if (mobile) formData.append("mobile", mobile);
    if (language) formData.append("web_language", language);

    const response = await api.post(
      apiEndPoints.updateUserProfileDataApi,
      formData
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 6. get user statistics
export const getUserStatisticsApi = async () => {
  try {
    const response = await api.post(apiEndPoints.getUserStatisticsApi);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 7. get user by id
export const getUserByIdApi = async () => {
  try {
    const response = await api.post(apiEndPoints.getUserByIdApi);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};


// 9. get user badges
export const getUserBadgesApi = async () => {
  try {
    const response = await api.post(apiEndPoints.getUserBadgesApi);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 10. set user coin store
export const setUserCoinScoreApi = async ({
  coins = "",
  score = "",
  type = "",
  title = "",
}) => {
  /**
   * @param
   * coins : coins  if deduct coin than set with minus sign -2
   * score : score
   * type : type  (dashing_debut, combat_winner, clash_winner, most_wanted_winner, ultimate_player, quiz_warrior, super_sonic, flashback, brainiac, big_thing, elite, thirsty, power_elite, sharing_caring, streak)
   * title : title
   * status : status 0-add coin, 1-deduct coin but now removed
   */
  try {
    const formData = new FormData();
    if (coins) formData.append("coins", coins);
    if (score) formData.append("score", score);
    if (type) formData.append("type", type);
    if (title) formData.append("title", title);

    const response = await api.post(apiEndPoints.setUserCoinScoreApi, formData);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 11. get user coins
export const getUserCoinsApi = async () => {
  try {
    const response = await api.post(apiEndPoints.getUserCoinsApi);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 12. get categories
export const getCategoriesApi = async ({ type = "", sub_type = "" }) => {
  let { id: language_id } = await getLanguage();
  /**
   * @param
   * type : type
   * sub_type : sub_type
   */

  try {
    const formData = new FormData();
    if (type) formData.append("type", type);
    if (sub_type) formData.append("sub_type", sub_type);
    if (language_id) formData.append("language_id", language_id);

    const response = await api.post(apiEndPoints.getCategoriesApi, formData);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 13. get subcategories by main categories
export const getSubcategoriesApi = async ({
  category_id = "",
  subcategory_id = "",
}) => {
  /**
   * @param
   * category_id : category_id
   * subcategory_id : subcategory_id
   */

  let { id: language_id } = await getLanguage();
  try {
    const formData = new FormData();
    if (language_id) formData.append("language_id", language_id);
    if (category_id) formData.append("category_slug", category_id);
    if (subcategory_id) formData.append("subcategory_slug", subcategory_id);

    const response = await api.post(apiEndPoints.getSubcategoriesApi, formData);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 14. get table tracker data
export const getTableTrackerDataApi = async ({
  offset = "",
  limit = "",
  type = "",
}) => {
  /**
   * @param
   * offset : offset
   * limit : limit
   * type : type
   */

  try {
    const formData = new FormData();
    if (offset) formData.append("offset", offset);
    if (limit) formData.append("limit", limit);
    if (type) formData.append("type", type);

    const response = await api.post(
      apiEndPoints.getTableTrackerDataApi,
      formData
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};


// 16. report question
export const reportQuestionApi = async ({ question_id = "", message = "" }) => {
  /**
   * @param
   * question_id : question_id
   * message : message
   */

  try {
    const formData = new FormData();
    if (question_id) formData.append("question_id", question_id);
    if (message) formData.append("message", message);

    const response = await api.post(apiEndPoints.reportQuestionApi, formData);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 17. get daily leaderboard
export const getDailyLeaderBoardApi = async ({ offset = "", limit = "" }) => {
  /**
   * @param
   * offset : offset
   * limit : limit
   */

  try {
    const formData = new FormData();
    if (offset || offset === 0) formData.append("offset", offset);
    if (limit || limit === 0) formData.append("limit", limit);

    const response = await api.post(
      apiEndPoints.getDailyLeaderBoardApi,
      formData
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 18. get monthly leaderboard
export const getMonthlyLeaderBoardApi = async ({ offset = "", limit = "" }) => {
  /**
   * @param
   * offset : offset
   * limit : limit
   */

  try {
    const formData = new FormData();
    if (offset) formData.append("offset", offset);
    if (limit) formData.append("limit", limit);

    const response = await api.post(
      apiEndPoints.getMonthlyLeaderBoardApi,
      formData
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 19. get global leaderboard
export const getGlobleLeaderBoardApi = async ({ offset = "", limit = "" }) => {
  /**
   * @param
   * offset : offset
   * limit : limit
   */

  try {
    const formData = new FormData();
    if (offset) formData.append("offset", offset);
    if (limit) formData.append("limit", limit);

    const response = await api.post(
      apiEndPoints.getGlobleLeaderBoardApi,
      formData
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 20. get languages
export const getLanguagesApi = async ({ id = "" }) => {
  /**
   * @param
   * id : id
   */

  try {
    const formData = new FormData();
    if (id) formData.append("language_id", id);

    const response = await api.post(apiEndPoints.getLanguagesApi, formData);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};


// 22. set bookmark
export const getBookmarkApi = async ({ type = "" }) => {
  /**
   * @param
   * type : type
   */

  try {
    const formData = new FormData();
    if (type) formData.append("type", type);

    const response = await api.post(apiEndPoints.getBookmarkApi, formData);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 23. set bookmark
export const setBookmarkApi = async ({
  question_id = "",
  bookmark = "",
  type = "",
}) => {
  /**
   * @param
   * question_id : question_id
   * bookmark : bookmark
   * type : type (1-Quiz Zone, 3-Guess The Word, 4-audio_question)
   */

  try {
    const formData = new FormData();
    if (question_id) formData.append("question_id", question_id);
    if (bookmark) formData.append("status", bookmark);
    if (type) formData.append("type", type);

    const response = await api.post(apiEndPoints.setBookmarkApi, formData);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 24. get settings
export const getSettingsApi = async ({ type = "" }) => {
  /**
   * @param
   * type : type (empty (""):- all data /about_us / privacy_policy / terms_conditions / contact_us / instructions)
   */

  try {
    const formData = new FormData();
    if (type) formData.append("type", type);

    const response = await api.post(apiEndPoints.getSettingsApi, formData);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 25. get system configurations
export const getSystemConfigurationsApi = async () => {
  try {
    const response = await api.post(apiEndPoints.getSystemConfigurationsApi);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 26. home web settings
export const getWebHomeSettingsApi = async () => {
  let { id: language_id } = await getLanguage();
  try {
    const formData = new FormData();
    language_id !== 0
      ? formData.append("language_id", language_id)
      : formData.append(
          "language_id",
          process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE_CODE
        );
    const response = await api.post(
      apiEndPoints.getWebHomeSettingsApi,
      formData
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 27. get web settings
export const getWebSettingsApi = async () => {
  try {
    const response = await api.post(apiEndPoints.getWebSettingsApi);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 28. get level data

export const getLevelDataApi = async ({
  category_id = "",
  subcategory_id = "",
}) => {
  try {
    const formData = new FormData();
    if (category_id) formData.append("category_slug", category_id);
    if (subcategory_id) formData.append("subcategory_slug", subcategory_id);
    const response = await api.post(apiEndPoints.getLevelDataApi, formData);

    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 29. get questions by level

export const getQuestionApi = async ({
  category_id = "",
  subcategory_id = "",
  level = "",
}) => {
  let { id: language_id } = await getLanguage();
  try {
    const formData = new FormData();
    if (category_id) formData.append("category", category_id);
    if (language_id) formData.append("language_id", language_id);
    if (level) formData.append("level", level);
    if (subcategory_id) formData.append("subcategory", subcategory_id);
    const response = await api.post(apiEndPoints.getQuestionApi, formData);
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};


// 31. get daily quiz

// language_id: language_id,
//       timezone: timezone,
//       gmt_format: gmt_format,

export const getDailyQuizApi = async ({ timezone = "", gmt_format = "" }) => {
  let { id: language_id } = await getLanguage();
  try {
    const formData = new FormData();
    if (language_id) formData.append("language_id", language_id);
    if (timezone) formData.append("timezone", timezone);
    if (gmt_format) formData.append("gmt_format", gmt_format);
    const response = await api.post(apiEndPoints.getDailyQuizApi, formData);
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 32. get questions by type

export const getTrueAndFalseQuestionsApi = async ({ type = "" }) => {
  let { id: language_id } = await getLanguage();
  try {
    const formData = new FormData();
    if (language_id) formData.append("language_id", language_id);
    if (type) formData.append("type", type);
    const response = await api.post(
      apiEndPoints.getTrueAndFalseQuestionsApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 33. get fun and learn

export const getFunAndLearnApi = async ({ type = "", type_id = "" }) => {
  let { id: language_id } = await getLanguage();
  try {
    const formData = new FormData();
    if (language_id) formData.append("language_id", language_id);
    if (type) formData.append("type", type);
    if (type_id) formData.append("type_id", type_id);
    const response = await api.post(apiEndPoints.getFunAndLearnApi, formData);
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 34. get fun and learn questions

export const funandlearnquestionsApi = async ({ fun_n_learn_id = "" }) => {
  let { id: language_id } = await getLanguage();
  try {
    const formData = new FormData();
    if (language_id) formData.append("language_id", language_id);
    if (fun_n_learn_id) formData.append("fun_n_learn_id", fun_n_learn_id);
    const response = await api.post(
      apiEndPoints.funandlearnquestionsApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 35. guess the word questions
//language_id: language_id, //{optional}
//type: type, //category or subcategory
//type_id: type_id, //{if type:category then type_id:category id}

export const guessthewordApi = async ({ type = "", type_id = "" }) => {
  /**
   * @param
   * language_id, {optional}  type, category or subcategory  type_id, {if type:category then type_id:category id}
   */
  let { id: language_id } = await getLanguage();
  try {
    const formData = new FormData();
    if (language_id) formData.append("language_id", language_id);
    if (type) formData.append("type", type);
    if (type_id) formData.append("type_id", type_id);
    const response = await api.post(apiEndPoints.guessthewordApi, formData);
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 36. selfQuestionApi

export const getSelfQuestionApi = async ({
  category = "",
  subcategory = "",
  limit = "",
}) => {
  let { id: language_id } = await getLanguage();
  try {
    const formData = new FormData();
    if (language_id) formData.append("language_id", language_id);
    if (category) formData.append("category_slug", category);
    if (subcategory) formData.append("subcategory_slug", subcategory);
    if (limit) formData.append("limit", limit);
    const response = await api.post(apiEndPoints.getSelfQuestionApi, formData);
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 37 get contest

export const getContestApi = async ({ timezone = "", gmt_format = "" }) => {
  let { id: language_id } = await getLanguage();
  try {
    const formData = new FormData();
    if (language_id) formData.append("language_id", language_id);
    if (timezone) formData.append("timezone", timezone);
    if (gmt_format) formData.append("gmt_format", gmt_format);
    const response = await api.post(apiEndPoints.getContestApi, formData);
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 38. get contest questions

export const getContestQuestionsApi = async ({ contest_id = "" }) => {
  let { id: language_id } = await getLanguage();
  try {
    const formData = new FormData();
    if (language_id) formData.append("language_id", language_id);
    if (contest_id) formData.append("contest_id", contest_id);
    const response = await api.post(
      apiEndPoints.getContestQuestionsApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 39. get contest leaderboard

export const getContestLeaderboardApi = async ({
  contest_id = "",
  offset = "",
  limit = "",
}) => {
  let { id: language_id } = await getLanguage();
  try {
    const formData = new FormData();
    if (language_id) formData.append("language_id", language_id);
    if (contest_id) formData.append("contest_id", contest_id);
    if (offset) formData.append("offset", offset);
    if (limit) formData.append("limit", limit);
    const response = await api.post(
      apiEndPoints.getContestLeaderboardApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};


// 41. get random question api

export const getRandomQuestionsApi = async ({
  match_id = "",
  category = "",
  entry_coin = "",
}) => {
  /**
   * @param
   */

  let { id: language_id } = await getLanguage();
  try {
    const formData = new FormData();
    if (language_id) formData.append("language_id", language_id);
    if (match_id) formData.append("match_id", match_id);
    if (category) formData.append("category", category);
    if (entry_coin) formData.append("entry_coin", entry_coin);
    const response = await api.post(
      apiEndPoints.getRandomQuestionsApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 42. get question by room id
// room_id

export const getQuestionByRoomIdApi = async ({ room_id = "", category = "", entry_coin = "" }) => {
  try {
    const formData = new FormData();
    if (room_id) formData.append("room_id", room_id);
    if (category) formData.append("category", category);
    if (entry_coin) formData.append("entry_coin", entry_coin);
    const response = await api.post(
      apiEndPoints.getQuestionByRoomIdApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 43. get battle statistics
// sort: sort, // is_drawn / winner_id // {optional}
//       order: order, //DESC / ASC // {optional}
//       offset: offset, // {optional} - Starting position
//       limit: limit, // {optional} - number of records per page

export const getBattleStaticticsApi = async ({
  sort = "",
  order = "",
  offset = "",
  limit = "",
}) => {
  /**
   * @param
   *  sort: sort, // is_drawn / winner_id // {optional}
      order: order, //DESC / ASC {optional}
      offset: offset, {optional} - Starting position
      limit: limit, {optional} - number of records per page
   */
  try {
    const formData = new FormData();
    if (sort) formData.append("sort", sort);
    if (order) formData.append("order", order);
    if (offset) formData.append("offset", offset);
    if (limit) formData.append("limit", limit);
    const response = await api.post(
      apiEndPoints.getBattleStaticticsApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 44. create room
// language_id: language_id,
//       room_id: room_id,
//       room_type: room_type, // private or public
//       category: category, // required if room category enable form panel
//       no_of_que: no_of_que,

export const createRoomApi = async ({
  room_id = "",
  room_type = "",
  category = "",
  no_of_que = "",
  entry_coin = "",

}) => {
  /**
   * @param
   *  room_type: room_type, // private or public
      category: category, // required if room category enable form panel
   */
  let { id: language_id } = await getLanguage();
  try {
    const formData = new FormData();
    if (language_id) formData.append("language_id", language_id);
    if (room_id) formData.append("room_id", room_id);
    if (room_type) formData.append("room_type", room_type);
    if (category) formData.append("category", category);
    if (no_of_que) formData.append("no_of_que", no_of_que); 
    if (entry_coin) formData.append("entry_coin", entry_coin);
    const response = await api.post(apiEndPoints.createRoomApi, formData);
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};


// 46. audio question api

export const getAudioQuestionApi = async ({ type = "", type_id = "" }) => {
  /**
   * @param
   *  language_id: language_id, //{optional}
      type: type, //category or subcategory
      type_id: type_id, //{if type:category then type_id:category id}
   */
  let { id: language_id } = await getLanguage();
  try {
    const formData = new FormData();
    if (language_id) formData.append("language_id", language_id);
    if (type) formData.append("type", type);
    if (type_id) formData.append("type_id", type_id);
    const response = await api.post(apiEndPoints.getAudioQuestionApi, formData);
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 47. getMatchQuestionsApi

export const getMatchQuestionsApi = async ({ type = "", type_id = "" }) => {
  /**
   * @param
      type: type, //category or subcategory
      type_id: type_id, //{if type:category then type_id:category id}
   */
  try {
    const formData = new FormData();
    if (type) formData.append("type", type);
    if (type_id) formData.append("type_id", type_id);
    const response = await api.post(
      apiEndPoints.getMatchQuestionsApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 48. get exam modual api
// language_id: language_id, //{optional}
//       type: type, //1-today, 2-completed
//       offset: offset, // {optional} - Starting position
//       limit: limit, // {optional} - number of records per page
//       timezone: timezone,
//       gmt_format: gmt_format,

export const getExamModualApi = async ({
  type = "",
  offset = "",
  limit = "",
  timezone = "",
  gmt_format = "",
}) => {
  /**
   * @param
   *   language_id: language_id, //{optional}
       type: type, 1-today, 2-completed
       offset: offset,  {optional} - Starting position
       limit: limit,  {optional} - number of records per page
       timezone: timezone,
       gmt_format: gmt_format,
   */
  let { id: language_id } = await getLanguage();
  try {
    const formData = new FormData();
    if (gmt_format) formData.append("gmt_format", gmt_format);
    if (language_id) formData.append("language_id", language_id);
    if (limit) formData.append("limit", limit);
    if (offset) formData.append("offset", offset);
    if (timezone) formData.append("timezone", timezone);
    if (type) formData.append("type", type);
    const response = await api.post(apiEndPoints.getExamModualApi, formData);
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 49. get exam modual questions api
// exam_module_id

export const getExamModualQuestionsApi = async ({ exam_module_id = "" }) => {
  try {
    const formData = new FormData();
    if (exam_module_id) formData.append("exam_module_id", exam_module_id);
    const response = await api.post(
      apiEndPoints.getExamModualQuestionsApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 50.set exam modual result api

export const setExamModualResultApi = async ({
  exam_module_id = "",
  total_duration = "",
  obtained_marks = "",
  statistics = "",
  rules_violated = "",
  captured_question_ids = "",
}) => {
  /*
      statistics: statistics, //statistics:[{"mark":"1","correct_answer":"2","incorrect":"3"},{"mark":"2","correct_answer":"2","incorrect":"3"}]
      rules_violated: rules_violated,
      captured_question_ids: captured_question_ids, //Array of String
*/
  try {
    const formData = new FormData();
    if (exam_module_id) formData.append("exam_module_id", exam_module_id);
    if (total_duration) formData.append("total_duration", total_duration);
    if (obtained_marks !== null || obtained_marks !== undefined) formData.append("obtained_marks", obtained_marks);
    if (statistics) formData.append("statistics", statistics);
    if (rules_violated) formData.append("rules_violated", rules_violated);
    if (captured_question_ids)
      formData.append("captured_question_ids", captured_question_ids);
    const response = await api.post(
      apiEndPoints.setExamModualResultApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 51. get payment api fetch
// offset: offset, //optional
//       limit: limit, //optional

export const getPaymentRequestApi = async ({ offset = "", limit = "" }) => {
  try {
    const formData = new FormData();
    if (limit) formData.append("limit", limit);
    if (offset) formData.append("offset", offset);
    const response = await api.post(
      apiEndPoints.getPaymentRequestApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 52. set payment request api

export const setPaymentRequestApi = async ({
  payment_type = "",
  payment_address = "",
  payment_amount = "",
  coin_used = "",
  details = "",
}) => {
  try {
    const formData = new FormData();
    if (payment_type) formData.append("payment_type", payment_type);
    if (payment_address) formData.append("payment_address", payment_address);
    if (payment_amount) formData.append("payment_amount", payment_amount);
    if (coin_used) formData.append("coin_used", coin_used);
    if (details) formData.append("details", details);
    const response = await api.post(
      apiEndPoints.setPaymentRequestApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 53. delete payment pending request api

export const deletePendingPaymentRequestApi = async ({ payment_id = "" }) => {
  try {
    const formData = new FormData();
    if (payment_id) formData.append("payment_id", payment_id);
    const response = await api.post(
      apiEndPoints.deletePendingPaymentRequestApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 55. unlock premium categorys api

export const unlockPremiumCatApi = async ({ cat_id = "" }) => {
  /*
  category: cat_id, //required
  */
  try {
    const formData = new FormData();
    if (cat_id) formData.append("category", cat_id);
    const response = await api.post(apiEndPoints.unlockPremiumCatApi, formData);
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// 56.get multimatch question by level api

export const getMultiMatchQuestionByLevelApi = async ({
  level = "",
  category = "",
  subcategory = "",
}) => {
  try {
    const formData = new FormData();
    if (level) formData.append("level", level);
    if (category) formData.append("category", category);
    if (subcategory) formData.append("subcategory", subcategory);
    const response = await api.post(
      apiEndPoints.getMultiMatchQuestionByLevelApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("error fetching data:", error);
    return null;
  }
};

// 57. multi match report question api

export const multiMatchReportQuestionApi = async ({
  question_id = "",
  message = "",
}) => {
  try {
    const formData = new FormData();
    if (question_id) formData.append("question_id", question_id);
    if (message) formData.append("message", message);
    const response = await api.post(
      apiEndPoints.multiMatchReportQuestionApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("error fetching data:", error);
    return null;
  }
};


// 59. get multi match level api
// category_slug: category_slug,
//       subcategory_slug: subcategory_slug,

export const getMultiMatchLevelApi = async ({
  category_slug = "",
  subcategory_slug = "",
}) => {
  try {
    const formData = new FormData();
    if (category_slug) formData.append("category_slug", category_slug);
    if (subcategory_slug) formData.append("subcategory_slug", subcategory_slug);
    const response = await api.post(
      apiEndPoints.getMultiMatchLevelApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("error fetching data:", error);
    return null;
  }
};

// 60. get system language list api
// from: 2,

export const getSystemLanguageListApi = async () => {
  try {
    const formData = new FormData();
    formData.append("from", 2);
    const response = await api.post(
      apiEndPoints.getSystemLanguageListApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("error fetching data:", error);
    return null;
  }
};

// 61. get system language json
// from: 2,
//       language: language,

export const getSystemLanguageJsonApi = async ({ language = "" }) => {
  try {
    const formData = new FormData();
    formData.append("from", 2);
    if (language) formData.append("language", language);
    const response = await api.post(
      apiEndPoints.getSystemLanguageJsonApi,
      formData
    );
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("error fetching data:", error);
    return null;
  }
};

// 62. get notification api
// sort: id, // {optional} - id / users / type
//       order: order, // {optional} - DESC / ASC
//       offset: offset, // {optional} - Starting position
//       limit: limit, // {optional} - number of records per page

export const getNotificationApi = async ({
  sort = "",
  order = "",
  offset = "",
  limit = "",
}) => {
  try {
    const formData = new FormData();
    if (sort) formData.append("sort", sort);
    if (order) formData.append("order", order);
    if (offset) formData.append("offset", offset);
    if (limit) formData.append("limit", limit);
    const response = await api.post(apiEndPoints.getNotificationApi, formData);
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }

    return response?.data;
  } catch (error) {
    console.error("error fetching data:", error);
    return null;
  }
};

// 63. update fcm id

export const updateFcmIdApi = async ({ web_fcm_id = "" }) => {
  try {
    const formData = new FormData();
    if (web_fcm_id) formData.append("web_fcm_id", web_fcm_id);
    const response = await api.post(apiEndPoints.updateFcmIdApi, formData);
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("error fetching data:", error);
    return null;
  }
};

// 64. update user coin and score

export const setQuizCoinScoreApi = async ({
  category = "",
  subcategory = "",
  quiz_type = "",
  play_questions = "",
  lifeline = "",
  match_id = "",
  is_bot = "",
  total_play_time = "",
  no_of_hint_used = "",
  joined_users_count = "",
}) => {
  try {
    const formData = new FormData();
    if (category) formData.append("category", category);
    if (subcategory) formData.append("subcategory", subcategory);
    if (quiz_type) formData.append("quiz_type", quiz_type);
    if (play_questions) formData.append("play_questions", play_questions);
    if (lifeline) formData.append("lifeline", lifeline);
    if (match_id) formData.append("match_id", match_id);
    if (is_bot) formData.append("is_bot", is_bot);
    if (total_play_time) formData.append("total_play_time", total_play_time);
    if (no_of_hint_used) formData.append("no_of_hint_used", no_of_hint_used);
    if (joined_users_count) formData.append("joined_users_count", joined_users_count);
    const response = await api.post(apiEndPoints.setQuizCoinScoreApi, formData);
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("error fetching data:", error);
    return null;
  }
};

// 65. get questions without level
export const getQuestionsWithoutLevelApi = async ({type = "",id = ""}) => {
  const formData = new FormData();
  if (type) formData.append("type", type);
  if (id) formData.append("id", id);
  try {
    const response = await api.post(apiEndPoints.getQuestionsWithoutLevelApi, formData);
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("error fetching data:", error);
    return null;
  }
};
// 65. get questions without level
export const getMultiMatchQuestionsApi = async ({type = "",id = ""}) => {
  const formData = new FormData();
  if (type) formData.append("type", type);
  if (id) formData.append("id", id);
  try {
    const response = await api.post(apiEndPoints.getMultiMatchQuestionsApi, formData);
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    return response?.data;
  } catch (error) {
    console.error("error fetching data:", error);
    return null;
  }
};
