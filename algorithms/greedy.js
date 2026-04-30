/**
 * Greedy Algorithms Examples
 * 
 * These algorithms make the locally optimal choice at each stage
 * with the hope of finding a global optimum.
 */

// 1. Activity Selection Problem
// Problem: Given n activities with their start and finish times, select the maximum number 
// of activities that can be performed by a single person, assuming that a person can only 
// work on a single activity at a time.
function activitySelection(start, finish) {
    console.log("--- Activity Selection (Greedy) ---");
    let n = start.length;
    let selectedActivities = [];

    // The first activity always gets selected if sorted by finish time
    let i = 0;
    selectedActivities.push(i);

    // Consider rest of the activities
    for (let j = 1; j < n; j++) {
        // If this activity has start time greater than or equal to the finish
        // time of previously selected activity, then select it
        if (start[j] >= finish[i]) {
            selectedActivities.push(j);
            i = j;
        }
    }

    console.log("Selected activities indices:", selectedActivities);
    return selectedActivities;
}

// 2. Fractional Knapsack Problem
// Problem: Given weights and values of n items, we need to put these items in a knapsack 
// of capacity W to get the maximum total value in the knapsack.
function fractionalKnapsack(W, items) {
    console.log("\n--- Fractional Knapsack (Greedy) ---");
    
    // Sort items by value/weight ratio in descending order
    items.sort((a, b) => (b.value / b.weight) - (a.value / a.weight));

    let currentWeight = 0;
    let finalValue = 0.0;

    for (let i = 0; i < items.length; i++) {
        // If adding Item won't overflow, add it completely
        if (currentWeight + items[i].weight <= W) {
            currentWeight += items[i].weight;
            finalValue += items[i].value;
        } 
        // If we can't add current Item completely, add fractional part of it
        else {
            let remain = W - currentWeight;
            finalValue += items[i].value * (remain / items[i].weight);
            break;
        }
    }

    console.log("Maximum value we can obtain =", finalValue);
    return finalValue;
}

// Example usage:
const startTimes = [1, 3, 0, 5, 8, 5];
const finishTimes = [2, 4, 6, 7, 9, 9];
activitySelection(startTimes, finishTimes);

const items = [
    { value: 60, weight: 10 },
    { value: 100, weight: 20 },
    { value: 120, weight: 30 }
];
fractionalKnapsack(50, items);

module.exports = { activitySelection, fractionalKnapsack };
