import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useAuth } from "./authContext";

const UserTag = ({ tags, questions }) => {
    const { currentUser } = useAuth();
    const [filteredTags, setFilteredTags] = useState([]);
   // console.log(tags); getting
    useEffect(() => {
        const filteredQuestions = questions.filter((question) => {
            return question.author_email === currentUser.user.email;
        });
        console.log(filteredQuestions);
        const userTags = tags.filter((tag) => {
            return filteredQuestions.some((question) => {
                return question.tags.some((qTag) => qTag._id === tag._id);
            });
        });
        console.log(userTags);
        setFilteredTags(userTags);
    }, [questions, tags,filteredTags]);

    return (
        <div className="tags-grid">
            {filteredTags.map((tag) => (
                <div className="tagNode" key={tag._id}>
                    <h2>{tag.name}</h2>
                </div>
            ))}
        </div>
    );
};

UserTag.propTypes = {
    tags: PropTypes.array.isRequired,
    questions: PropTypes.array.isRequired,
};

export default UserTag;
