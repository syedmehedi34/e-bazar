// client/src/hook/useFetchBlog.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Blog {
  id: string;
  title: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  author?: string;
  publishedAt?: string;
  image?: string;
}

interface BlogsResponse {
  message?: string;
  blogs: Blog[];
}

const fetchBlogs = async (): Promise<BlogsResponse> => {
  const url = "/api/blogs";

  const res = await axios.get(url);
  return res.data;
};

export const useFetchBlog = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["blogs", "all"], // stable key since no params/filters
    queryFn: fetchBlogs,
    staleTime: 5 * 60 * 1000, // 5 minutes – adjust as needed
    gcTime: 10 * 60 * 1000, // 10 minutes (cacheTime in v4)
    placeholderData: (previousData) => previousData, // keeps old data while fetching new data on refetch
  });

  return {
    blogs: data?.blogs || [],
    blogsLoading: isLoading,
    blogsError: isError ? error : null,
    refetchBlogs: refetch,
  };
};

// const { blogs, blogsLoading, blogsError, refetchBlogs } = useFetchBlog();
