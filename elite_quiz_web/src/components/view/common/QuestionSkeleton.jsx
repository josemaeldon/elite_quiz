// import { Skeleton } from 'antd'
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const QuestionSkeleton = () => {
  return (
    <>
      <div className="container mb-2">
        <Skeleton className="morphisam !py-[10px]">
          <div className="m-5 flex items-end justify-between">
            <span className="p-[20px_40px] sm:p-[40px_80px] bg-white rounded-[16px]"></span>
            <span className="p-[20px_40px] sm:p-[40px_80px] bg-white rounded-[16px]"></span>
          </div>
        </Skeleton>
        <Skeleton className="morphisam !py-[10px]">
          <div className="m-5 flex flex-wrap lg:flex-nowrap gap-6">
            <div className=" w-full lg:w-2/3 flex-center h-[330px] bg-white rounded-[10px] mb-[10px] flex-col text-center">

            </div>
            <div className="w-full lg:w-1/3">
              <span className="mr-5 ml-5 lg:mr-0  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 bg-white p-7 rounded-[8px] mb-3"></span>
              <span className="mr-5 ml-5 lg:mr-0  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 bg-white p-7 rounded-[8px] mb-3"></span>
              <span className="mr-5 ml-5 lg:mr-0  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 bg-white p-7 rounded-[8px] mb-3"></span>
              <span className="mr-5 ml-5 lg:mr-0  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 bg-white p-7 rounded-[8px] mb-3"></span>
              <span className="mr-5 ml-5 lg:mr-0  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 bg-white p-7 rounded-[8px] mb-3"></span>
            </div>
          </div>
        </Skeleton>
      </div>
    </>
  );
};

export default QuestionSkeleton;
