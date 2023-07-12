import { useBuilderContext } from 'quickbuilder';
import React from 'react';
const docIcon =  require("../assets/images/doc.png");
// const upgradePro =  require("../assets/images/upgrade-pro.png");

const Sidebar = ({ props }) => {
    const builderContext = useBuilderContext();
    console.log(builderContext.config.active);

    if(props.id !== 'tab-sidebar-layout' || builderContext.config.active === 'layout_calender' || builderContext.config.active === 'layout_social_profile' ) {
        return <></>;
    }

    return (
        <div className="wpsp-admin-sidebar">
            <div className='upgrade-pro card'>
                {/* <img className='icon-wrapper' src={upgradePro} alt='icon-1' /> */}
                {/* @ts-ignore */}
                <img src={`${wpspSettingsGlobal?.image_path}upgrade-pro.png`} alt="upgrade-pro-img" />
                <h3>Get Unlimited Features</h3>
                <p>Supercharge your content schedule and have a peace in mind</p>
                <button>Upgrade To Pro</button>
            </div>
            <div className='card'>
                <i className="wpsp-icon wpsp-file"></i>
                <h3>Documentation</h3>
                <p>Get started spending some time with the documentation to get familiar with SchedulePress.</p>
                <button>Documentation</button>
            </div>
            <div className='card'>
                <i className="wpsp-icon wpsp-file"></i>
                <h3>Contribute to SchedulePress</h3>
                <p>You can contribute to making SchedulePress better by reporting bugs</p>
                <button>Report A Bug</button>
            </div>
            <div className='card'>
                <i className="wpsp-icon wpsp-file"></i>
                <h3>Need Help?</h3>
                <p>Stuck with something? Get help from the community WPDeveloper Forum or Facebook Community.</p>
                <button>Get Support</button>
            </div>
            <div className='card'>
                <i className="wpsp-icon wpsp-file"></i>
                <h3>Show your Love</h3>
                <p>We love to have you in the SchedulePress family. We are making it more awesome every day.</p>
                <button>Show your Love</button>
            </div>
        </div>
    );
  };

export default Sidebar;