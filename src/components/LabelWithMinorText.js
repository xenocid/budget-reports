import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { SecondaryText, MinorText } from "./typeComponents";

class LabelWithMinorText extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    bold: PropTypes.bool,
    inLink: PropTypes.bool,
    minorText: PropTypes.string,
    to: PropTypes.string
  };

  render() {
    const { label, minorText, inLink, to, bold } = this.props;
    return (
      <SecondaryText
        style={{
          fontWeight: bold && 700,
          display: "flex",
          alignItems: "baseline",
          whiteSpace: "pre",
          overflow: "hidden",
          color: inLink && "inherit"
        }}
      >
        {to ? (
          <Link to={to}>{label}</Link>
        ) : label}
        {minorText && (
          <MinorText
            style={{
              fontWeight: bold && 700,
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            &nbsp;&ndash; {minorText}
          </MinorText>
        )}
      </SecondaryText>
    );
  }
}

export default LabelWithMinorText;
