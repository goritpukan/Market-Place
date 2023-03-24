import React from "react";

export default function ImageList(props) {
  const ImagesList = props.ImageList.map(image => (
    <li key={props.ImageList.indexOf(image)}>
      <button
        onClick={() => props.DeleteImage(props.ImageList.indexOf(image))}
        id="DeleteImage">X</button>
      <img alt="" src={image.PhotoUrl} id="PrewiwewImage"></img>
    </li>
  ));
  if (props.ImageList) {
    return (
      <ul id="PrewiwewImageContainer">
        {ImagesList}
        <div id="ImageCounter">{props.ImageList.length} / 10</div>
      </ul>
    );
  }
}