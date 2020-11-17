import React, { useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { toast } from 'react-toastify'
import { wpspSettingsGlobal, wpspGetPluginRootURI } from './../../utils/helper'
import Upgrade from './../Upgrade'
const License = () => {
    const [inputChanged, setInputChanged] = useState(false)
    const [tempKey, setTempKey] = useState('')
    const [valid, setValid] = useState(false)
    const [isRequestSend, setIsRequestSend] = useState(null)
    useEffect(() => {
        var data = {
            action: 'get_license',
            _wpnonce: wpscp_pro_ajax_object.license_nonce,
        }
        jQuery.post(ajaxurl, data, function (response) {
            if (response.success === true) {
                setValid(response.data.status)
                setTempKey(response.data.key)
            }
        })
    }, [])

    const activeLicense = () => {
        setIsRequestSend(true)
        var data = {
            action: 'activate_license',
            key: tempKey,
            _wpnonce: wpscp_pro_ajax_object.license_nonce,
        }
        jQuery.post(ajaxurl, data, function (response) {
            setIsRequestSend(null)
            setInputChanged(false)
            if (response.success === true) {
                setTempKey(response.data.key)
                toast.success('Your License successfully activated!', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            }
        })
    }
    const deactiveLicense = () => {
        setIsRequestSend(true)
        var data = {
            action: 'deactivate_license',
            _wpnonce: wpscp_pro_ajax_object.license_nonce,
        }
        jQuery.post(ajaxurl, data, function (response) {
            setIsRequestSend(null)
            setInputChanged(false)
            if (response.success === true) {
                setTempKey('')
                toast.success('Your License successfully deactivated!', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            }
        })
    }
    const changed = (value) => {
        setInputChanged(true)
        setTempKey(value)
    }

    return (
        <React.Fragment>
            <Upgrade
                icon={wpspGetPluginRootURI + 'assets/images/wpsp.png'}
                proVersion={wpspSettingsGlobal.pro_version}
            />
            <div className='wpsp-license-wrapper'>
                <div className='wpsp-lockscreen'>
                    <div className='wpsp-lockscreen-icons'>
                        <img
                            src={
                                wpspGetPluginRootURI +
                                'assets/images/lock_close.png'
                            }
                            alt='Lock Close'
                        />
                        <img
                            src={
                                wpspGetPluginRootURI +
                                'assets/images/lock_close.png'
                            }
                            alt='Forwards'
                        />
                        <img
                            src={
                                wpspGetPluginRootURI +
                                'assets/images/lock_key.png'
                            }
                            alt='Lock Key'
                        />
                        <img
                            src={
                                wpspGetPluginRootURI +
                                'assets/images/forward.png'
                            }
                            alt='Forwards'
                        />
                        <img
                            src={
                                wpspGetPluginRootURI +
                                'assets/images/lock_open.png'
                            }
                            alt='Lock Open'
                        />
                    </div>
                    <h1 className='wpsp-validation-title'>
                        {__('Just one more step to go!', 'wp-scheduled-posts')}
                    </h1>
                </div>
                <div className='wpsp-license-instruction'>
                    <p>
                        {__(
                            'Enter your license key here, to activate',
                            'wp-scheduled-posts'
                        )}
                        <strong>
                            {__('WP Scheduled Posts', 'wp-scheduled-posts')}
                        </strong>
                        {__(
                            ', and get automatic updates and premium support.',
                            'wp-scheduled-posts'
                        )}
                    </p>
                    <p>
                        {__('Visit the', 'wp-scheduled-posts')}
                        <a
                            href='https://wpdeveloper.net/docs/wp-scheduled-posts/'
                            target='_blank'
                        >
                            {__('Validation Guide', 'wp-scheduled-posts')}
                        </a>
                        {__('for help.', 'wp-scheduled-posts')}
                    </p>

                    <ol>
                        <li>
                            {__('Log in to', 'wp-scheduled-posts')}
                            <a
                                href='https://wpdeveloper.net/account/'
                                target='_blank'
                            >
                                {__('your account', 'wp-scheduled-posts')}
                            </a>
                            {__(
                                'to get your license key.',
                                'wp-scheduled-posts'
                            )}
                        </li>
                        <li>
                            {__(
                                "If you don't yet have a license key, get",
                                'wp-scheduled-posts'
                            )}
                            <a
                                href='https://wpdeveloper.net/in/wpsp'
                                target='_blank'
                            >
                                {__(
                                    'WP Scheduled Posts now.',
                                    'wp-scheduled-posts'
                                )}
                            </a>
                        </li>
                        <li>
                            {__(
                                'Copy the license key from your account and paste it below.',
                                'wp-scheduled-posts'
                            )}
                        </li>
                        <li>
                            {__('Click on', 'wp-scheduled-posts')}
                            <strong>
                                {__(
                                    ' "Activate License" ',
                                    'wp-scheduled-posts'
                                )}
                            </strong>
                            {__('button.', 'wp-scheduled-posts')}
                        </li>
                    </ol>
                </div>

                <div className='validated-feature-list'>
                    <div className='validated-feature-list-item'>
                        <div className='validated-feature-list-icon'>
                            <img
                                src={
                                    wpspGetPluginRootURI +
                                    'assets/images/auto_update.png'
                                }
                                alt='Auto Update'
                            />
                        </div>
                        <div className='validated-feature-list-content'>
                            <h4>{__('Auto Update', 'wp-scheduled-posts')}</h4>
                            <p>
                                {__(
                                    'Update the plugin right from your WordPress Dashboard.',
                                    'wp-scheduled-posts'
                                )}
                            </p>
                        </div>
                    </div>

                    <div className='validated-feature-list-item'>
                        <div className='validated-feature-list-icon'>
                            <img
                                src={
                                    wpspGetPluginRootURI +
                                    'assets/images/premium_support.png'
                                }
                                alt='Premium Support'
                            />
                        </div>
                        <div className='validated-feature-list-content'>
                            <h4>
                                {__('Premium Support', 'wp-scheduled-posts')}
                            </h4>
                            <p>
                                {__(
                                    'Supported by professional and courteous staff.',
                                    'wp-scheduled-posts'
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <div className='wpsp-license-container'>
                    <div className='wpsp-license-icon'>
                        <img
                            src={
                                wpspGetPluginRootURI +
                                'assets/images/activate.png'
                            }
                            alt='Active'
                        />
                    </div>
                    <div className='wpsp-license-input'>
                        <input
                            id='wp-scheduled-posts-pro-license-key'
                            placeholder='Place Your License Key and Activate'
                            onChange={(e) => changed(e.target.value)}
                            value={tempKey !== false ? tempKey : ''}
                        />
                    </div>
                    <div className='wpsp-license-buttons'>
                        {valid ? (
                            <button
                                id='submit'
                                type='button'
                                className={
                                    inputChanged
                                        ? 'wpsp-license-deactivation-btn changed'
                                        : 'wpsp-license-deactivation-btn'
                                }
                                onClick={() => deactiveLicense()}
                            >
                                {isRequestSend == true
                                    ? 'Request Sending...'
                                    : 'Deactivate License'}
                            </button>
                        ) : (
                            <button
                                id='submit'
                                type='button'
                                className={
                                    inputChanged
                                        ? 'wpsp-license-buttons changed'
                                        : 'wpsp-license-buttons'
                                }
                                onClick={() => activeLicense()}
                                disabled={!tempKey}
                            >
                                {isRequestSend == true
                                    ? 'Request Sending...'
                                    : 'Activate License'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default License
