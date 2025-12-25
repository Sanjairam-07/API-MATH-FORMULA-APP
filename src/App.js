import React, { useState } from 'react';
import axios from 'axios';
const SearchBar = ({ inputValue, onInputChange, onSearch, isSearching }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSearch(inputValue.trim());
        }
    };
    return (
        <form onSubmit={handleSubmit} className="search-form">
            <div className="search-container">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    placeholder="e.g., 'derivative of x^2' or '2+2*4'"
                    className="search-input"
                    disabled={isSearching}
                />
                <button type="submit" className="search-button" disabled={isSearching}>
                    {isSearching ? '...' : 'Search'}
                </button>
            </div>
        </form>
    );
};

const FormulaDisplay = ({ result, error, isLoading, onClear }) => {
    if (isLoading) {
        return (
            <div className="loader-container">
                <div className="spinner"></div>
                <p>Calculating with Math.js API...</p>
            </div>
        );
    }
    if (error) {
        return (
             <div className="result-container animate-fade-in">
                <button onClick={onClear} className="clear-button">Clear</button>
                <div className="error-text">{error}</div>
            </div>
        );
    }
    if (!result) {
        return (
            <div className="info-text animate-fade-in">
                <p>Enter a query to calculate or evaluate.</p>
                <p style={{ marginTop: '0.5rem' }}>Try "12 / (2.3 + 0.7)" or "sqrt(3^2 + 4^2)"!</p>
            </div>
        );
    }
    return (
        <div className="result-container animate-fade-in">
            <button onClick={onClear} className="clear-button">Clear</button>
            <h2>Result</h2>
            <div className="result-item">
                <h3>Your Query:</h3>
                <p>{result.query}</p>
            </div>
            <div className="result-item">
                <h3>Answer:</h3>
                <p className="answer">{result.answer}</p>
            </div>
        </div>
    );
};

const Topics = ({ onClose }) => {
  return (
    <div className="topics-container animate-fade-in">
      <h2>What can I search for?</h2>
      <p>
        This application uses the <strong>Math.js API</strong>, a powerful calculation engine. Instead of searching for named formulas, provide it with mathematical expressions to evaluate.
      </p>

      <h3>Core Capabilities</h3>
      
      <h4>1. Basic Arithmetic</h4>
      <p>Standard operations respecting their order.</p>
      <ul>
        <li>Addition (<code>+</code>), Subtraction (<code>-</code>), Multiplication (<code>*</code>), Division (<code>/</code>)</li>
        <li>Exponents (<code>^</code>), Parentheses (<code>()</code>)</li>
        <li>Example: <code>(2 + 3) * 4^2</code></li>
      </ul>
      
      <h4>2. Algebra & Derivatives</h4>
      <p>The API can simplify expressions and compute derivatives.</p>
      <ul>
        <li>Simplify : <code>simplify('2x + 3x')</code></li>
        <li>Derivatives: <code>derivative('x^3', 'x')</code></li>
        <li>Square Roots: <code>sqrt(3^2 + 4^2)</code></li>
      </ul>

      <h4>3. Unit Conversions</h4>
      <p>Convert between a huge range of different units.</p>
      <ul>
        <li>Syntax: <code>value unit to new_unit</code></li>
        <li>Example: <code>10 inch to cm</code></li>
      </ul>

      <h4>4. Trigonometry</h4>
      <p>It includes a full suite of trigonometric functions (using radians).</p>
      <ul>
          <li>Functions: <code>sin()</code>, <code>cos()</code>, <code>tan()</code>, etc.</li>
          <li>Constants: It understands <code>pi</code> and <code>e</code>.</li>
          <li>Example: <code>sin(pi / 2)</code></li>
      </ul>

      <h4>5. Matrices</h4>
      <p>Create and perform calculations with matrices.</p>
      <ul>
          <li>Define a matrix: <code>[ [1, 2], [3, 4] ]</code></li>
          <li>Find a determinant: <code>det([ [1, 2], [3, 4] ])</code></li>
          <li>Invert a matrix: <code>inv([ [1, 2], [3, 4] ])</code></li>
      </ul>
       <h4>6. Built-in Constants</h4>
        <p>It recognizes common mathematical and scientific constants.</p>
        <ul>
            <li>pi : <code>2*pi</code></li>
            <li>e : <code>e^2</code></li>
        </ul>
        <h4>7. Statistics</h4>
        <p>It can perform standard statistical calculations on arrays or matrices of data.</p>
        <ul>
            <li>Mean : <code>mean(2, 3, 4, 5)</code></li>
            <li>Median : <code>median(5, 5, 5, 5)</code></li>
            <li>Standard Deviation : <code>std(1, 2, 4, 7)</code></li>
            <li>Maximum : <code>max(3, 4, 5, 6)</code></li>
            <li>Minimum : <code>min(3, 4, 5, 6)</code></li>
        </ul>
      
      <button onClick={onClose} className="topics-back-button">
        Back to Calculator
      </button>
    </div>
  );
};


export default function App() {
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showTopics, setShowTopics] = useState(false);
    const [inputValue, setInputValue] = useState(''); 

    const handleSearch = async (query) => {
        setIsLoading(true);
        setError('');
        setSearchResult(null);
        const encodedQuery = encodeURIComponent(query);
        const API_URL = `https://api.mathjs.org/v4/?expr=${encodedQuery}`;
        try {
            const response = await axios.get(API_URL);
            setSearchResult({ query, answer: response.data });
        } catch (err) {
            setError(err.response?.data || 'Could not evaluate the expression.');
            setSearchResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setSearchResult(null);
        setError('');
        setInputValue('');
    };

    if (showTopics) {
        return (
            <div className="app-container">
                <Topics onClose={() => setShowTopics(false)} />
            </div>
        );
    }

    return (
        <div className="app-container">
            <header className="app-header">
                 <h1>Live Math Evaluator</h1>
                <p>
                    Powered by the Math.js API. Enter an expression to solve it.
                </p>
                <button 
                    onClick={() => setShowTopics(true)} 
                    className="topics-link"
                >
                    What kind of expressions can I use?
                </button>
            </header>
            
            <main>
                <SearchBar 
                    inputValue={inputValue}
                    onInputChange={setInputValue}
                    onSearch={handleSearch} 
                    isSearching={isLoading} 
                />
                <FormulaDisplay 
                    result={searchResult} 
                    error={error} 
                    isLoading={isLoading}
                    onClear={handleClear} 
                />
            </main>

            <footer>
                <p>UI by React | Calculations by Math.js</p>
            </footer>
        </div>
    );
    
}