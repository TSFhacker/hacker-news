import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import "./Main.scss";
import ClipLoader from "react-spinners/ClipLoader";
import Card from "./Card";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ResponseAPI } from "../interfaces";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loading } from "./Loading";

const fetcher = (page: number): Promise<ResponseAPI> =>
  fetch(`https://rickandmortyapi.com/api/character/?page=${page}`).then((res) =>
    res.json()
  );

type Props = {};
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

let props: Props;

export default function Main({}: Props) {
  const [pageNumber, setPageNum] = useState<number>(1);
  const [stories, setStories] = useState<Story[]>([]);
  let [loading, setLoading] = useState(true);
  const [curpage, setCurpage] = useState<number>(0);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const { data, error, fetchNextPage, status, hasNextPage } = useInfiniteQuery(
    ["characters"],
    ({ pageParam = 1 }) => fetcher(pageParam),
    {
      getNextPageParam: (lastPage: ResponseAPI) => {
        console.log(lastPage);
        const previousPage = lastPage.info.prev
          ? +lastPage.info.prev.split("=")[1]
          : 0;
        const currentPage = previousPage + 1;

        if (currentPage === lastPage.info.pages) return false;
        return currentPage + 1;
      },
    }
  );

  async function request<TResponse>(
    url: string,
    config: RequestInit = {}
  ): Promise<TResponse> {
    return fetch(url, config)
      .then((response) => response.json())
      .then((data) => data as TResponse);
  }

  // async function fetchData() {
  //   const result: number[] = await request(
  //     "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"
  //   );
  //   const storyList: Story[] = [];
  //   for (const id of result.slice(0, 20)) {
  //     const result2: Story = await request(
  //       `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
  //     );
  //     storyList.push(result2);
  //   }
  //   setStories(storyList);
  //   console.log(storyList);
  // }

  const characters = useMemo(
    () =>
      data?.pages.reduce((prev, page) => {
        console.log(data);
        setCurpage(curpage + 1);
        return {
          info: page.info,
          results: [...prev.results, ...page.results],
        };
      }),
    [data]
  );

  if (status === "loading") return <Loading />;

  if (status === "error") return <h4>Ups!, {`${error}` as string}</h4>;

  return (
    <div className="main-container">
      <h1 className="main-title">Top 100 Hacker News</h1>
      <InfiniteScroll
        dataLength={characters ? characters.results.length : 0}
        next={() => fetchNextPage()}
        hasMore={!!hasNextPage}
        loader={<Loading />}
      >
        {/* <div className="story-containers"> */}
        {
          // stories.map((story, i) => {
          //   if (stories.length === i + 1)
          //     return <Card ref={lastStoryElementRef} story={story} i={i} />;
          //   else return <Card ref={null} story={story} i={i} />;
          // })
        }
        <div className="grid-container">
          {data?.pages[0].results.map((character) => (
            <div className="card">
              <img
                src={character.image}
                alt={character.name}
                width={50}
                loading="lazy"
              />
              <p>{character.name}</p>
            </div>
          ))}
        </div>
        {/* </div> */}
      </InfiniteScroll>
    </div>
  );
}
