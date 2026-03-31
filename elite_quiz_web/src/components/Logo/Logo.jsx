"use client"
import { getImageSource } from "@/utils";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";


const Logo = ({ image,setIsActive }) => {
    return (
        <div>
            <Link href="/" onClick={() => setIsActive(false)}>
                <img className="opacity-100 h-20 object-contain" src={getImageSource(image)} alt=" Logo" />
            </Link>
        </div>
    );
};

Logo.propTypes = {
    image: PropTypes.string,
};

export default Logo;
