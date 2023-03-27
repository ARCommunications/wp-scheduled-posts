import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { wpspSettingsGlobal } from './../../utils/helper'
import { FieldArray, Form } from 'formik'
export default function Facebook({ fieldName, field, page, group }) {
    const [isErrorMessage, setIsErrorMessage] = useState(false)
    const addProfileToggle = (item, index, arrayHelpers, e) => {
        if (e.target.checked) {
            // free
            if (!wpspSettingsGlobal.pro_version) {
                if (!field.value || (field.value && field.value.length == 0)) {
                    e.target.disabled = true
                    arrayHelpers.insert(index, item)
                } else {
                    e.target.disabled = true
                    setIsErrorMessage(true)
                    e.preventDefault()
                    e.stopPropagation()
                }
            } else {
                setIsErrorMessage(false)
                arrayHelpers.insert(index, item)
            }
        } else {
            e.target.disabled = false
            setIsErrorMessage(false)
            arrayHelpers.remove(index)
        }
    }
    return (
        <React.Fragment>
            <FieldArray
                name={fieldName}
                render={(arrayHelpers) => (
                    <div className='wpsp-modal-social-platform'>
                        <div className='entry-head facebook'>
                            <img
                                src={
                                    wpspSettingsGlobal.plugin_root_uri +
                                    'assets/images/icon-facebook-small-white.png'
                                }
                                alt='logo'
                            />
                            <h2 className='entry-head-title'>
                                {__('Facebook', 'wp-scheduled-posts')}
                            </h2>
                        </div>
                        {isErrorMessage && (
                            <div className='error-message'>
                                {__(
                                    'Multi Profile is a Premium Feature. To use this feature,',
                                    'wp-scheduled-posts'
                                )}
                                {" "}
                                <a target="_blank" href='https://wpdeveloper.com/in/schedulepress-pro'>
                                    {__(
                                        'Upgrade to PRO.',
                                        'wp-scheduled-posts'
                                    )}
                                </a>
                            </div>
                        )}
                        <ul>
                            {page.length > 0 && (
                                <li>{__('Pages:', 'wp-scheduled-posts')} </li>
                            )}
                            {page.map((item, index) => (
                                <li id={'facebook_page_' + index} key={index}>
                                    <div className='item-content'>
                                        <div className='entry-thumbnail'>
                                            <img
                                                src={item.thumbnail_url}
                                                alt='logo'
                                            />
                                        </div>
                                        <h4 className='entry-title'>
                                            {item.name}
                                        </h4>
                                        <div className='control'>
                                            <input
                                                type='checkbox'
                                                name={`${field.name}.${index}`}
                                                onChange={(e) =>
                                                    addProfileToggle(
                                                        item,
                                                        index,
                                                        arrayHelpers,
                                                        e
                                                    )
                                                }
                                            />
                                            <div></div>
                                        </div>
                                    </div>
                                </li>
                            ))}

                            {group.length > 0 && (
                                <li>{__('Group:', 'wp-scheduled-posts')} </li>
                            )}

                            {group.map((item, index) => (
                                <li id={'facebook_group_' + index} key={index}>
                                    <div className='item-content'>
                                        <div className='entry-thumbnail'>
                                            <img
                                                src={item.thumbnail_url}
                                                alt='logo'
                                            />
                                        </div>
                                        <h4 className='entry-title'>
                                            {item.name}
                                        </h4>
                                        <div className='control'>
                                            <input
                                                type='checkbox'
                                                name={`${field.name}.${index}`}
                                                onChange={(e) =>
                                                    addProfileToggle(
                                                        item,
                                                        index,
                                                        arrayHelpers,
                                                        e
                                                    )
                                                }
                                            />
                                            <div></div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            />
        </React.Fragment>
    )
}
