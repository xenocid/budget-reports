import React from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import get from "lodash/fp/get";
import groupBy from "lodash/fp/groupBy";
import map from "lodash/fp/map";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import { getGroupLink } from "../linkUtils";
import { Link } from "react-router-dom";
import Section from "./Section";
import ListItem from "./ListItem";
import { SecondaryText } from "./typeComponents";
import Amount from "./Amount";

const mapWithKeys = map.convert({ cap: false });

const CurrentMonthCategoryGroups = ({ budget, transactions }) => {
  const { categoriesById, categoryGroupsById, id: budgetId } = budget;
  const groups = compose([
    sortBy("amount"),
    mapWithKeys((transactions, groupId) => {
      const group = categoryGroupsById[groupId];
      return {
        group,
        amount: sumBy("amount")(transactions)
      };
    }),
    groupBy(transaction =>
      get([transaction.categoryId, "categoryGroupId"])(categoriesById)
    )
  ])(transactions);

  return (
    <Section title="Category Groups">
      {groups.map(({ group, transactions, amount }) => (
        <ListItem key={group.id}>
          <Link to={getGroupLink({ budgetId, categoryGroupId: group.id })}>
            <SecondaryText style={{ whiteSpace: "pre" }}>
              {group.name}
            </SecondaryText>
          </Link>
          <Amount amount={amount} />
        </ListItem>
      ))}
    </Section>
  );
};

CurrentMonthCategoryGroups.propTypes = {
  budget: PropTypes.shape({
    categoriesById: PropTypes.objectOf(
      PropTypes.shape({
        categoryGroupId: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired
      })
    ).isRequired,
    categoryGroupsById: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ).isRequired,
    id: PropTypes.string.isRequired
  }).isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      categoryId: PropTypes.string.isRequired
    })
  ).isRequired
};

export default CurrentMonthCategoryGroups;
