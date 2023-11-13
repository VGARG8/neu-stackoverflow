import React from 'react';
import Tag from './tag';
import { timeSince } from '../timeHelper';

const hyperlinkPattern = /\[([^\]]+)]\((https?:\/\/[^)]+)\)/g;

/**
 * AnswerPage component to display a question and its associated answers.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.question - The question object to display.
 * @param {Array} props.tags - The list of tags available.
 * @param {Array} props.answers - The list of answers associated with the question.
 * @param {Function} props.setActivePage - Function to set the current active page/view.
 * @param {Function} props.setSelectedTag - Function to set the currently selected tag.
 * @returns {JSX.Element} The rendered question and its answers.
 */
function AnswerPage({ question, tags, answers, setActivePage, setSelectedTag }) {

    /**
     * Handles the click event on a tag.
     * Sets the clicked tag as the selected tag and changes the active page/view to 'questionsByTag'.
     * 
     * @param {Object} tag - The clicked tag object.
     * @param {Object} event - The event object.
     */
    const handleClickTag = (tag, event) => {
        event.stopPropagation();
        setSelectedTag(tag);
        setActivePage('questionsByTag');
    };

    /**
     * Renders text by replacing markdown-style links with actual hyperlinks.
     * 
     * @param {string} text - The text to be rendered with hyperlinks.
     * @returns {Array} An array containing strings and JSX anchor elements.
     */
    const renderWithLinks = (text) => {
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = hyperlinkPattern.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }
            parts.push(
                <a href={match[2]} target="_blank" rel="noopener noreferrer">
                    {match[1]}
                </a>
            );
            lastIndex = match.index + match[0].length;
        }
        parts.push(text.substring(lastIndex));

        return parts;
    };


  return (
    <div className="answer-page">
      <div id="answersHeader" className="row">
        <span>{answers.length} answers</span>
        <h2>{question.title}</h2>
        <button onClick={() => setActivePage('askQuestion')}>
          Ask a Question
        </button>
      </div>

      <div id="questionBody" className="row">
        <span>{question.views} views</span>
        <p>{renderWithLinks(question.text)}</p>
        <small>
          {question.askedBy} {timeSince(question.askDate, 'question').time}
          {timeSince(question.askDate, 'question').addAgo ? ' ago' : ''}
        </small>
      </div>

      <div className="tags-row">
        <hr style={{ borderStyle: 'dotted' }} />
        {question.tagIds.map((tagId) => {
          const tag = tags.find((t) => t.tid === tagId);
          return <Tag key={tagId} tag={tag} onClick={handleClickTag} />;
        })}
        <hr style={{ borderStyle: 'dotted' }} />
      </div>

      <div className="answers">
        {answers.map((answer) => (
          <div key={answer.aid}>
            <p className="answerText">{renderWithLinks(answer.text)}</p>
            <small className="answerAuthor">
              Answered by {answer.ansBy} {timeSince(answer.ansDate, 'answer').time}
              {timeSince(answer.ansDate, 'answer').addAgo ? ' ago' : ''}
            </small>
            <hr style={{ borderStyle: 'dotted' }} />
          </div>
        ))}
      </div>

      <button onClick={() => setActivePage('answerQuestion')}>
        Answer Question
      </button>
    </div>
  );
}

export default AnswerPage;
