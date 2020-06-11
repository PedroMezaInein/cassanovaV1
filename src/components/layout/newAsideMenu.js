import React from 'react';
import {AsideMenuList} from "./AsideMenuList";

export default function NewAsideMenu({disableScroll}) {
  
    return (
      <>
        {/* begin::Menu Container */}
        <div
          id="kt_aside_menu"
          data-menu-vertical="1"
          className={`aside-menu my-4 `}
         
        >
          <AsideMenuList  />
        </div>
        {/* end::Menu Container */}
      </>
    );
  }