import React, { useState, useEffect } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { connect } from 'react-redux'
import { __ } from '@wordpress/i18n'
import { fetch_social_popup_info } from './../redux/actions/social.actions'
import { bindActionCreators } from 'redux'
import { Formik, Form } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import fetchWP from './../utils/fetchWP'
import Fields from './../components/Fields'
import Group from './../components/type/Group'
import Document from './Document'
import Features from './Features'

const SuccessMessage = ({ closeToast, toastProps }) => (
<div onClick={closeToast} >
    <span className='dashicons dashicons-yes-alt'></span>{' '}
    {__('Settings Saved!', 'wp-scheduled-posts')}
</div>
)

const Settings = ({
    wpspObject,
    socialPlatform,
    redirectFromOauth,
    fetch_social_popup_info,
    currentTab,
}) => {
    const [tabIndex, setTabIndex] = useState(0)
    const [subTabIndex, setSubTabIndex] = useState(0)
    const [formValue, setFormValue] = useState({})
    const [isLoaded, setIsLoaded] = useState(false)
    const [isFetchSettings, setFetchSettings] = useState(false)
    useEffect(() => {
        // social
        fetch_social_popup_info()
        if (redirectFromOauth) {
            setTabIndex(2)
        } else if (currentTab === 'license') {
            setTabIndex(5)
        }
        if (socialPlatform == 'twitter') {
            setSubTabIndex(1)
        } else if (socialPlatform == 'linkedin') {
            setSubTabIndex(2)
        } else if (socialPlatform == 'pinterest') {
            setSubTabIndex(3)
        }
        if (!isFetchSettings) {
            getSetting()
        }
        // loader
        setTimeout(() => {
            setIsLoaded(true)
        }, 3000)
    }, [redirectFromOauth])
    const FETCHWP = new fetchWP({
        restURL: wpspObject.api_url,
        restNonce: wpspObject.api_nonce,
    })
    const notify = (status) => {
        let $handler = setTimeout(function () {
            const oldNotice = document.querySelector('.Toastify__toast-container');
            if (oldNotice) {
                oldNotice.innerHTML = '';
            }
        }, 2500);

        toast.success(
            <SuccessMessage/>
            ,
            {
                position: 'top-right',
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            }
        );
    }
    const processOkResponse = (json, action) => {
        if (json.success) {
            setFormValue(JSON.parse(json.value))
        }
        notify(json.success)
    }

    const getSetting = () => {
        FETCHWP.get('settings').then(
            (json) => setFormValue(JSON.parse(json.value)),
            (err) => console.log('error', err)
        )
        setFetchSettings(true)
    }
    return (
        <Formik
            enableReinitialize={true}
            initialValues={formValue}
            onSubmit={(values, actions) => {
                FETCHWP.post('settings', {
                    wpspSetting: JSON.stringify(values, null, 2),
                }).then(
                    (json) => processOkResponse(json, 'saved'),
                    (err) => console.log('error', err)
                )
            }}
        >
            {(props) => {
                if (props.dirty === true) {
                    window.onbeforeunload = function () {
                        return __(
                            'Do you really want to close?',
                            'wp-scheduled-posts'
                        )
                    }
                } else {
                    window.onbeforeunload = null
                }
                return (
                    <form onSubmit={props.handleSubmit}>
                        {!isLoaded && (
                            <div className='wpsp_loader'>
                                <img
                                    src={
                                        wpspObject.plugin_root_uri +
                                        'assets/images/wpscp-logo.gif'
                                    }
                                    alt='Loader'
                                />
                            </div>
                        )}
                        <Tabs
                            selectedIndex={tabIndex}
                            onSelect={(tabIndex) => setTabIndex(tabIndex)}
                        >
                            <TabList>
                                {wpspObject.settings.map((item, index) => (
                                    <Tab key={index}>{item.title}</Tab>
                                ))}
                            </TabList>
                            {wpspObject.settings.map((item, index) => (
                                <TabPanel key={index}>
                                    {Object.keys(props.values).length > 0 && (
                                        <React.Fragment>
                                            <div className={item.id}>
                                                {
                                                    // sub tabs
                                                    item.sub_tabs !==
                                                        undefined && (
                                                        <Tabs
                                                            selectedIndex={
                                                                subTabIndex
                                                            }
                                                            onSelect={(
                                                                subTabIndex
                                                            ) =>
                                                                setSubTabIndex(
                                                                    subTabIndex
                                                                )
                                                            }
                                                        >
                                                            {/* sub tabs menu item */}
                                                            <TabList>
                                                                {Object.entries(
                                                                    item.sub_tabs
                                                                ).map(
                                                                    ([
                                                                        subIndex,
                                                                        subItem,
                                                                    ]) => (
                                                                        <Tab
                                                                            key={
                                                                                subIndex
                                                                            }
                                                                        >
                                                                            {
                                                                                subItem.title
                                                                            }
                                                                        </Tab>
                                                                    )
                                                                )}
                                                            </TabList>
                                                            {/* sub tabs body */}

                                                            {Object.entries(
                                                                item.sub_tabs
                                                            ).map(
                                                                ([
                                                                    subIndex,
                                                                    subItem,
                                                                ]) => (
                                                                    <TabPanel
                                                                        key={
                                                                            subIndex
                                                                        }
                                                                    >
                                                                        {item
                                                                            .sub_tabs[
                                                                            subIndex
                                                                        ]
                                                                            .fields !==
                                                                            undefined &&
                                                                            item.sub_tabs[
                                                                                subIndex
                                                                            ].fields.map(
                                                                                (
                                                                                    subTabFieldItem,
                                                                                    subTabFieldIndex
                                                                                ) => (
                                                                                    <Fields
                                                                                        {...subTabFieldItem}
                                                                                        setFieldValue={
                                                                                            props.setFieldValue
                                                                                        } // formik
                                                                                        key={
                                                                                            subTabFieldIndex
                                                                                        }
                                                                                        values={
                                                                                            props.values
                                                                                        }
                                                                                    />
                                                                                )
                                                                            )}
                                                                    </TabPanel>
                                                                )
                                                            )}
                                                        </Tabs>
                                                    )
                                                }
                                                {item.group !== undefined &&
                                                    Object.keys(item.group)
                                                        .length > 0 && (
                                                        <Group
                                                            {...item}
                                                            values={
                                                                props.values
                                                            }
                                                        />
                                                    )}
                                                {
                                                    // main tabs fields
                                                    item.fields !== undefined &&
                                                        item.fields.length >
                                                            0 &&
                                                        item.fields.map(
                                                            (
                                                                fieldItem,
                                                                fieldIndex
                                                            ) => (
                                                                <Fields
                                                                    {...fieldItem}
                                                                    setFieldValue={
                                                                        props.setFieldValue
                                                                    } // formik
                                                                    key={
                                                                        fieldIndex
                                                                    }
                                                                    values={
                                                                        props.values
                                                                    }
                                                                />
                                                            )
                                                        )
                                                }
                                            </div>
                                            {item.id === 'wpsp_general' && (
                                                <div className='wpsp-feature-wrap'>
                                                    <Features
                                                        pluginRootURI={
                                                            wpspObject.plugin_root_uri
                                                        }
                                                        proVersion={
                                                            wpspObject.pro_version
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </React.Fragment>
                                    )}
                                </TabPanel>
                            ))}
                        </Tabs>
                        {tabIndex !== 6 && (
                            <button
                                className={
                                    props.dirty === false
                                        ? 'btn-submit'
                                        : 'btn-submit btn-submit--changed'
                                }
                                type='submit'
                            >
                                {__('Save Settings', 'wp-scheduled-posts')}
                            </button>
                        )}
                        <ToastContainer closeButton={false} autoClose={3000} />
                        {tabIndex == 0 && (
                            <Document
                                pluginRootURI={wpspObject.plugin_root_uri}
                            />
                        )}
                    </form>
                )
            }}
        </Formik>
    )
}

const mapStateToProps = (state) => ({
    redirectFromOauth: state.social.redirectFromOauth,
    socialPlatform: state.social.type,
    currentTab: state.social.tab,
})

const mapDispatchToProps = (dispatch) => {
    return {
        fetch_social_popup_info: bindActionCreators(
            fetch_social_popup_info,
            dispatch
        ),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
