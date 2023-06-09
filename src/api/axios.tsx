import axios from "axios";

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

export const getStoriesPage = (pageParam = 1, option = {}) => {
  let idList: number[];
  const storyList: any = [];
  axios
    .get("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
    .then((response) => {
      idList = response.data;
      console.log(idList);
    })
    .then((response) => {
      for (const id of idList.slice(0, 20)) {
        axios
          .get(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
          )
          .then((response) => {
            storyList.push(response.data);
          });
      }
    });
  return storyList;
};
