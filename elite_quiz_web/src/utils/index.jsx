import cryptoJs from "crypto-js";
import { store } from "../store/store";
import { Loadbookmarkdata } from "../store/reducers/bookmarkSlice";
import { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import userImg from "@/assets/images/user.svg";
import enTranslation from "../locale/en.json";
import {
  errorCodeProfileUpdateSuccess,
  errorCodeFileUploadFail,
} from "../api/apiEndPoints";
import {
  imageUploadSuccess,
  profileUpdateDataSuccess,
} from "@/store/reducers/userSlice";
import {
  getBookmarkApi,
  multiMatchReportQuestionApi,
  reportQuestionApi,
  setBookmarkApi,
} from "@/api/apiRoutes";
import placeholderImage from "@/assets/images/Elite Placeholder.svg";
// -----------------global functions-----------------------------

// getSiblings, getClosest, slideUp, slideDown, slideToggle :- mobile navigation and navbar for header
export const getSiblings = function (elem) {
  let siblings = [];
  let sibling = elem.parentNode.firstChild;
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== elem) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  return siblings;
};

export const getClosest = function (elem, selector) {
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.matches(selector)) return elem;
  }
  return null;
};

export const slideUp = (element, duration = 500) => {
  return new Promise(function (resolve) {
    element.style.height = element.offsetHeight + "px";
    element.style.transitionProperty = `height, margin, padding`;
    element.style.transitionDuration = duration + "ms";
    // element.offsetHeight;
    element.style.overflow = "hidden";
    element.style.height = 0;
    element.style.paddingTop = 0;
    element.style.paddingBottom = 0;
    element.style.marginTop = 0;
    element.style.marginBottom = 0;
    window.setTimeout(function () {
      element.style.display = "none";
      element.style.removeProperty("height");
      element.style.removeProperty("padding-top");
      element.style.removeProperty("padding-bottom");
      element.style.removeProperty("margin-top");
      element.style.removeProperty("margin-bottom");
      element.style.removeProperty("overflow");
      element.style.removeProperty("transition-duration");
      element.style.removeProperty("transition-property");
      resolve(false);
    }, duration);
  });
};

export const slideDown = (element, duration = 500) => {
  return new Promise(function () {
    element.style.removeProperty("display");
    let display = window.getComputedStyle(element).display;

    if (display === "none") display = "block";

    element.style.display = display;
    let height = element.offsetHeight;
    element.style.overflow = "hidden";
    element.style.height = 0;
    element.style.paddingTop = 0;
    element.style.paddingBottom = 0;
    element.style.marginTop = 0;
    element.style.marginBottom = 0;
    // element.offsetHeight;
    element.style.transitionProperty = `height, margin, padding`;
    element.style.transitionDuration = duration + "ms";
    element.style.height = height + "px";
    element.style.removeProperty("padding-top");
    element.style.removeProperty("padding-bottom");
    element.style.removeProperty("margin-top");
    element.style.removeProperty("margin-bottom");
    window.setTimeout(function () {
      element.style.removeProperty("height");
      element.style.removeProperty("overflow");
      element.style.removeProperty("transition-duration");
      element.style.removeProperty("transition-property");
    }, duration);
  });
};

export const slideToggle = (element, duration = 500) => {
  if (window.getComputedStyle(element).display === "none") {
    return slideDown(element, duration);
  } else {
    return slideUp(element, duration);
  }
};

// is login user check
export const isLogin = () => {
  let user = store.getState().User;
  if (user) {
    try {
      // user = JSON.parse(user);
      if (user.data.api_token) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  return false;
};

// decrypt answer wont show inspect element
export const decryptAnswer = (encrypted_json_string, key) => {
  let obj_json = encrypted_json_string;
  let encrypted = obj_json.ciphertext;
  let iv = cryptoJs.enc.Hex.parse(obj_json.iv);
  key += "0000";
  key = cryptoJs.enc.Utf8.parse(key);
  try {
    let decrypted = cryptoJs.AES.decrypt(encrypted, key, {
      iv: iv,
    }).toString(cryptoJs.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.log(error);
  }
};

// load bookmark data
export const getAndUpdateBookmarkData = async (type) => {
  const response = await getBookmarkApi({ type: type });

  if (response.error) {
    toast.error(t("no_que_found"));
    navigate.push("/");
  }

  if (response.data.length > 0) {
    Loadbookmarkdata(response.data);
  }

  if (response.data.length === 0) {
    Loadbookmarkdata([]);
  }
};

// get bookmark data
export const getBookmarkData = () => {
  let alldata = store.getState().Bookmark.data;
  if (alldata) {
    return alldata;
  }
  return false;
};

// delete bookmarkdata
export const deleteBookmarkData = (bookmark_id) => {
  let alldata = store.getState().Bookmark.data;
  if (alldata) {
    alldata = Object.values(alldata).filter((bookmark) => {
      return bookmark.id !== bookmark_id;
    });
    Loadbookmarkdata(alldata);
  }
  return false;
};

// delete bookmark data by questionsid
export const deleteBookmarkByQuestionID = (question_id) => {
  let alldata = store.getState().Bookmark.data;
  if (alldata) {
    alldata = Object.values(alldata).filter((bookmark) => {
      return bookmark.question_id !== question_id;
    });
    Loadbookmarkdata(alldata);
    return alldata;
  }
  return false;
};

//scrollhandler in mobile device
export const scrollhandler = (top) => {
  const scrollTohowItWorks = () =>
    window.scroll({
      top: top,
      left: 0,
      behavior: "smooth",
    });
  if (window.innerWidth <= 600) {
    scrollTohowItWorks();
  }
  return false;
};

// server image error
export const imgError = (e) => {
  e.target.src = userImg.src;
};

export const playAudio = (audioSrc) => {
  const audio = new Audio(audioSrc);
  audio.play();
};

// audio quiz
export const audioPlay = (selected_option, currentQuestion_Answer) => {
  const systemconfig = store && store.getState().Settings.systemConfig;
  const userData = store && store.getState().User;
  const decryptedAnswer = decryptAnswer(
    currentQuestion_Answer,
    userData?.data?.firebase_id
  );

  if (systemconfig && systemconfig.answer_mode === "1") {
    if (decryptedAnswer === selected_option) {
      playAudio("../../../../assets/audio/right.mp3");
    } else {
      playAudio("../../../../assets/audio/wrong.mp3");
    }
  }

  if (systemconfig && systemconfig.answer_mode === "2") {
    playAudio("../../../../assets/audio/click.mp3");
  }

  if (systemconfig && systemconfig.answer_mode === "3") {
    if (decryptedAnswer === selected_option) {
      playAudio("../../../../assets/audio/right.mp3");
    } else {
      playAudio("../../../../assets/audio/wrong.mp3");
    }
  }
};

export const audioPlayGuessthework = (
  selected_option,
  currentQuestion_Answer
) => {
  const systemconfig = store && store.getState().Settings.systemConfig;
  const userData = store && store.getState().User;
  const decryptedAnswer = decryptAnswer(
    currentQuestion_Answer,
    userData?.data?.firebase_id
  )
    .toUpperCase()
    .replaceAll(/\s/g, "");

  if (systemconfig && systemconfig.answer_mode === "1") {
    if (decryptedAnswer === selected_option) {
      playAudio("../../../../assets/audio/right.mp3");
    } else {
      playAudio("../../../../assets/audio/wrong.mp3");
    }
  }

  if (systemconfig && systemconfig.answer_mode === "2") {
    playAudio("../../../../assets/audio/click.mp3");
  }

  if (systemconfig && systemconfig.answer_mode === "3") {
    if (decryptedAnswer === selected_option) {
      playAudio("../../../../assets/audio/right.mp3");
    } else {
      playAudio("../../../../assets/audio/wrong.mp3");
    }
  }
};

// option answer status check
export const showAnswerStatusClass = (
  option,
  currentQuestion_is_Answered,
  currentQuestion_Answer,
  currentQuestion_selected_answer
) => {
  // this is old logic
  // if (questions[currentQuestion].isAnswered) {
  //   if (systemconfig && systemconfig.answer_mode === '1') {
  //     let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData?.data?.firebase_id)
  //     if (decryptedAnswer === option) {
  //       return 'bg-success'
  //     } else if (questions[currentQuestion].selected_answer === option) {
  //       return 'bg-danger'
  //     }
  //   } else if (questions[currentQuestion].selected_answer === option) {
  //     return 'bg-dark'
  //   } else {
  //     return false
  //   }
  // } else {
  //   return false
  //

  const systemconfig = store && store.getState().Settings.systemConfig;
  const userData = store && store.getState().User;
  const decryptedAnswer = decryptAnswer(
    currentQuestion_Answer,
    userData?.data?.firebase_id
  );

  if (currentQuestion_is_Answered) {
    // show correctness answer
    if (systemconfig && systemconfig.answer_mode === "1") {
      if (currentQuestion_selected_answer === option) {
        if (decryptedAnswer === option) {
          return "bg-success";
        } else {
          return "bg-danger";
        }
      } else {
        return false;
      }
    }

    // show incorrect answer
    if (systemconfig && systemconfig.answer_mode === "2") {
      if (currentQuestion_selected_answer === option) {
        return "bg-theme";
      } else {
        return false;
      }
    }

    // // show correct answer and incorrect answer
    if (systemconfig && systemconfig.answer_mode === "3") {
      if (decryptedAnswer === option) {
        return "bg-success";
      } else if (currentQuestion_selected_answer === option) {
        return "bg-danger";
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};

// roomCode generater
export const roomCodeGenerator = (type) => {
  const systemconfig = store && store.getState().Settings.systemConfig;
  const numbers = "1234567890";
  const letters = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
  const number_with_letters =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";

  const getRandomCharacter = (characters) => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters.charAt(randomIndex);
  };

  const generateRoomCode = (characters) => {
    let roomCode = "";
    for (let i = 0; i < 6; i++) {
      roomCode += getRandomCharacter(characters);
    }
    return roomCode;
  };

  let characters;

  if (type === "onevsone") {
    if (systemconfig.battle_mode_one_code_char === "2") {
      characters = letters;
    } else if (systemconfig.battle_mode_one_code_char === "3") {
      characters = number_with_letters;
    } else {
      characters = numbers;
    }
  } else if (type === "groupbattle") {
    if (systemconfig.battle_mode_group_code_char === "2") {
      characters = letters;
    } else if (systemconfig.battle_mode_group_code_char === "3") {
      characters = number_with_letters;
    } else {
      characters = numbers;
    }
  } else {
    return false;
  }

  return generateRoomCode(characters);
};

export const truncate = (text, maxLength) => {
  // Check if text is undefined or null
  if (!text) {
    return ""; // or handle the case as per your requirement
  }

  // If the text length is less than or equal to maxLength, return the original text
  if (text.length <= maxLength) {
    return text;
  } else {
    // Otherwise, truncate the text to maxLength characters and append ellipsis
    return text.slice(0, maxLength) + "...";
  }
};

export const isValidSlug = (slug) => {
  return slug && slug.trim() !== "";
};

export const useOverflowRefs = (questions, currentQuestion) => {
  const buttonRefA = useRef(null);
  const buttonRefB = useRef(null);
  const buttonRefC = useRef(null);
  const buttonRefD = useRef(null);
  const buttonRefE = useRef(null);

  applyOverflowStyle(buttonRefA, [questions[currentQuestion]]);

  applyOverflowStyle(buttonRefB, [questions[currentQuestion]]);

  applyOverflowStyle(buttonRefC, [questions[currentQuestion]]);

  applyOverflowStyle(buttonRefD, [questions[currentQuestion]]);

  applyOverflowStyle(buttonRefE, [questions[currentQuestion]]);

  return { buttonRefA, buttonRefB, buttonRefC, buttonRefD, buttonRefE };
};

export const applyOverflowStyle = (ref, dependencies) => {
  useEffect(() => {
    if (ref.current) {
      const hasMathTex = ref.current.innerHTML.includes("math-tex");
      const hasTable = ref.current.innerHTML.includes("<table");

      const confForScrole =
        ref.current.scrollHeight > ref.current.clientHeight ? true : false;

      confForScrole
        ? (ref.current.style.alignItems = "baseline")
        : (ref.current.style.alignItems = "center");
    }
  }, dependencies);
};

export const t = (label) => {
  const langData =
    store.getState().Languages?.languageJsonData &&
    store.getState().Languages?.languageJsonData[label];
  if (langData) {
    return langData;
  } else if (enTranslation[label]) {
    return enTranslation[label];
  } else {
    // console.log(`Translation missing for label: ${label}`);
    return label;
  }
};

export const RenderHtmlContent = ({ htmlContent }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    // Sanitize HTML content
    const sanitizedHtml = DOMPurify && DOMPurify.sanitize(htmlContent);
    // Set the sanitized HTML content
    containerRef.current.innerHTML = sanitizedHtml;

    // Trigger MathJax typesetting
    window.MathJax.Hub.Queue([
      "Typeset",
      window.MathJax.Hub,
      containerRef.current,
    ]);
  }, [htmlContent]);

  return <div ref={containerRef} />;
};

const ERROR_CODES = {
  "auth/user-not-found": t("user_not_found"),
  "auth/wrong-password": t("invalid_password"),
  "auth/email-already-in-use": t("email_already_in_use"),
  "auth/invalid-email": t("invalid_email"),
  "auth/user-disabled": t("user_disabled"),
  "auth/too-many-requests": t("too_many_requests"),
  "auth/operation-not-allowed": t("operation_not_allowed"),
  "auth/internal-error": t("internal_error"),
};

// Error handling function
export const handleFirebaseAuthError = (errorCode) => {
  // Check if the error code exists in the global ERROR_CODES object
  if (ERROR_CODES.hasOwnProperty(errorCode)) {
    // If the error code exists, log the corresponding error message
    toast.error(ERROR_CODES[errorCode]);
    //   console.error(ERROR_CODES[errorCode]);
  } else {
    // If the error code is not found, log a generic error message
    toast.error(`Unknown error occurred: ${errorCode}`);
    //   console.error(`Unknown error occurred: ${errorCode}`);
  }

  // Optionally, you can add additional logic here to handle the error
  // For example, display an error message to the user, redirect to an error page, etc.
};

// message list of battle
export const messageList = () => {
  const messageListData = [
    "Hello..!!",
    "How are you..?",
    "Fine..!!",
    "Have a nice day..",
    "Well played",
    "What a performance..!!",
    "Thanks..",
    "Welcome..",
    "Merry Christmas",
    "Happy new year",
    "Happy Diwali",
    "Good night",
    "Hurry Up",
    "Dudeeee",
  ];
  return messageListData;
};

// report Question
const MySwal = withReactContent(Swal);
export const reportQuestion = (question_id, isMulti = false) => {
  MySwal.fire({
    showCancelButton: true,
    customClass: {
      confirmButton: "Swal-confirm-buttons",
      cancelButton: "Swal-cancel-buttons",
    },
    confirmButtonText: t("continue"),
    input: "textarea",
    inputLabel: t("reason"),
    inputPlaceholder: t("enter_reason"),
    inputAttributes: {
      "aria-label": t("enter_reason"),
    },
    // Add validation to ensure message is not empty
    preConfirm: (value) => {
      if (!value || value.trim() === "") {
        MySwal.showValidationMessage(
          t("reason_required") || "Please provide a reason for reporting"
        );
        return false;
      }
      return value;
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      // Only proceed if result.value exists and is not empty
      if (result.value && result.value.trim() !== "") {
        if (isMulti) {
          const response = await multiMatchReportQuestionApi({
            question_id: question_id,
            message: result.value,
          });
          console.log(response);
          if (!response?.error) {
            Swal.fire(t("success"), t("que_reported"), "success");
          } else {
            Swal.fire(t("ops"), `${t("Please")} ${t("try_again")}`);
            console.log(response);
          }
        } else {
          const reportQuestion = async () => {
            const response = await reportQuestionApi({
              question_id: question_id,
              message: result.value,
            });
            // if (response.message !== 200) {
            //   // throw new Error("Failed to fetch data");
            // }
            if (!response?.error) {
              Swal.fire(t("success"), t("que_reported"), "success");
            }
            if (response.error) {
              Swal.fire(t("ops"), `${t("Please")} ${t("try_again")}`, "error");
              console.log(response.error);
            }
          };

          reportQuestion();
        }
      }
    }
  });
};

// bookmark button click

export const handleBookmarkClick = async (question_id, isBookmarked, type) => {
  let bookmark = "0";

  if (isBookmarked) bookmark = "1";
  else bookmark = "0";

  const response = await setBookmarkApi({
    question_id: question_id,
    bookmark: bookmark,
    type: type,
  });

  if (response.error) {
    toast.error(t("not_remove_que"));
    return false;
  } else {
    if (isBookmarked) {
      getAndUpdateBookmarkData(type);
    } else {
      deleteBookmarkByQuestionID(question_id);
    }
    return true;
  }
};

/**
 * Returns the client's current time zone.
 *
 * @returns {string} The client's current time zone.
 */
export const getClientTimeZone = () => {
  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return currentTimezone;
};

/**
 * Returns the client's current time zone offset in the format +/-HH:MM.
 *
 * @returns {string} The client's current time zone offset.
 */
export const getClientTimeZoneGMTFormat = () => {
  // Get timezone offset in minutes
  const offsetMinutes = new Date().getTimezoneOffset();

  // Convert to hours and minutes
  const absOffset = Math.abs(offsetMinutes);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;

  // Format hours and minutes to ensure two digits
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  // Determine the sign (negative offset means ahead of GMT)
  const sign = offsetMinutes <= 0 ? "+" : "-";

  return `${sign}${formattedHours}:${formattedMinutes}`;
};

/**
 * Handles profile image upload API responses
 * @param {Object} response - The API response object
 * @param {Function} dispatch - Redux dispatch function
 * @returns {boolean} - Returns true if successful, false otherwise
 */
export const handleProfileImageResponse = (response, dispatch) => {
  if (!response || !response.message) {
    toast.error(t("An unexpected error occurred"));
    return false;
  }

  switch (response.message) {
    case errorCodeProfileUpdateSuccess:
      // Update the profile image in Redux store
      dispatch(imageUploadSuccess(response?.data?.profile));
      toast.success(t("successfully_updated"));
      return true;

    case errorCodeFileUploadFail:
      toast.error(t("File not supported! Please select proper image type"));
      return false;

    default:
      toast.error(response.message || t("An unexpected error occurred"));
      return false;
  }
};

/**
 * Handles profile data update API responses
 * @param {Object} response - The API response object
 * @param {Function} dispatch - Redux dispatch function
 * @param {Object} profileData - The profile data object containing email, name, and mobile
 * @returns {boolean} - Returns true if successful, false otherwise
 */
export const handleProfileDataResponse = (response, dispatch, profileData) => {
  if (!response || !response.message) {
    toast.error(t("An unexpected error occurred"));
    return false;
  }

  switch (response.message) {
    case errorCodeProfileUpdateSuccess:
      // Update the profile data in Redux store using the provided profile data
      const data = {
        email: profileData.email,
        name: profileData.name,
        mobile: profileData.mobile,
      };
      dispatch(profileUpdateDataSuccess(data));
      toast.success(t("successfully_updated"));
      return true;

    default:
      toast.error(response.message || t("An unexpected error occurred"));
      return false;
  }
};

export const getImageSource = (image) => {
  return image || placeholderImage?.src;
};

export const handleImageError = (e) => {
  e.target.src = placeholderImage?.src;
};

export const convertTimeToSeconds = (timeString) => {
  try {
    // Split the time string by ':'
    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    // Convert everything to seconds
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    return totalSeconds;
  } catch (error) {
    console.error("Error converting time to seconds:", error);
    return 0; // Return 0 if there's an error
  }
};
