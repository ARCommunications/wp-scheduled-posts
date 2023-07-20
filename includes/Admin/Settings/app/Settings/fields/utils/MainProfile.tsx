import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import Select from "react-select";
import { selectStyles } from '../../helper/styles';

export default function MainProfile( { props, handleProfileStatusChange, profileStatus, openApiCredentialsModal } ) {    
    let options = [];

    // @ts-ignore
    let pageDisabled = wpspSettingsGlobal?.pro_version ? false : true;
    let currentActiveAccountType = localStorage.getItem('account_type');

    if( props?.type == 'facebook' ) {
        options = [
            { value: 'page',    label: __('Page','wp-scheduled-posts'), selected : currentActiveAccountType == 'page' ? true : false },
            { value: 'group',   label: __('Group','wp-scheduled-posts'), selected : currentActiveAccountType == 'group' ? true : false }
        ]
    }else{
        options = [
            { value: 'profile',    label: __('Profile','wp-scheduled-posts'), selected : currentActiveAccountType == 'profile' ? true : false },
            { value: 'page',   label: __('Page','wp-scheduled-posts'), isDisabled: pageDisabled, selected : currentActiveAccountType == 'page' ? true : false }
        ]
    }
    
    const handleAccountType = (selectedOption) => {
        localStorage.setItem('account_type', selectedOption.value);
    };

    const mainSelectStyles = { ...selectStyles, control: (base, state) => ({
        ...base,
        boxShadow: "none", 
        borderColor: "#D7DBDF",
        backgroundColor: "#F9FAFC",
        color: "#6E6E8D",
        "&:hover": {
            borderColor: "#cccccc"
        }
      }), }
    
    return (
        <>
            <div className="card-header">
                <div className="heading">
                    <img width={'30px'} src={`${props?.logo}`} alt={`${props?.label}`} />
                    <h5>{props?.label}</h5>
                </div>
                <div className="status">
                        <div className="switcher">
                            <input
                                id={props?.id}
                                type='checkbox'
                                checked={profileStatus}
                                className="wprf-switcher-checkbox"
                                onChange={(event) =>
                                    handleProfileStatusChange(event)
                                }
                            />
                            <label
                                className="wprf-switcher-label"
                                htmlFor={props?.id}
                                style={{ background: profileStatus && '#02AC6E' }}
                            >
                                <span className={`wprf-switcher-button`} />
                            </label>
                        </div>
                    </div>
            </div>
            <div className="card-content">
                <p dangerouslySetInnerHTML={{ __html: props?.desc }} />
            </div>
            <div className="card-footer">
                { ['facebook', 'linkedin'].includes(props?.type) && (
                    <Select
                        id={props?.id}
                        onChange={(event) => {
                            handleAccountType(event);
                        }}
                        options={options}
                        defaultValue={options[0]}
                        className='main-select'
                        styles={mainSelectStyles}
                    />
                ) }
                <button
                    type="button"
                    className={
                    "wpscp-social-tab__btn--addnew-profile"
                    }
                    onClick={() => openApiCredentialsModal()}
                    >
                    { __("Add New", "wp-scheduled-posts")}
                </button>
            </div>
        </>
    )
}