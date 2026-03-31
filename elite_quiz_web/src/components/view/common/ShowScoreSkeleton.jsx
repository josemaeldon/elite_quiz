import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ShowScoreSkeleton = () => {
  return (
    <div className="flex-center flex-col">
      <Skeleton className="h-[230px] w-[230px] rounded-full bg-[#DFDEE3] flex-center skeleton">
        <Skeleton className="h-[210px] w-[210px] rounded-full bg-[#DFDEE3] border-[25px] border-white dark:border-background skeleton"></Skeleton>
      </Skeleton>
      <Skeleton className="morphisam !p-[18px_100px] sm:!p-[18px_150px] border-none !mt-10 skeleton"></Skeleton>
      <Skeleton className="morphisam !p-[18px_150px] sm:!p-[18px_200px] border-none skeleton"></Skeleton>
      <div className="flex w-[80%] justify-around flex-wrap">
        <Skeleton className="morphisam !p-[25px_80px] border-none skeleton"></Skeleton>
        <Skeleton className="morphisam !p-[25px_80px] border-none skeleton"></Skeleton>
        <Skeleton className="morphisam !p-[25px_80px] border-none skeleton"></Skeleton>
      </div>
      <div className="flex w-full justify-around mt-8 flex-wrap">
        <Skeleton className="morphisam !p-[25px_120px] border-none my-2 skeleton"></Skeleton>
        <Skeleton className="morphisam !p-[25px_120px] border-none my-2 skeleton"></Skeleton>
        <Skeleton className="morphisam !p-[25px_120px] border-none my-2 skeleton"></Skeleton>
      </div>
    </div>
  );
};

export default ShowScoreSkeleton;
