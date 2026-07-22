import { css } from '@emotion/react';
import { LegendItem, LegendLabel } from '@visx/legend';
import type { Data } from './donut-chart';
import { Text } from '@commercetools/nimbus';

const legendGlyphSize = 9;
const legendItemGap = '8px';

const ChartLegend = ({ data }: { data: Data[] }) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
      `}
    >
      {data.map((datum, i) => (
        <LegendItem
          key={`legend-item-${i}`}
          margin={`0 ${i === 0 ? 0 : legendItemGap}`}
        >
          <svg width={legendGlyphSize} height={legendGlyphSize}>
            <circle
              fill={datum.primaryColor}
              r={legendGlyphSize / 2}
              cx={legendGlyphSize / 2}
              cy={legendGlyphSize / 2}
            />
          </svg>
          <LegendLabel align="left" margin={`0 0 0 ${legendItemGap}`}>
            <Text textStyle="sm" color="neutral.11">
              {datum.name}
            </Text>
          </LegendLabel>
        </LegendItem>
      ))}
    </div>
  );
};

export default ChartLegend;
