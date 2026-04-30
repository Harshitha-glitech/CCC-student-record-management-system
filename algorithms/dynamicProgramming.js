/**
 * Dynamic Programming Algorithms Examples
 * 
 * These algorithms solve complex problems by breaking them down into simpler 
 * overlapping subproblems, storing the results to avoid redundant computations.
 */

// 1. 0/1 Knapsack Problem
// Problem: Given weights and values of n items, put these items in a knapsack of capacity W 
// to get the maximum total value. You cannot break an item (0/1 property).
function knapsack01(W, weights, values, n) {
    console.log("--- 0/1 Knapsack Problem (Dynamic Programming) ---");
    
    // Create a 2D array to store results of subproblems
    let dp = Array(n + 1).fill().map(() => Array(W + 1).fill(0));

    // Build dp[][] in bottom-up manner
    for (let i = 0; i <= n; i++) {
        for (let w = 0; w <= W; w++) {
            if (i === 0 || w === 0) {
                dp[i][w] = 0;
            } else if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    console.log("Maximum value we can obtain =", dp[n][W]);
    return dp[n][W];
}

// 2. Longest Common Subsequence (LCS)
// Problem: Given two sequences, find the length of the longest subsequence present in both of them.
function longestCommonSubsequence(text1, text2) {
    console.log("\n--- Longest Common Subsequence (Dynamic Programming) ---");
    
    let m = text1.length;
    let n = text2.length;
    let dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    // Build the dp table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    console.log(`Length of LCS for "${text1}" and "${text2}" =`, dp[m][n]);
    return dp[m][n];
}

// Example usage:
const values = [60, 100, 120];
const weights = [10, 20, 30];
const W = 50;
const n = values.length;
knapsack01(W, weights, values, n);

const str1 = "AGGTAB";
const str2 = "GXTXAYB";
longestCommonSubsequence(str1, str2);

module.exports = { knapsack01, longestCommonSubsequence };
