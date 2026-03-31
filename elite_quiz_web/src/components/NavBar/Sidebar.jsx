'use client'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import dynamic from 'next/dynamic'
const MobileMenus = dynamic(() => import('./MobileSidebar/MobileMenus'), { ssr: false })
const Logo = dynamic(() => import('../Logo/Logo'), { ssr: false })

const Sidebar = ({ isActive, setIsActive, image }) => {
  return (
    <>
      <Sheet open={isActive} onOpenChange={setIsActive} className='!relative'>
        <SheetContent
          className={`bg-black dark:bg-[#090029] z-[50] w-full px-3 ${isActive ? 'tp-sidebar-opened' : ''}`}
        >
          <div className='flex items-center justify-between m-[10px_10px]'>
            {/* Logo Section */}
            <div className='!py-0'>
              <Logo image={image} isActive={isActive} setIsActive={setIsActive} />
            </div>
          </div>

          {/* Mobile Menus */}
          <div className=' block xl:hidden py-2'>
            <MobileMenus isActive={isActive} setIsActive={setIsActive} mobileNav={true} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Overlay */}
      <div onClick={() => setIsActive(false)} className={`body-overlay ${isActive ? 'opened' : ''}`}></div>
    </>
  )
}

export default Sidebar
