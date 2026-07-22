import type { ReactElement } from 'react';
import { css } from '@emotion/react';
import { TooltipWithBounds, defaultStyles, useTooltip } from '@visx/tooltip';
import type { Data } from './donut-chart';
import { Box } from '@commercetools/nimbus';

// Note: Without this, tooltips overlap the cursor. Adjusted as needed.
const tooltipOffset = 24;

type ShowTooltip = ReturnType<typeof useTooltip<Data>>['showTooltip'];

const ChartTooltip = ({
  children,
  formatTooltipLabel,
}: {
  children: (
    showTooltip: ShowTooltip,
    hideTooltip: () => void,
    tooltipData: Data | undefined
  ) => ReactElement;
  formatTooltipLabel: (frequency: number) => string;
}) => {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<Data>();

  return (
    <div
      css={css`
        position: relative;
      `}
    >
      {tooltipOpen &&
        tooltipData &&
        tooltipLeft != null &&
        tooltipTop != null && (
          <TooltipWithBounds
            left={tooltipLeft + tooltipOffset}
            top={tooltipTop}
            style={{
              ...defaultStyles,
              backgroundColor: 'var(--nimbus-colors-neutral-12)',
              color: 'var(--nimbus-colors-neutral-1)',
              borderRadius: '4px',
            }}
            data-testid="chart-tooltip"
          >
            <Box paddingX="300" paddingY="150">
              {formatTooltipLabel(tooltipData.frequency)}
            </Box>
          </TooltipWithBounds>
        )}
      {children(showTooltip, hideTooltip, tooltipData)}
    </div>
  );
};

export default ChartTooltip;
