import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
const isQuizEnabled = (WrappedComponent) => {
    const Wrapper = (props) => {
        const router = useRouter();
        const systemconfig = useSelector(state => state.Settings?.systemConfig)
        // const systemconfig = store.getState().Settings?.systemConfig;

        const quizRoutes = [
            { path: "/quiz-zone", config: "quiz_zone_mode" },
            { path: "/quiz-play/daily-quiz-dashboard", config: "daily_quiz_mode" },
            { path: "/quiz-play/true-and-false-play", config: "true_false_mode" },
            { path: "/fun-and-learn", config: "fun_n_learn_question" },
            { path: "/guess-the-word", config: "guess_the_word_question" },
            { path: "/self-learning", config: "self_challenge_mode" },
            { path: "/contest-play", config: "contest_mode" },
            { path: "/random-battle", config: "battle_mode_one" },
            { path: "/group-battle", config: "battle_mode_group" },
            { path: "/audio-questions", config: "audio_mode_question" },
            { path: "/math-mania", config: "maths_quiz_mode" },
            { path: "/exam-module", config: "exam_module" },
            { path: "/multi-match-questions", config: "multi_match_mode" }
        ];
        useEffect(() => {
            const currentRoute = router.pathname;
            const matchedQuiz = quizRoutes.find((quiz) => currentRoute.startsWith(quiz.path));

            if (matchedQuiz && systemconfig[matchedQuiz?.config] === "0") {
                toast.error("Oops! The quiz mode is not available at the moment.");
                router.push("/quiz-play");
            }
        }, [router.pathname, systemconfig]);

        return <WrappedComponent {...props} />;
    };

    return Wrapper;
}

export default isQuizEnabled