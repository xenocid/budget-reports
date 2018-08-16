import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import compose from "lodash/fp/compose";
import sortBy from "lodash/fp/sortBy";
import { getSetting, setSetting, TRENDS_SHOW_AVERAGE } from "../uiRepo";
import {
  getFirstMonth,
  getNumMonths,
  getTransactionMonth
} from "../budgetUtils";
import pages, { makeLink } from "../pages";
import MonthByMonthSection from "./MonthByMonthSection";
import TransactionsByMonthSection from "./TransactionsByMonthSection";
import GenericEntitiesSection from "./GenericEntitiesSection";

class Group extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          categoryId: PropTypes.string
        })
      ).isRequired,
      payeesById: PropTypes.object.isRequired
    }).isRequired,
    categoryGroup: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired,
    onSelectCategory: PropTypes.func.isRequired,
    onSelectMonth: PropTypes.func.isRequired,
    selectedCategoryId: PropTypes.string,
    selectedMonth: PropTypes.string
  };

  constructor(props) {
    super();

    this.state = {
      showAverage: getSetting(TRENDS_SHOW_AVERAGE, props.budget.id)
    };
  }

  handleToggleAverage = () => {
    this.setState(
      state => ({ ...state, showAverage: !state.showAverage }),
      () => {
        setSetting(
          TRENDS_SHOW_AVERAGE,
          this.props.budget.id,
          this.state.showAverage
        );
      }
    );
  };

  render() {
    const {
      budget,
      categoryGroup,
      selectedMonth,
      selectedCategoryId,
      onSelectMonth,
      onSelectCategory
    } = this.props;
    const { showAverage } = this.state;
    const {
      transactions,
      categories,
      categoriesById,
      payeesById,
      id: budgetId
    } = budget;
    const firstMonth = getFirstMonth(budget);
    const numMonths = getNumMonths(budget);

    const categoriesInGroup = categories.filter(
      category => category.category_group_id === categoryGroup.id
    );
    const categoryIds = categoriesInGroup.map(category => category.id);
    const transactionsInGroup = transactions.filter(transaction =>
      categoryIds.includes(transaction.category_id)
    );
    const transactionsInSelectedMonth =
      selectedMonth &&
      compose([
        sortBy("amount"),
        transactions =>
          transactions.filter(
            transaction => getTransactionMonth(transaction) === selectedMonth
          )
      ])(transactionsInGroup);

    return (
      <Fragment>
        <MonthByMonthSection
          firstMonth={firstMonth}
          selectedMonth={selectedMonth}
          transactions={transactionsInGroup}
          onSelectMonth={onSelectMonth}
          highlightFunction={
            selectedCategoryId &&
            (transaction => transaction.category_id === selectedCategoryId)
          }
        />
        <GenericEntitiesSection
          key={`categories-${selectedMonth || "all"}`}
          entityKey="category_id"
          entitiesById={categoriesById}
          linkFunction={categoryId =>
            makeLink(pages.category.path, {
              budgetId,
              categoryGroupId: categoryGroup.id,
              categoryId
            })
          }
          title={
            selectedMonth
              ? `Categories for ${moment(selectedMonth).format("MMMM")}`
              : "Categories"
          }
          transactions={transactionsInSelectedMonth || transactionsInGroup}
          showTransactionCount={false}
          selectedEntityId={selectedCategoryId}
          onClickEntity={onSelectCategory}
          showAverageToggle={!selectedMonth}
          showAverage={showAverage && !selectedMonth}
          numMonths={numMonths}
          onToggleAverage={this.handleToggleAverage}
          limitShowing
        />
        {selectedMonth && (
          <TransactionsByMonthSection
            key={`transactions-${selectedMonth}`}
            categoriesById={categoriesById}
            payeesById={payeesById}
            selectedMonth={selectedMonth}
            transactions={transactionsInSelectedMonth}
          />
        )}
      </Fragment>
    );
  }
}

export default Group;
