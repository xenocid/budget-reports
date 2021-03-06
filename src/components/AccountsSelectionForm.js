import React, { Component } from "react";
import PropTypes from "prop-types";
import omit from "lodash/fp/omit";
import ToggleWithLabel from "./ToggleWithLabel";

class AccountsSelectionForm extends Component {
  static propTypes = {
    accounts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    value: PropTypes.objectOf(PropTypes.bool).isRequired,
    onChange: PropTypes.func.isRequired
  };

  handleChange = evt => {
    const { name, checked } = evt.target;
    const { value, onChange } = this.props;

    let newValue;

    if (checked) {
      newValue = {
        ...value,
        [name]: true
      };
    } else {
      newValue = omit(name)(value);
    }

    onChange(newValue);
  };

  render() {
    const { accounts, value } = this.props;

    return accounts.map(({ id, name }) => (
      <ToggleWithLabel
        key={id}
        checked={!!value[id]}
        name={id}
        onChange={this.handleChange}
        label={name}
      />
    ));
  }
}

export default AccountsSelectionForm;
