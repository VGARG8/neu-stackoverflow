import {useEffect, useState} from "react";
import {useAuth} from "./authContext";
import PropTypes from "prop-types";

const UserTag = ({ tags, questions }) => {
    const { currentUser } = useAuth();
    const [filteredTags, setFilteredTags] = useState([]);

    useEffect(() => {
        const filteredQuestions = questions.filter((question) => {
            return question.author_email === currentUser.user.email;
        });

        const userTagIds = filteredQuestions.reduce((acc, question) => {
            question.tags.forEach((tag) => {
                if (!acc.includes(tag._id)) {
                    acc.push(tag._id);
                }
            });
            return acc;
        }, []);

        const userTags = tags.filter((tag) => userTagIds.includes(tag._id));

        setFilteredTags(userTags);
    }, [questions, tags, currentUser]);

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
