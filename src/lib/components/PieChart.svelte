<script lang="ts">
	import { colorPalette } from '$lib/utils/constants';
	import { Chart } from 'flowbite-svelte';
	export let data: { totalCount: number; percentages: [number, number][] };
	$: numericValues = data.percentages;
	$: series = numericValues?.map(([_, value]) => Number(value.toFixed(2)));
	$: labels = numericValues?.map(([speed, _]) => speed + 'km/h');

	const colors = numericValues?.map((d, idx) => colorPalette[idx]);

	$: options = {
		series,
		colors,
		labels,

		chart: {
			height: 320,
			width: 320,
			type: 'donut'
		},
		stroke: {
			colors: ['transparent'],
			lineCap: ''
		},
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: true,
						name: {
							show: true,
							fontFamily: 'Comfortaa',
							offsetY: 20
						},
						total: {
							showAlways: true,
							show: true,
							fontFamily: 'Comfortaa',
							fontSize: 12,
							formatter: () => data.totalCount,
							label: 'roads/speed'
						},
						value: {
							show: true,
							fontFamily: 'Comfortaa',
							offsetY: -20,
							formatter: () => data.totalCount
						}
					},
					size: '80%'
				}
			}
		},
		grid: {
			padding: {
				top: -2
			},
			width: '300px'
		},
		dataLabels: {
			enabled: false
		},
		legend: {
			position: 'bottom',
			fontFamily: 'Inter, sans-serif'
		},
		yaxis: {
			labels: {
				formatter: (value: number | string) => {
					return value + '%';
				}
			}
		},
		xaxis: {
			labels: {
				formatter: (value: number | string) => {
					return value + 'k';
				}
			},
			axisTicks: {
				show: false
			},
			axisBorder: {
				show: false
			}
		}
	};
</script>

<div class = "PieChart w-[90%]">
	<Chart {options} class="py-6 h-auto" />
</div>
