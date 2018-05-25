import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import round from "lodash/round";
import sumBy from "lodash/sumBy";
import AnimateHeight from "react-animate-height-auto";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faChevronRight from "@fortawesome/fontawesome-free-solid/faChevronRight";
import { Link } from "react-router-dom";
import { StrongText } from "./typeComponents";
import CategoryListItem from "./CategoryListItem";
import SummaryChart from "./SummaryChart";

const TOGGLE_ICON_SPACING = 20;

const Container = styled.div`
  & + & {
    border-top: 1px solid #eee;
  }
`;

const GroupArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  white-space: pre;
  user-select: none;
`;

class CategoryGroupListItem extends Component {
  static propTypes = {
    categoryGroup: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        activity: PropTypes.number.isRequired,
        balance: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired
      })
    ).isRequired,
    currentUrl: PropTypes.string.isRequired,
    expanded: PropTypes.bool.isRequired,
    monthProgress: PropTypes.number.isRequired,
    onToggleGroup: PropTypes.func.isRequired
  };

  render() {
    const {
      categoryGroup,
      categories,
      currentUrl,
      expanded,
      monthProgress,
      onToggleGroup
    } = this.props;
    const activity = sumBy(categories, "activity");
    const balance = sumBy(categories, "balance");

    return (
      <Container>
        <GroupArea
          onClick={() => {
            onToggleGroup(categoryGroup.id);
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: TOGGLE_ICON_SPACING,
                fontWeight: 400,
                color: "#888",
                fontSize: 10
              }}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                transform={{ rotate: expanded ? 90 : 0 }}
              />
            </div>
            <StrongText>{categoryGroup.name}</StrongText>
          </div>
          <Link to={`${currentUrl}/category-groups/${categoryGroup.id}`}>
            <div
              style={{
                width: 160,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <SummaryChart
                activity={activity}
                balance={balance}
                indicator={monthProgress}
              />
              <StrongText>{round(balance)}</StrongText>
            </div>
          </Link>
        </GroupArea>
        <AnimateHeight isExpanded={expanded}>
          {categories.map(category => (
            <CategoryListItem
              key={category.id}
              category={category}
              currentUrl={currentUrl}
              leftSpacing={TOGGLE_ICON_SPACING}
              monthProgress={monthProgress}
            />
          ))}
        </AnimateHeight>
      </Container>
    );
  }
}

export default CategoryGroupListItem;