"use client"
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { getBookmarkData, t } from "@/utils";
import toast from "react-hot-toast";

function Bookmark({ id, onClick, type }) {
const datas = getBookmarkData()

const intislBMState = Object.keys(datas).length !== 0 ? datas.map((a)=>a.question_id).includes(id) : ""

    const [bookmarks, setBookmarks] = useState({});

    useEffect(() => {
        setBookmarks((prevBookmarks) => ({
            ...prevBookmarks,
            [id]: prevBookmarks[id] !== undefined ? prevBookmarks[id] : intislBMState,
        }));
    }, [id]);

    // 2. Handle bookmark toggling
    const handleClick = async (question_id, type) => {
        setBookmarks((prevBookmarks) => {
            const currentBookmarkState = prevBookmarks[question_id];
            const toggleBookmarkState = !currentBookmarkState;

            // Update the bookmark state in the object
            const updatedBookmarks = {
                ...prevBookmarks,
                [question_id]: toggleBookmarkState,
            };

            if (onClick(question_id, toggleBookmarkState, type) === false) {
                return prevBookmarks;
            } else {
                return updatedBookmarks; 
            }
        });
        if(showBookmark){
            toast.success(t("que_removed_bookmark"));
        }else{
            toast.success(t("Que_bookmarked"));
        }
    };

    // 3. Condition to show first time isBookmark Condition
    const showBookmark = bookmarks.hasOwnProperty(id) ? bookmarks[id] : intislBMState;

    return (
        <button className="btn bookmark_btn p-0" onClick={() => handleClick(id, type)}>
            <span>
                {showBookmark ? <FaBookmark className="h-[24px] w-[24px]" /> : <FaRegBookmark className="h-[24px] w-[24px]" />}
            </span>
        </button>
    );
}

Bookmark.propTypes = {
    id: PropTypes.string.isRequired,
    isBookmarked: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
};

export default Bookmark;
