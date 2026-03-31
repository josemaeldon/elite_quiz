import React from 'react'
import Skeleton from 'react-loading-skeleton'


const CatCompoSkeleton = () => {

    const count = [1, 2, 3, 4, 5,6]
    return (<>
    <div className="flex flex-wrap gap-0 mb-14">
        {count.map((a,i) => {
            
            return (
                    <div className="w-full sm:w-1/2 lg:w-1/3 " key={i}>
                    
                            <div className='mb-6 flex rounded-[15px] items-start relative text-center flex-col p-[10px_5px] bg-[rgba(9,0,41,0.06)] skeleton overflow-hidden w-[98%] '>
                            
                                <div >
                                    <Skeleton count={1} className='m-3 px-2 py-4  skeleton'/>
                                </div>
                                <div className='absolute'>
                                    <Skeleton count={1} className='ml-[75px] mt-[12px] pl-[25px] rtl:right-[75px] skeleton' />
                                </div>
                                <div className='absolute'>
                                    <Skeleton count={1} className='flex pl-[100px] top-[44px] left-[75px] skeleton rtl:right-[75px]' />
                                </div>
                                <div className='absolute'>
                                    <Skeleton count={1} className='flex pl-[100px] top-[44px] left-[190px] rtl:right-[190px] skeleton' />
                                </div>
                                <div className='absolute'>
                                    <Skeleton count={1} className='flex pl-[30px] top-[44px] left-[320px] rtl:right-[320px] skeleton' />
                                </div>

                            </div>
                        
                </div>)
        })}
        </div>
    </>)
}

export default CatCompoSkeleton