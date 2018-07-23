import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import propEq from "lodash/fp/propEq";
import { getMetadataForPayee } from "../utils";
import TopNumbers from "./TopNumbers";
import Transactions from "./Transactions";

class PayeeBody extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          payeeId: PropTypes.string.isRequired
        })
      ).isRequired,
      payeesById: PropTypes.object.isRequired
    }).isRequired,
    payee: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    const { payee, budget } = this.props;
    const transactions = budget.transactions.filter(
      propEq("payeeId", payee.id)
    );
    const { amount, transactions: transactionCount } = getMetadataForPayee({
      budget,
      payeeId: payee.id
    });

    return (
      <Fragment>
        <TopNumbers
          numbers={[
            { label: "total amount", value: Math.abs(amount) },
            { label: "transactions", value: transactionCount, currency: false },
            {
              label: "amount/transaction",
              value: Math.abs(amount) / transactionCount
            }
          ]}
        />
        <Transactions
          transactions={transactions}
          payeesById={budget.payeesById}
        />
      </Fragment>
    );
  }
}

export default PayeeBody;