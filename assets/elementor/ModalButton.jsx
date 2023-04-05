import React from "react";
import { __ } from '@wordpress/i18n'

const ModalButton = (props)=>{




    return (
        <span id="elementor-panel-footer-wpsp-modal-label">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 500 500" style={{"enable-background":"new 0 0 500 500", display:'block', width:'13px',margin:'0 auto'}}>
                <style type="text/css">
                    .st0{"{fill:#A4AFB7;}"}
                    #elementor-panel-footer-wpsp-modal:hover .st0{"{fill:#d5dadf;}"}
                </style>
                <g>
                    <g>
                        <path class="st0" d="M212.3,462.4C95,462.4-0.4,366.9-0.4,249.7S95,37,212.3,37c37,0,73.2,9.6,105.1,27.9
                            c9.8,5.7,13.2,18.1,7.5,27.7c-5.7,9.8-18.1,13.2-27.7,7.5c-25.6-14.7-55.1-22.5-84.9-22.5c-94.7,0-171.8,77.1-171.8,171.8
                            s77.1,171.8,171.8,171.8c48.1,0,92.6-19.4,125.5-54.3c7.8-8.3,20.7-8.5,28.7-1c8.3,7.8,8.5,20.7,1,28.7
                            C327.4,437.8,271,462.4,212.3,462.4z"/>
                    </g>
                    <path class="st0" d="M186.1,208.3l-43.2-39.3c-8.3-7.5-21.2-7-28.7,1.3c-7.5,8.3-7,21.2,1.3,28.7l46.8,42.4
                        C165.9,227.7,174.5,215.8,186.1,208.3z"/>
                    <path class="st0" d="M445.4,81.7c-7-8.8-19.9-10.4-28.7-3.4L250,210.1c11.1,8.3,19.1,20.4,21.7,34.7L442,110.2
                        C451.1,103.2,452.4,90.5,445.4,81.7z"/>
                    <path class="st0" d="M234.3,222.8c-5.2-2.8-11.1-4.4-17.3-4.4c-5.7,0-10.9,1.3-15.5,3.4c-12.7,6-21.2,18.6-21.2,33.4
                        c0,0.8,0,1.6,0,2.3c1.3,19.1,17.1,34.4,36.7,34.4c18.9,0,34.4-14.2,36.5-32.6c0.3-1.3,0.3-2.8,0.3-4.4
                        C253.7,241.1,245.9,229,234.3,222.8z"/>
                    <path class="st0" d="M493.8,202.6h-51.2c-3.4,0-6.2,2.8-6.2,6.2v45.5c0,3.4,2.8,6.2,6.2,6.2h51.2c3.4,0,6.2-2.8,6.2-6.2v-45.5
                        C500,205.4,497.2,202.6,493.8,202.6z"/>
                    <g>
                        <path class="st0" d="M410,202.6h-51.2c-3.4,0-6.2,2.8-6.2,6.2v45.5c0,3.4,2.8,6.2,6.2,6.2H410c3.4,0,6.2-2.8,6.2-6.2v-45.5
                            C416.4,205.4,413.6,202.6,410,202.6z"/>
                        <path class="st0" d="M410,277.6h-51.2c-3.4,0-6.2,2.8-6.2,6.2v45.5c0,3.4,2.8,6.2,6.2,6.2H410c3.4,0,6.2-2.8,6.2-6.2v-45.5
                            C416.4,280.2,413.6,277.6,410,277.6z"/>
                        <path class="st0" d="M493.8,277.6h-51.2c-3.4,0-6.2,2.8-6.2,6.2v45.5c0,3.4,2.8,6.2,6.2,6.2h51.2c3.4,0,6.2-2.8,6.2-6.2v-45.5
                            C500,280.2,497.2,277.6,493.8,277.6z"/>
                    </g>
                </g>
            </svg>
            <span class="elementor-screen-only">{__( 'SchedulePress', 'wp-scheduled-posts' )}</span>
        </span>
    );
}

export default ModalButton;