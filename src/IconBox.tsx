import React from "react";
import { string, arrayOf, func, shape } from "prop-types";
import "./ui.css";

const IconDiv = ({ EOSReactIcon, pushToNode, name }) => (
  <div
    className="image-container"
    onClick={() => {
      pushToNode(EOSReactIcon({ size: "xxxl" }), name);
    }}
  >
    {EOSReactIcon({ size: "xl" })}
  </div>
);

IconDiv.propTypes = {
  EOSReactIcon: func.isRequired,
  pushToNode: func.isRequired,
  name: string.isRequired,
};
const IconBox = ({ option, icons, pushToNode }) => {
  const iconDivs = icons.map(({ EOSReactIcon, name }) => (
    <IconDiv
      key={name}
      EOSReactIcon={EOSReactIcon}
      pushToNode={pushToNode}
      name={name}
    />
  ));
  return (
    <div key={option}>
      <div className="category-container">
        <span>{option}</span>
      </div>
      <div className="image-box">{iconDivs}</div>
    </div>
  );
};

IconBox.propTypes = {
  option: string.isRequired,
  icons: arrayOf(shape({ EOSReactIcon: func, name: string })).isRequired,
  pushToNode: func.isRequired,
};

export default IconBox;
