export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TroubleshootingItem {
  problem: string;
  cause: string;
  solution: string;
}

export interface StageData {
  id: number;
  title: string;
  category: 'Setup' | 'Data Prep' | 'Modeling' | 'Evaluation' | 'Ethics & Submission';
  goal: string;
  conceptSummary: string;
  analogy: string;
  starterCode: string;
  expectedOutput: string;
  outputType: 'text' | 'table' | 'plot' | 'metric';
  quiz: QuizQuestion[];
  troubleshooting: TroubleshootingItem[];
  codealphaTips: string[];
}

export const STAGES: StageData[] = [
  {
    id: 1,
    title: 'Verifying Jupyter Notebook & Python Libraries',
    category: 'Setup',
    goal: 'Confirm that your Python environment (preferably 3.9+) is ready in Jupyter Notebook and verify that pandas, numpy, scikit-learn, matplotlib, and seaborn are properly installed.',
    conceptSummary: `Before writing any machine learning code, data scientists must ensure their development environment is stable and reproducible. 
In credit risk modelling, we rely on:
• NumPy for high-performance numerical arrays and matrix operations.
• Pandas for structured tabular data manipulation (DataFrames).
• Matplotlib & Seaborn for statistical plotting and exploratory visual analysis.
• Scikit-Learn for machine learning algorithms, preprocessing, and validation metrics.`,
    analogy: 'Think of this like an airline pilot doing a pre-flight cockpit check. Before attempting to fly (build models), you confirm all your instruments and control panels are responsive and verified.',
    starterCode: `# Stage 1: Environment Verification Script
import sys
import numpy as np
import pandas as pd
import sklearn
import matplotlib
import seaborn as sns

print("=== Python & Library Diagnostics ===")
print(f"Python Version    : {sys.version.split()[0]}")
print(f"NumPy Version     : {np.__version__}")
print(f"Pandas Version    : {pd.__version__}")
print(f"Scikit-Learn      : {sklearn.__version__}")
print(f"Matplotlib        : {matplotlib.__version__}")
print(f"Seaborn           : {sns.__version__}")

print("\\nTesting quick array & DataFrame creation...")
test_df = pd.DataFrame({
    'Feature': ['Annual_Income', 'Debt_Ratio', 'Past_Defaults'],
    'Test_Value': [75000, 0.28, 0]
})
print("DataFrame test passed successfully!")
print(test_df)`,
    expectedOutput: `=== Python & Library Diagnostics ===
Python Version    : 3.10.12 (or 3.9+ / 3.11+)
NumPy Version     : 1.24.3 (or 1.20+)
Pandas Version    : 2.0.3 (or 1.5+)
Scikit-Learn      : 1.3.0 (or 1.2+)
Matplotlib        : 3.7.2 (or 3.5+)
Seaborn           : 0.12.2 (or 0.11+)

Testing quick array & DataFrame creation...
DataFrame test passed successfully!
          Feature  Test_Value
0   Annual_Income     75000.0
1      Debt_Ratio         0.28
2   Past_Defaults         0.0`,
    outputType: 'text',
    quiz: [
      {
        question: 'Which Python library is primarily used for loading, filtering, and cleaning tabular financial datasets in Python?',
        options: ['Matplotlib', 'Pandas', 'Flask', 'Regex'],
        correctIndex: 1,
        explanation: 'Pandas is the industry-standard data manipulation tool providing DataFrame and Series structures designed specifically for tabular data.'
      },
      {
        question: 'What does Scikit-Learn (sklearn) provide for credit scoring projects?',
        options: ['Web scraping tools', 'Machine learning algorithms, scalers, and evaluation metrics', 'Database server hosting', 'Frontend user interfaces'],
        correctIndex: 1,
        explanation: 'Scikit-Learn provides complete implementations of classifiers (Logistic Regression, Random Forest), data preprocessors (StandardScaler), and model metrics (ROC-AUC, Confusion Matrix).'
      }
    ],
    troubleshooting: [
      {
        problem: "ModuleNotFoundError: No module named 'sklearn'",
        cause: "The scikit-learn library has not been installed into your active Python kernel.",
        solution: "Open a terminal or run inside a Jupyter cell: !pip install scikit-learn (note the hyphen in pip, while the import uses sklearn)."
      },
      {
        problem: "Jupyter kernel is using a different Python version than my terminal",
        cause: "Multiple Python environments (e.g. Conda, base, venv) exist on your machine.",
        solution: "Run 'import sys; print(sys.executable)' in a cell to see the exact Python interpreter being used by your notebook."
      },
      {
        problem: "Permission denied or pip warning during install",
        cause: "Installing packages globally without user permissions.",
        solution: "Use the '--user' flag: pip install --user pandas numpy scikit-learn matplotlib seaborn."
      }
    ],
    codealphaTips: [
      'Document your exact library versions in requirements.txt from day one.',
      'Never skip the verification step; finding an environment issue halfway through training a model wastes hours.',
      'CodeAlpha evaluates your methodical engineering practice as much as your final code.'
    ]
  },
  {
    id: 2,
    title: 'Credit Risk Domain, Dataset Selection & Target Variable',
    category: 'Data Prep',
    goal: 'Understand the core financial risk features (Income, DTI, Credit Utilization, Delinquencies) and pick an approved open dataset (e.g., Give Me Some Credit or German Credit).',
    conceptSummary: `In credit risk classification, a bank decides whether to approve a loan.
The target variable is binary:
• 0 = Non-Defaulter (Good borrower, pays on time)
• 1 = Defaulter (Bad borrower, 90+ days past due or delinquent within 2 years)

Key financial features include:
1. RevolvingUtilizationOfUnsecuredLines: Total credit balance divided by total credit limit. A ratio > 0.8 signifies financial distress.
2. DebtRatio: Monthly debt payments divided by gross monthly income (DTI).
3. MonthlyIncome: Capacity to repay.
4. NumberOfOpenCreditLinesAndLoans: Credit experience and portfolio breadth.
5. NumberOfTime30-59DaysPastDueNotWorse: Early warning payment delinquency indicator.
6. NumberOfTimes90DaysLate: Severe default indicator.`,
    analogy: 'Imagine lending $500 to a friend. You would check: Do they have an income? Are they already maxed out on three credit cards? Have they broken promises in the past? Credit scoring models automate this exact intuition at scale.',
    starterCode: `# Stage 2: Loading dataset and inspecting target distribution
import pandas as pd
import numpy as np

# Load dataset (or inspect schema)
# Typical columns: SeriousDlqin2yrs, RevolvingUtilization, DebtRatio, MonthlyIncome, etc.
df = pd.read_csv('credit_scoring_sample.csv')

print("Dataset Shape:", df.shape)
print("\\nColumns in dataset:")
print(df.columns.tolist())

# Inspect target variable distribution
target_counts = df['SeriousDlqin2yrs'].value_counts()
target_pct = df['SeriousDlqin2yrs'].value_counts(normalize=True) * 100

print("\\nTarget Variable Distribution:")
for val, count in target_counts.items():
    print(f"Class {val}: {count:,} applicants ({target_pct[val]:.2f}%)")`,
    expectedOutput: `Dataset Shape: (150000, 11)

Columns in dataset:
['SeriousDlqin2yrs', 'RevolvingUtilizationOfUnsecuredLines', 'age', 'NumberOfTime30-59DaysPastDueNotWorse', 'DebtRatio', 'MonthlyIncome', 'NumberOfOpenCreditLinesAndLoans', 'NumberOfTimes90DaysLate', 'NumberRealEstateLoansOrLines', 'NumberOfTime60-89DaysPastDueNotWorse', 'NumberOfDependents']

Target Variable Distribution:
Class 0 (Non-Defaulter): 139,974 applicants (93.32%)
Class 1 (Defaulter)    : 10,026 applicants (6.68%)`,
    outputType: 'text',
    quiz: [
      {
        question: 'Why is credit risk data almost always heavily class-imbalanced (e.g. 93% non-defaulters vs 7% defaulters)?',
        options: [
          'Because banks only approve very high-risk customers',
          'Because the vast majority of active borrowers make their payments on time',
          'Because of a bug in Pandas data loading',
          'Because defaulters are deleted from records'
        ],
        correctIndex: 1,
        explanation: 'In healthy lending environments, only a small percentage (typically 3% - 10%) of approved borrowers default. This imbalance requires specialized evaluation metrics.'
      }
    ],
    troubleshooting: [
      {
        problem: "FileNotFoundError: [Errno 2] No such file or directory: 'credit_data.csv'",
        cause: "Your Jupyter notebook working directory does not match the folder where your CSV file is saved.",
        solution: "Run 'import os; print(os.getcwd())' and 'os.listdir()' in Jupyter to see where Python is looking."
      }
    ],
    codealphaTips: [
      'Define each column clearly in a Feature Dictionary table in your Jupyter Notebook.',
      'State the exact definition of your target variable (e.g., 90+ days past due within 24 months).'
    ]
  },
  {
    id: 3,
    title: 'Exploratory Data Analysis (EDA) with Pandas & Seaborn',
    category: 'Data Prep',
    goal: 'Explore distribution of income, debt ratios, correlations, and uncover skewness or anomalies in financial data.',
    conceptSummary: `Exploratory Data Analysis (EDA) allows you to listen to what the data is telling you before rushing into training.
Crucial techniques:
• df.info() -> checks column data types and detects null counts.
• df.describe() -> statistical summary (mean, std, min, 25%, 50%, 75%, max) to detect extreme outliers.
• Correlation Matrix -> reveals collinearity and features strongly correlated with default.
• Histograms and Boxplots -> highlight severe right-skewed variables (like income and debt).`,
    analogy: 'EDA is like medical diagnostic bloodwork before prescribing treatment. You need to know normal ranges and abnormalities first.',
    starterCode: `# Stage 3: Statistical summary & correlation analysis
import pandas as pd
import numpy as np

# Quick descriptive statistics
print("=== Descriptive Statistics for Key Features ===")
stats = df[['age', 'DebtRatio', 'MonthlyIncome', 'RevolvingUtilizationOfUnsecuredLines']].describe()
print(stats.round(2))

# Correlation with target variable
correlations = df.corr()['SeriousDlqin2yrs'].sort_values(ascending=False)
print("\\n=== Correlation with Default (SeriousDlqin2yrs) ===")
print(correlations.round(3))`,
    expectedOutput: `=== Descriptive Statistics for Key Features ===
             age    DebtRatio  MonthlyIncome  RevolvingUtilization
count  150000.00    150000.00      120269.00             150000.00
mean       52.30       353.01        6670.22                  6.05
std        14.77      2037.82       14384.67                249.76
min         0.00         0.00           0.00                  0.00
25%        41.00         0.18        3400.00                  0.03
50%        52.00         0.37        5400.00                  0.15
75%        63.00         0.87        8249.00                  0.56
max       109.00    329664.00     3008750.00              50708.00

=== Correlation with Default (SeriousDlqin2yrs) ===
SeriousDlqin2yrs                        1.000
NumberOfTimes90DaysLate                 0.341
NumberOfTime30-59DaysPastDueNotWorse    0.258
NumberOfTime60-89DaysPastDueNotWorse    0.234
RevolvingUtilizationOfUnsecuredLines    0.004
DebtRatio                              -0.008
age                                    -0.115
MonthlyIncome                          -0.030`,
    outputType: 'table',
    quiz: [
      {
        question: 'Why does MonthlyIncome have a count of 120,269 when total applicants are 150,000?',
        options: [
          'Because 29,731 applicants have missing (NaN) income data',
          'Because income cannot be measured',
          'Because 29,731 applicants were underage',
          'Because Pandas truncated the dataset'
        ],
        correctIndex: 0,
        explanation: 'The difference (150,000 - 120,269 = 29,731) represents missing values (null/NaN) that must be handled during data cleaning.'
      }
    ],
    troubleshooting: [
      {
        problem: "Extreme maximum values in RevolvingUtilization (e.g. 50,708) and DebtRatio (329,664)",
        cause: "Financial datasets frequently contain data entry glitches or missing income replaced by an arbitrary ratio indicator.",
        solution: "Use quantile capping (winsorization) or investigate clipping extreme values (e.g., clipping utilization at 1.0 or 2.0)."
      }
    ],
    codealphaTips: [
      'Include at least 2 clear visualizations in your EDA: a target distribution bar chart and a correlation heatmap.',
      'Explain in plain English what the correlation coefficients tell you about credit risk.'
    ]
  },
  {
    id: 4,
    title: 'Data Cleaning: Missing Values & Outlier Handling',
    category: 'Data Prep',
    goal: 'Handle missing values in MonthlyIncome and NumberOfDependents using robust median imputation, and clip extreme outliers.',
    conceptSummary: `Real-world financial datasets are messy.
1. Missing Value Strategy:
   • For skewed variables like MonthlyIncome, Mean imputation is skewed by ultra-wealthy outliers. Median imputation is far more robust.
   • We can also create a binary indicator column 'MonthlyIncome_WasMissing' to capture whether someone did not disclose income.
2. Outlier Handling:
   • Credit utilization cannot practically exceed reasonable limits (e.g. > 100%). Capping at the 99th percentile or standard domain bounds preserves data volume without distorting logistic regression gradients.`,
    analogy: 'Imagine a student test score list where 5 students were absent. Replacing their absence with the average of test scores is distorted if one student got 1000% bonus points. The middle student score (median) gives a realistic baseline.',
    starterCode: `# Stage 4: Cleaning missing values & capping extreme outliers
import pandas as pd
import numpy as np

# 1. Check missing values count and percentage
null_summary = df.isnull().sum()
null_pct = (df.isnull().sum() / len(df)) * 100
missing_report = pd.DataFrame({'Missing_Count': null_summary, 'Percentage': null_pct})
print(missing_report[missing_report['Missing_Count'] > 0])

# 2. Impute MonthlyIncome with Median
median_income = df['MonthlyIncome'].median()
df['MonthlyIncome_WasMissing'] = df['MonthlyIncome'].isnull().astype(int)
df['MonthlyIncome'] = df['MonthlyIncome'].fillna(median_income)

# 3. Impute NumberOfDependents with Mode (most frequent = 0)
df['NumberOfDependents'] = df['NumberOfDependents'].fillna(df['NumberOfDependents'].mode()[0])

# 4. Cap extreme RevolvingUtilization at 99th percentile
p99_util = df['RevolvingUtilizationOfUnsecuredLines'].quantile(0.99)
df['RevolvingUtilization_Capped'] = df['RevolvingUtilizationOfUnsecuredLines'].clip(upper=p99_util)

print("\\nCleaning complete! Remaining missing values:", df.isnull().sum().sum())`,
    expectedOutput: `                       Missing_Count  Percentage
MonthlyIncome                  29731   19.820667
NumberOfDependents              3924    2.616000

Cleaning complete! Remaining missing values: 0`,
    outputType: 'text',
    quiz: [
      {
        question: 'Why should we prefer Median over Mean when imputing missing Monthly Income in finance?',
        options: [
          'Because Median is faster to calculate',
          'Because income distributions are heavily right-skewed by extreme high earners',
          'Because Scikit-Learn will throw an error with Mean',
          'Because Median converts integers to floats'
        ],
        correctIndex: 1,
        explanation: 'Extreme billionaires or data errors heavily pull the Mean upward. The Median represents the true 50th percentile of everyday borrowers.'
      }
    ],
    troubleshooting: [
      {
        problem: "SettingWithCopyWarning in Pandas",
        cause: "Modifying a slice of a DataFrame rather than an explicit copy.",
        solution: "Ensure you assign with .loc or create an explicit copy: df = df.copy()."
      }
    ],
    codealphaTips: [
      'CRITICAL: If you compute median for imputation, do it on the training set and apply to the test set to avoid Data Leakage!'
    ]
  },
  {
    id: 5,
    title: 'Feature Engineering & Scaling',
    category: 'Data Prep',
    goal: 'Create domain-specific risk indicators (Delinquency sum, Total loans, Debt-to-Income category) and scale numerical features with StandardScaler.',
    conceptSummary: `Feature Engineering is where domain knowledge shines in machine learning.
Valuable credit risk composite features:
1. TotalDelinquencies = (30-59 days late) + (60-89 days late) + (90+ days late)
2. HasPastDelinquency = 1 if TotalDelinquencies > 0 else 0
3. Debt_Per_Credit_Line = DebtRatio / (NumberOfOpenCreditLinesAndLoans + 1)

Why scale features?
Logistic Regression calculates weights ($w_i \cdot x_i$). If Income is in thousands ($80,000) while DebtRatio is 0.35, the optimization algorithm struggles. StandardScaler centers each feature to mean=0 and variance=1.`,
    analogy: 'Comparing income ($75,000) directly with age (45) without scaling is like measuring someone\'s weight in milligrams and height in kilometers—the model gets misled by the sheer number magnitude.',
    starterCode: `# Stage 5: Financial Feature Engineering
# Create composite delinquency score
df['TotalDelinquencies'] = (
    df['NumberOfTime30-59DaysPastDueNotWorse'] +
    df['NumberOfTime60-89DaysPastDueNotWorse'] +
    df['NumberOfTimes90DaysLate']
)

df['HasPastDefault'] = (df['NumberOfTimes90DaysLate'] > 0).astype(int)

# Create high utilization flag (> 80% credit limit utilized)
df['HighUtilizationFlag'] = (df['RevolvingUtilizationOfUnsecuredLines'] > 0.8).astype(int)

print("Engineered Features Sample:")
print(df[['TotalDelinquencies', 'HasPastDefault', 'HighUtilizationFlag']].head())`,
    expectedOutput: `Engineered Features Sample:
   TotalDelinquencies  HasPastDefault  HighUtilizationFlag
0                   2               0                    0
1                   0               0                    1
2                   1               0                    0
3                   0               0                    0
4                   1               0                    1`,
    outputType: 'table',
    quiz: [
      {
        question: 'Does a Random Forest classifier strictly require feature scaling like StandardScaler?',
        options: [
          'Yes, Random Forests will fail to converge without scaling',
          'No, tree-based models split based on order/thresholds, so scale does not affect them',
          'Only if we use more than 10 trees',
          'Only for categorical variables'
        ],
        correctIndex: 1,
        explanation: 'Decision trees look only at threshold cutoffs (> or <=) on individual features, making them invariant to monotonic scaling. However, Logistic Regression strictly requires scaling!'
      }
    ],
    troubleshooting: [
      {
        problem: "Data Leakage warning from mentor",
        cause: "Calling scaler.fit_transform(X) on the entire dataset before splitting train and test.",
        solution: "Always split first! Then: scaler.fit_transform(X_train), followed by scaler.transform(X_test)."
      }
    ],
    codealphaTips: [
      'Document the financial rationale for each engineered feature in your notebook markdown cells.'
    ]
  },
  {
    id: 6,
    title: 'Train-Test Splitting with Stratification',
    category: 'Data Prep',
    goal: 'Split data into 80% training and 20% testing sets using Stratified sampling to maintain the exact ratio of defaulters.',
    conceptSummary: `If 93% of applicants are non-defaulters and 7% are defaulters:
A standard random split might accidentally assign 9% defaulters to the train set and only 4% to the test set.
Stratified Train-Test Split ensures that both training and testing subsets have the EXACT same 93.3% / 6.7% proportion.
Why 80/20?
80% gives the model sufficient training history, while 20% held-out test data provides an unbiased evaluation benchmark.`,
    analogy: 'If you want to test whether a political survey is accurate, you ensure your sample has the same demographic distribution as the whole country.',
    starterCode: `# Stage 6: Stratified Train-Test Split & Scaling
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Define features (X) and target (y)
feature_cols = [
    'RevolvingUtilization_Capped', 'age', 'DebtRatio', 
    'MonthlyIncome', 'NumberOfOpenCreditLinesAndLoans',
    'TotalDelinquencies', 'HasPastDefault', 'HighUtilizationFlag'
]

X = df[feature_cols]
y = df['SeriousDlqin2yrs']

# Stratified split: preserves class proportions
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

print(f"X_train shape: {X_train.shape}, y_train default rate: {y_train.mean():.4f}")
print(f"X_test shape : {X_test.shape}, y_test default rate : {y_test.mean():.4f}")

# Scale features properly (fit ONLY on train!)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
print("\\nFeatures successfully scaled without data leakage!")`,
    expectedOutput: `X_train shape: (120000, 8), y_train default rate: 0.0668
X_test shape : (30000, 8), y_test default rate : 0.0668

Features successfully scaled without data leakage!`,
    outputType: 'text',
    quiz: [
      {
        question: 'Why must we call scaler.transform(X_test) instead of scaler.fit_transform(X_test)?',
        options: [
          'Because test data is smaller than train data',
          'To prevent information from the test set leaking into the scaler mean and variance',
          'Because transform runs twice as fast',
          'It is just an optional style convention'
        ],
        correctIndex: 1,
        explanation: 'Fitting on the test set is data leakage because in production, you cannot know the future test distribution parameters.'
      }
    ],
    troubleshooting: [
      {
        problem: "ValueError: Found input variables with inconsistent numbers of samples",
        cause: "X and y have different row counts, likely because rows were dropped in one but not the other.",
        solution: "Check len(X) and len(y) before splitting and ensure both come from the same index-aligned DataFrame."
      }
    ],
    codealphaTips: [
      'Always set random_state=42 (or any integer) so your mentor and peers can reproduce identical results.'
    ]
  },
  {
    id: 7,
    title: 'Implementing Baseline Model: Logistic Regression',
    category: 'Modeling',
    goal: 'Train a Logistic Regression classifier with class_weight="balanced", calculate odds ratios, and understand linear probability boundaries.',
    conceptSummary: `Why start with Logistic Regression?
In commercial banking, banking regulators (like the Basel Committee or US FCRA) require models to be explainable.
Logistic Regression maps linear combinations of features to a probability between 0 and 1 via the Sigmoid function:
$P(Default) = \\frac{1}{1 + e^{-(\\beta_0 + \\beta_1 X_1 + ... + \\beta_k X_k)}}$

Because defaults are rare (6.7%), standard Logistic Regression tends to predict 0 for everyone. Setting class_weight='balanced' penalizes the model more heavily when it misclassifies a true defaulter.`,
    analogy: 'Logistic Regression is like a weighted scorecard. Each past delinquency adds +0.8 points to your risk; each extra $10k in income subtracts -0.3 points. If the total crosses the threshold, credit is denied.',
    starterCode: `# Stage 7: Logistic Regression with balanced class weights
from sklearn.linear_model import LogisticRegression
import numpy as np
import pandas as pd

# Initialize model
log_reg = LogisticRegression(class_weight='balanced', random_state=42, max_iter=1000)

# Train on scaled training data
log_reg.fit(X_train_scaled, y_train)

# Predict probabilities on test set
y_pred_prob_lr = log_reg.predict_proba(X_test_scaled)[:, 1]
y_pred_lr = (y_pred_prob_lr >= 0.50).astype(int)

# Extract and display feature coefficients (weights)
coef_df = pd.DataFrame({
    'Feature': feature_cols,
    'Coefficient': log_reg.coef_[0],
    'Odds_Ratio': np.exp(log_reg.coef_[0])
}).sort_values(by='Coefficient', ascending=False)

print("=== Logistic Regression Feature Weights ===")
print(coef_df.round(3).to_string(index=False))`,
    expectedOutput: `=== Logistic Regression Feature Weights ===
                    Feature  Coefficient  Odds_Ratio
         TotalDelinquencies        1.142       3.133
             HasPastDefault        0.724       2.063
RevolvingUtilization_Capped        0.618       1.855
        HighUtilizationFlag        0.412       1.510
                  DebtRatio        0.089       1.093
NumberOfOpenCreditLinesAndLoans   -0.076       0.927
              MonthlyIncome       -0.184       0.832
                        age       -0.345       0.708`,
    outputType: 'table',
    quiz: [
      {
        question: 'What does a positive coefficient (e.g. +1.142 for TotalDelinquencies) mean in Logistic Regression?',
        options: [
          'As delinquencies increase, the probability of loan default increases',
          'As delinquencies increase, the probability of loan default decreases',
          'The feature has zero predictive value',
          'The feature must be removed from the model'
        ],
        correctIndex: 0,
        explanation: 'A positive coefficient means an increase in that feature increases the log-odds (and therefore the probability) of default.'
      }
    ],
    troubleshooting: [
      {
        problem: "ConvergenceWarning: lbfgs failed to converge (status=1): STOP: TOTAL NO. of ITERATIONS REACHED LIMIT",
        cause: "The optimizer didn't finish within the default 100 iterations, often due to unscaled features or complex surfaces.",
        solution: "Ensure features are scaled with StandardScaler and increase max_iter=1000."
      }
    ],
    codealphaTips: [
      'Present the Odds Ratios table in your notebook! It shows financial domain mastery.'
    ]
  },
  {
    id: 8,
    title: 'Ensemble Learning: Random Forest Classifier',
    category: 'Modeling',
    goal: 'Build an ensemble of decision trees using RandomForestClassifier, capture non-linear risk interactions, and rank feature importances.',
    conceptSummary: `Why Random Forest?
While Logistic Regression assumes linear relationships, financial behavior is often non-linear. For example, having 1 credit card is fine, 3 is good, but 25 is dangerous.
A Random Forest builds hundreds of decision trees using bagging (bootstrap aggregation) and random feature subsets.
Key Hyperparameters to discuss:
• n_estimators: Number of trees (e.g. 100).
• max_depth: Limits tree depth (e.g. 8–12) to prevent overfitting.
• min_samples_split & min_samples_leaf: Prevents trees from memorizing isolated noise.
• class_weight='balanced' or 'balanced_subsample': Accounts for rare defaults.`,
    analogy: 'Instead of trusting one loan officer (single decision tree), you gather a committee of 100 loan officers (random forest), each looking at different aspects of the borrower\'s file, and take a democratic majority vote.',
    starterCode: `# Stage 8: Random Forest Classifier
from sklearn.ensemble import RandomForestClassifier
import pandas as pd

rf_clf = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_leaf=50,
    class_weight='balanced',
    random_state=42,
    n_jobs=-1
)

# Train Random Forest
rf_clf.fit(X_train, y_train)

# Predict probabilities on test set
y_pred_prob_rf = rf_clf.predict_proba(X_test)[:, 1]
y_pred_rf = (y_pred_prob_rf >= 0.50).astype(int)

# Extract Gini feature importances
importances = pd.DataFrame({
    'Feature': feature_cols,
    'Importance': rf_clf.feature_importances_
}).sort_values(by='Importance', ascending=False)

print("=== Random Forest Feature Importances ===")
print(importances.round(4).to_string(index=False))`,
    expectedOutput: `=== Random Forest Feature Importances ===
                    Feature  Importance
         TotalDelinquencies      0.3482
RevolvingUtilization_Capped      0.2615
             HasPastDefault      0.1540
                        age      0.0812
                  DebtRatio      0.0574
              MonthlyIncome      0.0461
        HighUtilizationFlag      0.0312
NumberOfOpenCreditLinesAndLoans  0.0204`,
    outputType: 'table',
    quiz: [
      {
        question: 'Why do we set max_depth (e.g., max_depth=10) on a Random Forest instead of letting trees grow infinitely?',
        options: [
          'To make the code run slower',
          'To prevent the individual trees from overfitting and memorizing noise in the training set',
          'Because scikit-learn limits depth to 5',
          'To turn the forest into a linear regression'
        ],
        correctIndex: 1,
        explanation: 'Unconstrained trees will split down to single pure leaf nodes, resulting in high variance and severe overfitting.'
      }
    ],
    troubleshooting: [
      {
        problem: "Training takes several minutes or freezes my Jupyter kernel",
        cause: "Too many trees, unbounded depth, or single-threaded execution on large datasets.",
        solution: "Set n_jobs=-1 to utilize all CPU cores, cap max_depth=10, and start with n_estimators=100."
      }
    ],
    codealphaTips: [
      'Plot a horizontal bar chart of feature importances in Seaborn. It makes your GitHub project visually standout.'
    ]
  },
  {
    id: 9,
    title: 'Model Evaluation: Beyond Accuracy (ROC-AUC & Confusion Matrix)',
    category: 'Evaluation',
    goal: 'Understand why 93% accuracy is misleading, calculate Precision, Recall, F1-Score, and plot the ROC Curve & Precision-Recall curves.',
    conceptSummary: `The Accuracy Paradox:
If 93.3% of applicants never default, a dumb model that predicts "0" for every single person achieves 93.3% accuracy—yet catches ZERO defaulters and causes catastrophic bank insolvency!

Financial metrics that truly matter:
• Recall (Sensitivity): Out of all actual defaulters, what % did we catch? High recall prevents bad debt.
• Precision: Out of everyone we flagged as high-risk, what % actually defaulted? Low precision means turning away creditworthy customers.
• F1-Score: Harmonic mean of precision and recall.
• ROC-AUC (Area Under Receiver Operating Characteristic): Measures how well the model ranks risk across ALL possible thresholds (0.5 = random coin flip, 1.0 = perfect ranking). Excellent credit models achieve 0.82–0.87.`,
    analogy: 'Imagine a smoke alarm that never sounds. It is 99.9% accurate on days with no fire. But on the one day your house catches fire, its accuracy is useless. You need a high-recall alarm!',
    starterCode: `# Stage 9: Comprehensive Metric Evaluation
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve

# Evaluate Logistic Regression
auc_lr = roc_auc_score(y_test, y_pred_prob_lr)
auc_rf = roc_auc_score(y_test, y_pred_prob_rf)

print(f"Logistic Regression ROC-AUC : {auc_lr:.4f}")
print(f"Random Forest ROC-AUC       : {auc_rf:.4f}")

print("\\n=== Random Forest Classification Report (Threshold = 0.50) ===")
print(classification_report(y_test, y_pred_rf, target_names=['Non-Defaulter (0)', 'Defaulter (1)']))

print("=== Confusion Matrix (Random Forest) ===")
cm = confusion_matrix(y_test, y_pred_rf)
print(f"True Negatives (Approved good borrowers) : {cm[0,0]:,}")
print(f"False Positives (Denied good borrowers)  : {cm[0,1]:,}")
print(f"False Negatives (Missed bad borrowers!)  : {cm[1,0]:,}")
print(f"True Positives (Caught bad borrowers)    : {cm[1,1]:,}")`,
    expectedOutput: `Logistic Regression ROC-AUC : 0.8142
Random Forest ROC-AUC       : 0.8621

=== Random Forest Classification Report (Threshold = 0.50) ===
                   precision    recall  f1-score   support

Non-Defaulter (0)       0.98      0.82      0.89     27995
    Defaulter (1)       0.24      0.74      0.36      2005

         accuracy                           0.81     30000
        macro avg       0.61      0.78      0.63     30000
     weighted avg       0.93      0.81      0.86     30000

=== Confusion Matrix (Random Forest) ===
True Negatives (Approved good borrowers) : 22,956
False Positives (Denied good borrowers)  : 5,039
False Negatives (Missed bad borrowers!)  : 521
True Positives (Caught bad borrowers)    : 1,484`,
    outputType: 'text',
    quiz: [
      {
        question: 'In commercial loan underwriting, which error is usually far more financially costly to the bank?',
        options: [
          'False Positive: Rejecting a good applicant and losing interest revenue',
          'False Negative: Approving a bad applicant who defaults on a $50,000 principal loan balance',
          'Both errors have identical dollar costs',
          'Neither error affects bank capital'
        ],
        correctIndex: 1,
        explanation: 'Losing an entire loan principal ($20k–$100k) due to default (False Negative) is substantially worse than missing a small interest profit margin by declining a good applicant (False Positive).'
      }
    ],
    troubleshooting: [
      {
        problem: "Why is Precision on class 1 only 0.24 while ROC-AUC is 0.86?",
        cause: "Because defaults represent only 6.7% of all applicants. Even a modest false positive rate creates a pool of candidates larger than the true positive pool.",
        solution: "Adjusting the decision threshold allows banks to balance risk appetite against loan approval volume."
      }
    ],
    codealphaTips: [
      'Always present both ROC-AUC and the Confusion Matrix in your final report.',
      'Explain the financial consequence of False Negatives vs False Positives.'
    ]
  },
  {
    id: 10,
    title: 'Model Comparison & Financial Threshold Optimization',
    category: 'Evaluation',
    goal: 'Directly compare Logistic Regression vs Random Forest on ROC-AUC, Recall, and test custom decision thresholds (e.g. 0.30 vs 0.50 vs 0.70).',
    conceptSummary: `Machine learning libraries default to a classification decision threshold of 0.50 ($P \\ge 0.50 \\to Default$).
However, in risk management:
• Conservative Bank: Lowers threshold to 0.30. Anyone with > 30% predicted probability of default is flagged. Catches 85%+ of defaulters!
• Growth-Oriented Fintech: Sets threshold to 0.55 to maximize approval rates and market share, accepting higher write-offs.

A model comparison table objectively showcases which algorithm won and why.`,
    analogy: 'Setting a threshold is like setting the sensitivity knob on a metal detector at the airport. Turn it too high, it beeps at belt buckles; turn it too low, it misses weapons.',
    starterCode: `# Stage 10: Model Comparison Table & Threshold Analysis
import pandas as pd
import numpy as np
from sklearn.metrics import recall_score, precision_score, f1_score, roc_auc_score

def evaluate_threshold(probs, y_true, threshold=0.50):
    preds = (probs >= threshold).astype(int)
    return {
        'Threshold': threshold,
        'Recall': recall_score(y_true, preds),
        'Precision': precision_score(y_true, preds),
        'F1_Score': f1_score(y_true, preds)
    }

comparison_data = [
    {'Model': 'Logistic Regression', 'ROC-AUC': 0.8142, 'Recall (0.50)': 0.692, 'Precision (0.50)': 0.186, 'F1-Score': 0.293},
    {'Model': 'Random Forest',       'ROC-AUC': 0.8621, 'Recall (0.50)': 0.740, 'Precision (0.50)': 0.244, 'F1-Score': 0.367}
]

comp_df = pd.DataFrame(comparison_data)
print("=== Honest Model Comparison ===")
print(comp_df.to_string(index=False))`,
    expectedOutput: `=== Honest Model Comparison ===
              Model  ROC-AUC  Recall (0.50)  Precision (0.50)  F1-Score
Logistic Regression   0.8142          0.692             0.186     0.293
      Random Forest   0.8621          0.740             0.244     0.367`,
    outputType: 'table',
    quiz: [
      {
        question: 'What is the key trade-off when comparing Logistic Regression against Random Forest for credit scoring?',
        options: [
          'Logistic Regression is faster to download',
          'Logistic Regression provides explicit regulatory interpretability (coefficients/odds ratios), while Random Forest provides higher predictive accuracy (ROC-AUC 0.86 vs 0.81)',
          'Random Forest cannot output probabilities',
          'There is no difference between them'
        ],
        correctIndex: 1,
        explanation: 'In banking, this is the classic Interpretability vs Performance trade-off. Many institutions use Logistic Regression as the regulatory baseline and Random Forest as the challenger model.'
      }
    ],
    troubleshooting: [
      {
        problem: "Inventing fake high numbers like 99.8% precision",
        cause: "Beginner temptation to show perfect scores.",
        solution: "Credit default prediction never has 99% precision on natural distributions. Genuine ~0.84-0.87 ROC-AUC is respected by real ML engineers."
      }
    ],
    codealphaTips: [
      'CodeAlpha reviewers value honest analysis over artificially inflated numbers.',
      'Discuss the trade-off between model transparency (Logistic) and non-linear power (Random Forest).'
    ]
  },
  {
    id: 11,
    title: 'Model Interpretability, Fairness & Ethics in Credit',
    category: 'Ethics & Submission',
    goal: 'Understand fair lending laws (ECOA), why protected attributes (race, gender, religion, marital status) are prohibited, and how to interpret individual predictions.',
    conceptSummary: `Credit scoring directly impacts human lives—whether someone can buy a home, finance education, or start a business.
Ethical & Legal Requirements:
1. Equal Credit Opportunity Act (ECOA) & Fair Housing Act: Prohibits credit decisions based on race, color, religion, national origin, sex, marital status, or age.
2. Proxy Variables: Even if gender is omitted, variables like 'Title' (Mr/Mrs/Miss) or certain zip codes can act as illicit proxies.
3. Adverse Action Notices: Under FCRA, if an applicant is denied, lenders must provide clear reasons (e.g., 'High revolving debt utilization', 'History of 90+ day delinquency'). Black-box models without explainability violate this requirement!`,
    analogy: 'If an AI judge sentences people, you would demand to know the exact legal statute and reasoning behind the verdict—not just "trust the computer algorithm". Lending decisions carry the same responsibility.',
    starterCode: `# Stage 11: Simulating an Adverse Action Notice (Explainable Prediction)
import numpy as np

def generate_adverse_action_reasons(applicant_features, feature_names, importance_weights):
    """Identifies the top contributing negative factors for a denied borrower."""
    # Compute relative risk contribution
    risk_contributions = applicant_features * importance_weights
    sorted_indices = np.argsort(risk_contributions)[::-1]
    
    reasons = []
    reason_map = {
        'TotalDelinquencies': 'Multiple past delinquency records on file',
        'HasPastDefault': 'Previous severe default (90+ days past due)',
        'RevolvingUtilization_Capped': 'High credit card balance relative to credit limit (>80%)',
        'DebtRatio': 'Excessive monthly debt payments relative to monthly income',
        'HighUtilizationFlag': 'Maxed out revolving credit accounts'
    }
    
    for idx in sorted_indices[:3]:
        feat = feature_names[idx]
        if feat in reason_map:
            reasons.append(reason_map[feat])
            
    return reasons

sample_denied_applicant = np.array([0.92, 34, 0.55, 3200, 4, 3, 1, 1])
reasons = generate_adverse_action_reasons(sample_denied_applicant, feature_cols, [0.34, -0.05, 0.1, -0.08, 0.02, 0.35, 0.25, 0.15])

print("=== Simulated Adverse Action Notice (FCRA Compliant) ===")
print("Decision: Credit Application Declined")
print("Primary Reason 1:", reasons[0])
print("Primary Reason 2:", reasons[1])
print("Primary Reason 3:", reasons[2])`,
    expectedOutput: `=== Simulated Adverse Action Notice (FCRA Compliant) ===
Decision: Credit Application Declined
Primary Reason 1: Multiple past delinquency records on file
Primary Reason 2: Previous severe default (90+ days past due)
Primary Reason 3: High credit card balance relative to credit limit (>80%)`,
    outputType: 'text',
    quiz: [
      {
        question: 'Under fair lending regulations (like ECOA), why can you NOT simply include gender or ethnicity in a credit risk model?',
        options: [
          'Because Python cannot encode string categories',
          'Because it is illegal discrimination and introduces algorithmic bias against protected groups',
          'Because gender has zero correlation with anything',
          'Because banks do not store customer names'
        ],
        correctIndex: 1,
        explanation: 'Fair lending regulations explicitly forbid using protected personal attributes to prevent discriminatory lending practices.'
      }
    ],
    troubleshooting: [
      {
        problem: "Forgetting to mention ethical considerations in the project report",
        cause: "Focusing solely on coding and ignoring real-world governance.",
        solution: "Dedicate a section in your README to 'Ethical Considerations & Fair Lending'."
      }
    ],
    codealphaTips: [
      'Addressing fairness, bias, and Adverse Action notices will immediately put your project in the top 5% of intern submissions.'
    ]
  },
  {
    id: 12,
    title: 'Organizing GitHub Repo: CodeAlpha_CreditScoringModel',
    category: 'Ethics & Submission',
    goal: 'Structure a clean, professional GitHub repository with standard data science folder hierarchy, .gitignore, and requirements.txt.',
    conceptSummary: `A clean Git repository shows you work like a professional software engineer, not just a casual notebook scripter.
Target Repository Name: CodeAlpha_CreditScoringModel

Standard Directory Tree:
CodeAlpha_CreditScoringModel/
│
├── data/
│   ├── raw/                  # Original downloaded CSVs
│   └── processed/            # Cleaned, imputed training sets
├── notebooks/
│   └── 01_credit_scoring_eda_and_models.ipynb
├── src/
│   ├── __init__.py
│   ├── preprocessing.py      # Imputation, scaling functions
│   └── evaluate.py           # Metrics calculation utilities
├── .gitignore
├── requirements.txt
├── LICENSE
└── README.md`,
    analogy: 'Imagine walking into a mechanic shop where tools are tossed in piles on the floor vs one where every wrench is hung in its labeled silhouette. Recruiters and CodeAlpha mentors judge repo cleanliness immediately.',
    starterCode: `# Stage 12: Generating requirements.txt and .gitignore
requirements_txt = """
numpy>=1.22.0
pandas>=1.5.0
scikit-learn>=1.2.0
matplotlib>=3.6.0
seaborn>=0.12.0
jupyter>=1.0.0
"""

gitignore_txt = """
# Python virtual environments
venv/
env/
.env

# Jupyter checkpoints & cache
.ipynb_checkpoints/
__pycache__/
*.pyc

# Data files (keep raw large files out of Git tracking)
data/raw/*.csv
*.zip

# OS artifacts
.DS_Store
Thumbs.db
"""

print("Generated requirements.txt and .gitignore ready for your repository!")`,
    expectedOutput: `Generated requirements.txt and .gitignore ready for your repository!`,
    outputType: 'text',
    quiz: [
      {
        question: 'Why should you add .ipynb_checkpoints/ and large raw CSV files to .gitignore?',
        options: [
          'Because Git refuses to upload files ending in .csv',
          'To keep the repository lightweight, prevent bloated commit history, and avoid committing temporary auto-saves',
          'Because CSV files corrupt Git',
          'It is required by the Python interpreter'
        ],
        correctIndex: 1,
        explanation: 'Version control is for code and documentation. Large data files (>50MB) and auto-save caches bloat repositories and cause GitHub push failures.'
      }
    ],
    troubleshooting: [
      {
        problem: "git push rejected due to large file > 100MB",
        cause: "Accidentally staging a raw uncompressed CSV file before adding it to .gitignore.",
        solution: "Run: git rm --cached data/large_dataset.csv, add *.csv to .gitignore, and commit."
      }
    ],
    codealphaTips: [
      'Name your repository exactly CodeAlpha_CreditScoringModel as specified in the internship syllabus.'
    ]
  },
  {
    id: 13,
    title: 'Writing a High-Impact README.md & Documentation',
    category: 'Ethics & Submission',
    goal: 'Create a clear, structured README.md highlighting the problem statement, dataset, methodology, benchmarks table, and instructions to reproduce.',
    conceptSummary: `Your README is the storefront of your project. Mentors and hiring managers often judge a project solely by the quality of the README.
Essential Sections:
1. Project Title & CodeAlpha Internship Badge
2. Problem Overview & Financial Motivation
3. Dataset Description & Key Features
4. Methodology (Cleaning, Imputation, Stratified Split)
5. Model Comparison Benchmark Table (ROC-AUC, Recall, Precision)
6. Key Findings & Business Recommendations
7. Fair Lending & Ethical Considerations
8. Installation & How to Run
9. Author & Acknowledgements`,
    analogy: 'The README is like an executive summary on the desk of a Chief Risk Officer. If they cannot understand what you built in 60 seconds, they will not read the 500 lines of code.',
    starterCode: `# Stage 13: README Markdown Skeleton
# Preview generated README template in the Documentation Builder tab!`,
    expectedOutput: `README.md skeleton generated with full markdown formatting.`,
    outputType: 'text',
    quiz: [
      {
        question: 'What is the most effective way to present model results in a GitHub README?',
        options: [
          'A screenshot of a raw Python error message',
          'A clean markdown comparison table displaying ROC-AUC, Recall, Precision, and F1-score for each model tested',
          'Writing "My model worked well" in bold',
          'Listing every single predicted number'
        ],
        correctIndex: 1,
        explanation: 'A clean side-by-side benchmark table lets anyone instantly evaluate your models without digging through pages of raw outputs.'
      }
    ],
    troubleshooting: [
      {
        problem: "Markdown tables look broken on GitHub",
        cause: "Missing pipes (|) or inconsistent header separator lines (---|---).",
        solution: "Ensure every row starts and ends with a pipe and the header separator has at least 3 dashes per column."
      }
    ],
    codealphaTips: [
      'Add badges (Python, Scikit-Learn, Jupyter, License) at the top of your README for extra polish.'
    ]
  },
  {
    id: 14,
    title: 'LinkedIn Showcase & Video Presentation Script',
    category: 'Ethics & Submission',
    goal: 'Structure a compelling LinkedIn post and 3-minute video presentation script explaining your CodeAlpha project to recruiters.',
    conceptSummary: `To complete your internship milestone, you need to communicate your technical work clearly to the world.
Structure of an engaging LinkedIn post:
• Hook: "Can machine learning predict credit risk fairly and accurately?"
• Context: "During my Machine Learning Internship at @CodeAlpha..."
• Problem: "Predicting loan default probability while handling class imbalance (93% non-defaulters vs 7% defaulters)."
• Approach: "Engineered financial features (DTI, utilization), compared Logistic Regression vs Random Forest."
• Key Result: "Achieved 0.862 ROC-AUC with Random Forest, catching 74% of high-risk defaults."
• Ethical Takeaway: "Adhered to Fair Lending principles (ECOA) by eliminating protected bias proxies."
• Call to Action: Link to GitHub repo + tagged mentors.`,
    analogy: 'In business, great engineering without great communication remains invisible. Storytelling translates mathematical formulas into career opportunities.',
    starterCode: `# Stage 14: Ready-to-adapt LinkedIn Post & Video Outline
# Available in the Project Documentation tab!`,
    expectedOutput: `LinkedIn post copy & 3-minute video presentation script ready.`,
    outputType: 'text',
    quiz: [
      {
        question: 'What is the ideal duration and focus for an internship demo video?',
        options: [
          '45 minutes reading line-by-line code',
          '2 to 3 minutes: Problem statement -> Methodology -> Live Demo / Results -> Ethical takeaways',
          '10 seconds of background music',
          '2 hours of silent coding'
        ],
        correctIndex: 1,
        explanation: 'A concise 2-3 minute structured walkthrough demonstrates both technical mastery and executive communication skills.'
      }
    ],
    troubleshooting: [
      {
        problem: "Talking too fast or reading slides word-for-word in the video",
        cause: "Nervousness or lack of bullet-point notes.",
        solution: "Use the 3-minute script provided in the Docs tab with cue cards."
      }
    ],
    codealphaTips: [
      'Tag @CodeAlpha and use #CodeAlpha #MachineLearning #Python #DataScience in your LinkedIn post.',
      'Always include the link to your public CodeAlpha_CreditScoringModel GitHub repository.'
    ]
  }
];
