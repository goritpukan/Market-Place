import React from "react";

export default function ImageList(props) {
  const imagesList = props.imageList.map(image => (
    <li key={props.imageList.indexOf(image)}>
      <button
        onClick={() => props.deleteImage(props.imageList.indexOf(image))}
        id="DeleteImage">X</button>
      <img alt="" src={image.PhotoUrl} id="PrewiwewImage"></img>
    </li>
  ));
  if (props.imageList) {
    return (
      <ul id="PrewiwewImageContainer">
        {imagesList}
        <div id="ImageCounter">{props.imageList.length} / 10</div>
      </ul>
    );
  }
}