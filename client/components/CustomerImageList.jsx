import React from 'react';
import styled from 'styled-components';
import {CustomerThumbnail} from './CustomerImage.jsx';
import {StyledLink} from './StyledComponents.jsx';

const Thumbnail = styled(CustomerThumbnail)`
  height: 140px;
  width: 140px;
  margin-right: 5px;
`;

const StyledGallery = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

StyledGallery.displayName = 'StyledGallery';

const CustomerImageList = ({mediaList, toggleModal, displayImageInModal}) => {
  let customerImages = [];
  let currentNode = mediaList.head;
  while (customerImages.length < 4 && currentNode !== null) {
    customerImages.push(
      <Thumbnail 
        mediaNode={currentNode}
        displayImageInModal={displayImageInModal}
      />
    );
    currentNode = currentNode.next;
  }
  return (
    <div>
      <h3>Customer images</h3>
      <StyledGallery>
        {customerImages}
      </StyledGallery>
      <StyledLink href="#" onClick={toggleModal}>See all customer images</StyledLink>
    </div>
  );
};

export default CustomerImageList;