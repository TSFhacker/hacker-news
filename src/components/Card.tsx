import React from "react";
import { useRef } from "react";
import "./Card.scss";

type Props = { ref: any; story: Story; i: number };

type Story = {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
};

export default function Card({ story, i }: Props) {
  return (
    <div className={`card-container card-container--${i % 5}`}>
      <a className="story" href={story.url} target="blank">
        <h2 className="story-title">{story.title}</h2>
        <div className="author">
          by <span className="author-name">{story.by}</span>
        </div>
        <div className="score">Score: {story.score}</div>
      </a>
    </div>
  );
}
