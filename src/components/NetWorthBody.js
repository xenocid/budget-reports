import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import findIndex from "lodash/fp/findIndex";
import eq from "lodash/fp/eq";
import groupBy from "lodash/fp/groupBy";
import identity from "lodash/fp/identity";
import keyBy from "lodash/fp/keyBy";
import keys from "lodash/fp/keys";
import last from "lodash/fp/last";
import map from "lodash/fp/map";
import mapValues from "lodash/fp/mapValues";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import { simpleMemoize } from "../utils";
import NetWorthSummary from "./NetWorthSummary";
import NetWorthChart from "./NetWorthChart";
import NetWorthAccounts from "./NetWorthAccounts";

const cumulative = arr =>
  arr.reduce(
    (acc, curr) => (acc.length === 0 ? [curr] : acc.concat(last(acc) + curr)),
    []
  );

class NetWorthBody extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      accounts: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired
        })
      ).isRequired,
      accountsById: PropTypes.objectOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired
        })
      ).isRequired,
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          accountId: PropTypes.string.isRequired,
          amount: PropTypes.number.isRequired,
          date: PropTypes.string.isRequired
        })
      ).isRequired
    }).isRequired
  };

  state = {
    hiddenAccounts: {},
    selectedMonth: null
  };

  groupByMonthAndAccount = simpleMemoize(
    compose([
      mapValues(groupBy("accountId")),
      groupBy(({ date }) => date.slice(0, 7))
    ])
  );

  getMonths = simpleMemoize(budget =>
    compose([sortBy(identity), keys, this.groupByMonthAndAccount])(
      budget.transactions
    )
  );

  getSummaryByAccount = simpleMemoize(budget => {
    const groupedTransactions = this.groupByMonthAndAccount(
      budget.transactions
    );
    const months = this.getMonths(budget);
    return map(({ id }) => ({
      id,
      data: compose([
        cumulative,
        map(month => sumBy("amount")(groupedTransactions[month][id]))
      ])(months)
    }))(budget.accounts);
  });

  getSelectedBalances = simpleMemoize((selectedMonth, budget) => {
    const months = this.getMonths(budget);
    const selectedMonthIndex = findIndex(eq(selectedMonth))(months);
    const accountSummaries = this.getSummaryByAccount(budget);

    return compose([
      mapValues(
        ({ data }) =>
          selectedMonthIndex > -1 ? data[selectedMonthIndex] : last(data)
      ),
      keyBy("id")
    ])(accountSummaries);
  });

  handleSelectMonth = month => {
    this.setState({ selectedMonth: month });
  };

  handleToggleAccounts = ({ ids }) => {
    const { hiddenAccounts } = this.state;
    const shouldHide = ids.some(id => !hiddenAccounts[id]);
    const newHiddenAccounts = ids.reduce(
      (acc, id) => ({ ...acc, [id]: shouldHide }),
      hiddenAccounts
    );

    this.setState({ hiddenAccounts: newHiddenAccounts });
  };

  render() {
    const { budget } = this.props;
    const { hiddenAccounts, selectedMonth } = this.state;

    const months = this.getMonths(budget);
    const accountSummaries = this.getSummaryByAccount(budget);
    const selectedBalances = this.getSelectedBalances(selectedMonth, budget);

    return (
      <Fragment>
        <NetWorthSummary />
        <NetWorthChart
          data={map(({ id, data }) => ({
            id,
            data,
            type: budget.accountsById[id].type
          }))(accountSummaries)}
          months={months}
          hiddenAccounts={hiddenAccounts}
          selectedMonth={selectedMonth}
          onSelectMonth={this.handleSelectMonth}
        />
        <NetWorthAccounts
          accounts={map(account => ({
            ...account,
            balance: selectedBalances[account.id]
          }))(budget.accounts)}
          hiddenAccounts={hiddenAccounts}
          onToggleAccounts={this.handleToggleAccounts}
        />
      </Fragment>
    );
  }
}

export default NetWorthBody;
