import classNames from 'classnames';
import { useBuilderContext } from 'quickbuilder';
import React, { useEffect, useState } from 'react';

import Modal from 'react-modal';
import { SweetAlertDeleteMsg } from '../ToasterMsg';
import { socialProfileRequestHandler } from '../helper/helper';
import ApiCredentialsForm from './Modals/ApiCredentialsForm';
import SocialModal from './Modals/SocialModal';
import MainProfile from './utils/MainProfile';
import SelectedProfile from './utils/SelectedProfile';
import ViewMore from './utils/ViewMore';

const Pinterest = (props) => {
  const builderContext = useBuilderContext();
  const [apiCredentialsModal, setApiCredentialsModal] = useState(false);
  const [platform, setPlatform] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(props?.value);
  const [isProfileEditModal, setProfileEditModal] = useState(false);
  const [profileItem, setProfileItem] = useState('');
  const [cachedStatus, setCashedStatus] = useState({});
  const [selectedProfileViewMore, setSelectedProfileViewMore] = useState(false);
  const [profileStatus, setProfileStatus] = useState(
    builderContext?.savedValues?.pinterest_profile_status
  );

  const openApiCredentialsModal = (platform) => {
    setPlatform('pinterest');
    setApiCredentialsModal(true);
  };
  const closeApiCredentialsModal = () => {
    setPlatform('');
    setApiCredentialsModal(false);
  };
  const handleSelectedProfileStatusChange = (item, event) => {
    if (event.target.checked) {
      setProfileStatus(true);
    }
    setCashedStatus((prevStatus) => {
      return { ...prevStatus, [item.default_board_name.value]: event.target.checked };
    });
    const updatedData = selectedProfile.map((selectedItem) => {
      if (
        selectedItem.default_board_name.value === item.default_board_name.value
      ) {
        return {
          ...selectedItem,
          status: event.target.checked,
        };
      }
      return selectedItem;
    });
    setSelectedProfile(updatedData);
  };

  // Handle delete selected profile
  const handleDeleteSelectedProfile = (item) => {
    SweetAlertDeleteMsg({ item }, deleteFile);
  };
  const deleteFile = (item) => {
    const updatedData = selectedProfile.filter(
      (selectedItem) =>
        selectedItem.default_board_name.value !== item.default_board_name.value
    );
    setSelectedProfile(updatedData);
  };
  // Handle profile & selected profile status onChange event
  const handleProfileStatusChange = (event) => {
    setProfileStatus(event.target.checked);
    const updatedData = selectedProfile.map((selectedItem) => {
      if (!event.target.checked) {
        return {
          ...selectedItem,
          status: false,
        };
      } else {
        return {
          ...selectedItem,
          status : (cachedStatus?.[selectedItem.default_board_name.value] == undefined) ? builderContext?.savedValues?.pinterest_profile_status : cachedStatus?.[selectedItem.default_board_name.value], 
        };
      }
    });
    setSelectedProfile(updatedData);
  };

  // Save selected profile data
  useEffect(() => {
    builderContext.setFieldValue([props.name], selectedProfile);
  }, [selectedProfile]);

  // Save profile status data
  let { onChange } = props;
  useEffect(() => {
    onChange({
      target: {
        type: 'checkbox-select',
        name: 'pinterest_profile_status',
        value: profileStatus,
      },
    });
  }, [profileStatus]);

  // Profile edit modal
  const handleEditSelectedProfile = (item) => {
    setProfileEditModal(true);
    setProfileItem(item);
  };
  let selectedProfileData = [];
  if (selectedProfile && selectedProfileViewMore) {
    selectedProfileData = selectedProfile;
  } else if (selectedProfile && !selectedProfileViewMore) {
    selectedProfileData = selectedProfile.slice(0, 2);
  }
  return (
    <div
      className={classNames(
        'wprf-control',
        'wprf-social-profile',
        `wprf-${props.name}-social-profile`,
        props?.classes
      )}>
      <div className="social-profile-card">
        <div className="main-profile">
          <MainProfile
            props={props}
            handleProfileStatusChange={handleProfileStatusChange}
            profileStatus={profileStatus}
            openApiCredentialsModal={openApiCredentialsModal}
          />
        </div>
        <div className="selected-profile">
          {(!selectedProfile || selectedProfile.length == 0) && (
            <img
              className="empty-image"
              /* @ts-ignore */
              src={`${wpspSettingsGlobal?.image_path}EmptyCard.svg`}
              alt="mainLogo"
            />
          )}
          <div className="selected-pinterest-scrollbar">
            {selectedProfileData &&
              selectedProfileData.map((item, index) => (
                <div
                  className="selected-pinterest-wrapper"
                  key={index}>
                  <SelectedProfile
                    platform={'pinterest'}
                    item={item}
                    handleSelectedProfileStatusChange={
                      handleSelectedProfileStatusChange
                    }
                    handleDeleteSelectedProfile={handleDeleteSelectedProfile}
                    handleEditSelectedProfile={handleEditSelectedProfile}
                  />
                </div>
              ))}
          </div>
          { ( !selectedProfileViewMore && selectedProfile && selectedProfile.length >= 3) && (
            <ViewMore setSelectedProfileViewMore={setSelectedProfileViewMore} />
          )}
        </div>
      </div>
      {/* API Credentials Modal  */}
      <Modal
        isOpen={apiCredentialsModal}
        onRequestClose={closeApiCredentialsModal}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={false}
        className="modal_wrapper">
        <button
          className="close-button"
          onClick={closeApiCredentialsModal}>
          <i className="wpsp-icon wpsp-close"></i>
        </button>
        <ApiCredentialsForm
          props={props}
          platform={platform}
          requestHandler={socialProfileRequestHandler}
        />
      </Modal>

      {/* Profile Data Modal  */}
      {/* @ts-ignore */}
      <SocialModal
        setSelectedProfile={setSelectedProfile}
        props={props}
        type="pinterest"
        profileItem={profileItem}
        isProfileEditModal={isProfileEditModal}
        setProfileEditModal={setProfileEditModal}
        profileStatus={profileStatus}
      />
    </div>
  );
};

export default Pinterest;
