import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { getStoriesPage } from "../api/axios";

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

function useStorySearch(pageNumber: number = 1) {
  const [results, setResults] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<object>({});
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setError({});

    const controller = new AbortController();
    const { signal } = controller;

    const data = getStoriesPage(pageNumber, { signal }).catch((e: any) => {
      setIsLoading(false);
      if (signal.aborted) return;
      setIsError(true);
      setError({ message: e.message });
    });
    setResults((prev) => [...prev, ...data]);
    setHasNextPage(Boolean(data.length));
    setIsLoading(false);

    return () => controller.abort();
  }, [pageNumber]);

  return { isLoading, isError, error, results, hasNextPage };
}

export default useStorySearch;
