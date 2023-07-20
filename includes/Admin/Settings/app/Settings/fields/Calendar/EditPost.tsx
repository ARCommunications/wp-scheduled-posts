import React, { useState, useEffect } from "react";
import wpFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";
import { TimePicker } from "@wordpress/components";
import { Input, Textarea } from "quickbuilder";
import Modal from "react-modal";

interface Post {
  ID               ?: number;
  post_content     ?: string;
  post_date        ?: string;
  post_date_gmt    ?: string;
  post_modified    ?: string;
  post_modified_gmt?: string;
  post_status      ?: string;
  post_title       ?: string;
  post_type        ?: string;
}
interface EditPostReturnType {
  openModal: (post: Post) => void;
  closeModal: () => void;
  modalIsOpen: boolean;
}



const useEditPost = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState<Post>({
    post_title: '',
    post_content: '',
    post_date: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    wpFetch({
      method: "POST",
      path: "/wpscp/v1/post",
      data: {
        type       : "addEvent",
        ID         : postData.ID,
        post_type  : postData.post_type,
        post_status: postData.post_status,
        postTitle  : postData.post_title,
        postContent: postData.post_content,
        date       : postData.post_date,
      },
    });
    closeModal();
  };

  const openModal = (post) => {
    setIsOpen(true);

    if (post) {
      setIsLoading(true);
      wpFetch({
        path: addQueryArgs(`/wpscp/v1/post`, {
          postId: post.postId,
          postType: post.postType,
          post_status: post.status,
        }),
      })
      .then((posts: Array<Post>) => {
        if (posts.length > 0) {
          const post = posts[0];
          setPostData(post);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setPostData({});
        setIsLoading(false);
      });
    } else {
      setPostData({});
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setPostData({});
  };

  useEffect(() => {
    return () => {
      closeModal();
    };
  }, []);

  useEffect(() => {
    console.log('isOpen', isOpen);
  }, [isOpen])


  return {
    isOpen,
    openModal,
    closeModal,
    handleSubmit,
    isLoading,
    postData, setPostData,
  };
};


export const ModalContent = ({
  isOpen,
  postData,
  closeModal,
  handleSubmit,
  isLoading,
  setPostData,
}) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      className="modal_wrapper"
    >
      <div className="modalhead">
        <button className="close-button" onClick={closeModal}>
          <i className="wpsp-icon wpsp-close"></i>
        </button>
        <div className="platform-info">
          <h4>Add New Post</h4>
        </div>
      </div>
      <div className="modalbody">
        {isLoading && <div>Loading...</div>}
        {!isLoading && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <Input
                type="text"
                id="title"
                label="Title"
                placeholder="Title"
                value={postData.post_title}
                onChange={(event) => setPostData({...postData, post_title: event.target.value})}
              />
            </div>
            <div className="form-group">
              <Textarea
                id="content"
                label="Content"
                placeholder="Content"
                value={postData.post_content}
                onChange={(event) => setPostData({...postData, post_content: event.target.value})}
              />
            </div>

            <TimePicker
              currentTime={postData.post_date}
              onChange={(event) => setPostData({...postData, post_date: event.target.value})}
              is12Hour
            />

            <button type="submit">Save</button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default useEditPost;