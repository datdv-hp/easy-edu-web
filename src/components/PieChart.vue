<script setup lang="ts">
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

withDefaults(
  defineProps<{
    labels?: string[];
    data?: number[];
    backgroundColor?: string[];
  }>(),
  {
    data: () => [40, 20, 80, 10],
    backgroundColor: () => ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
  },
);
ChartJS.register(ArcElement, Tooltip, Legend);

// const chartData = {
//     labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
//     datasets: [
//         {
//             backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
//             data: [40, 20, 80, 10],
//         },
//     ],
// };

const chartOptions = {
  // responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};
</script>

<template>
  <Pie
    backgroundColor="transparent"
    :data="{
      labels,
      datasets: [
        {
          backgroundColor: backgroundColor,
          borderColor: backgroundColor,
          borderWidth: 0,
          data: data,
        },
      ],
    }"
    :options="chartOptions"
  />
</template>

<style scoped lang="scss"></style>
