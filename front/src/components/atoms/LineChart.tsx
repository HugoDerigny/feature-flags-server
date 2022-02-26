// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/line
import { ResponsiveLine } from '@nivo/line'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

type LineChartDataType = Array<{
	id: string
	data: Array<{ x: string; y: number }>
	color?: string
}>

function LineChart({ data, style }: { data: LineChartDataType; style: 'ok' | 'ko' }) {
	const scheme = style === 'ok' ? 'set2' : 'set1'
	return (
		<ResponsiveLine
			data={data}
			margin={{ top: 20, right: 35, bottom: 25, left: -8 }}
			xScale={{ type: 'point' }}
			yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
			curve='monotoneX'
			axisTop={null}
			axisLeft={null}
			axisRight={{
				tickSize: 4,
				tickPadding: 8,
				tickRotation: 0,
				legend: 'Requêtes / heure',
				legendOffset: 0,
			}}
			axisBottom={{
				tickSize: 1,
				tickPadding: 3,
				tickRotation: 0,
				legend: 'Heure',
				legendOffset: 36,
				legendPosition: 'middle',
			}}
			colors={{ scheme }}
			enablePoints={false}
			pointColor={{ from: 'color', modifiers: [] }}
			enableGridX={false}
			lineWidth={3}
			pointSize={10}
			// pointColor={{ theme: 'background' }}
			pointBorderWidth={2}
			pointBorderColor={{ from: 'serieColor', modifiers: [] }}
			enablePointLabel={true}
			pointLabelYOffset={-24}
			enableArea={true}
			isInteractive={false}
			legends={[]}
		/>
	)
}

export default LineChart
