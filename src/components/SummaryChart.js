import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { primaryColor } from "../styleVariables";

const CHART_HEIGHT = 3;
const CHART_WIDTH = 80;

const Container = styled.div`
  width: ${CHART_WIDTH}px;
  height: ${CHART_HEIGHT}px;
  background-color: #ddd;
  position: relative;
`;

const Progress = styled.div`
  height: ${CHART_HEIGHT}px;
  width: ${props => props.progress * 100}%;
  background-color: ${primaryColor};
`;

const Marker = styled.div`
  position: absolute;
  top: -3px;
  height: ${CHART_HEIGHT + 6}px;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  left: ${props => props.indicator * CHART_WIDTH}px;
`;

const SummaryChart = ({ activity, balance, indicator }) => (
  <Container>
    <Progress progress={Math.max(-activity / (balance - activity || 1), 0)} />
    <Marker indicator={indicator} />
  </Container>
);

SummaryChart.propTypes = {
  activity: PropTypes.number.isRequired,
  balance: PropTypes.number.isRequired,
  indicator: PropTypes.number.isRequired
};

export default SummaryChart;
