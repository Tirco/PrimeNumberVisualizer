document.addEventListener('DOMContentLoaded', () => {
    const buttonContainer = document.getElementById('button-container');
    let totalButtons = 10000; // Total number of buttons to generate
    const buttons = {}; // Keep track of buttons by number
    const TIME_LIMIT = 10000; // Set timeout limit to 10 seconds

    // Check if a number is prime
    function isPrime(num) {
        if (num < 2) return false; // 1 and numbers < 2 are not prime
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false;
        }
        return true;
    }

    // Find some factors for a non-prime number
    function findFactors(num) {
        let factors = [];
        for (let i = 1; i <= Math.sqrt(num); i++) {
            if (num % i === 0) {
                factors.push(`${i} × ${num / i}`);
            }
        }
        return factors.slice(0, 3); // Show only up to 3 factors
    }

    // Create a button for each number
    function createButton(number) {
        const button = document.createElement('button');
        button.innerText = number;
        buttons[number] = button; // Store reference to the button
        button.addEventListener('click', () => handleButtonClick(number, button));
        return button;
    }

    // Handle button click logic
    function handleButtonClick(number, button) {
        if (number === 1) {
            // Allow 1 to be toggled but no marking of multiples
            const isCurrentlyMarked = button.classList.contains('prime') || button.classList.contains('not-prime');
            if (isCurrentlyMarked) {
                button.classList.remove('prime', 'not-prime');
            } else {
                button.classList.add('not-prime');
            }
            return; // No need to mark multiples for 1
        }

        const isCurrentlyMarked = button.classList.contains('prime') || button.classList.contains('not-prime');
        
        if (isCurrentlyMarked) {
            // Uncheck: remove the styles from the number and its multiples
            unmarkMultiples(number);
        } else {
            // Check: mark the number and all its multiples
            if (isPrime(number)) {
                button.classList.add('prime');
            } else {
                button.classList.add('not-prime');
                showFactorsBubble(number, button);
            }
            markMultiplesSequentially(number);
        }
    }

    // Mark all multiples of a number with a sequential delay, but stop after TIME_LIMIT and fill the rest instantly
    function markMultiplesSequentially(number) {
        let multiple = number * 2;
        let delay = 0;
        let startTime = Date.now(); // Track start time

        function markNextMultiple() {
            if (multiple > totalButtons) return; // Stop if we've passed the total number of buttons

            const button = buttons[multiple];
            if (button && !button.classList.contains('not-prime')) {
                button.classList.add('not-prime');
                const factors = findFactors(multiple).join('<br>');
                button.title = `${multiple} is not prime! Factors: ${factors}`;
            }
            multiple += number;

            const elapsedTime = Date.now() - startTime; // Calculate elapsed time
            if (elapsedTime < TIME_LIMIT) {
                // Keep marking sequentially if we're within the time limit
                setTimeout(markNextMultiple, 50); // Keep the delay for the cascading effect
            } else {
                // Timeout reached, instantly mark the remaining multiples
                while (multiple <= totalButtons) {
                    const remainingButton = buttons[multiple];
                    if (remainingButton && !remainingButton.classList.contains('not-prime')) {
                        remainingButton.classList.add('not-prime');
                        const factors = findFactors(multiple).join('<br>');
                        remainingButton.title = `${multiple} is not prime! Factors: ${factors}`;
                    }
                    multiple += number;
                }
            }
        }

        markNextMultiple(); // Start marking the first multiple
    }

    // Unmark all multiples of a number
    function unmarkMultiples(number) {
        const button = buttons[number];
        if (button) {
            button.classList.remove('prime', 'not-prime');
        }

        let multiple = number * 2;
        while (multiple <= totalButtons) {
            const button = buttons[multiple];
            if (button) {
                button.classList.remove('not-prime');
                button.removeAttribute('title');
            }
            multiple += number;
        }
    }

    // Display factors in a bubble for non-prime numbers
    function showFactorsBubble(number, button) {
        const bubble = document.getElementById('bubble');
        const rect = button.getBoundingClientRect();
        const factors = findFactors(number).join('<br>');

        bubble.innerHTML = `${number} is not prime!<br>Factors:<br>${factors}`;
        bubble.style.top = `${rect.top + window.scrollY - 70}px`;
        bubble.style.left = `${rect.left + rect.width / 2 - 100}px`;
        bubble.style.display = 'block';

        setTimeout(() => {
            bubble.style.display = 'none';
        }, 3000);
    }

    // Generate all 10,000 buttons at once
    function generateButtons() {
        for (let i = 1; i <= totalButtons; i++) {
            buttonContainer.appendChild(createButton(i));
        }
    }

    // Mark all numbers up to totalButtons - primes as green, non-primes as red
    function markAll() {
        let currentNumber = 1;

        function markNext() {
            if (currentNumber > totalButtons) return; // Stop when we reach the limit

            const button = buttons[currentNumber];
            if (isPrime(currentNumber)) {
                button.classList.add('prime'); // Mark the prime number in green
            } else {
                button.classList.add('not-prime'); // Mark the non-prime number in red
            }

            currentNumber++;

            setTimeout(markNext, 10); // Continue marking with a small delay for smooth animation
        }

        markNext(); // Start the marking process
    }

    // Clear all primes and non-primes
    function clearAll() {
        for (let i = 1; i <= totalButtons; i++) {
            const button = buttons[i];
            button.classList.remove('prime', 'not-prime'); // Remove both classes
            button.removeAttribute('title'); // Remove any added title attributes
        }
    }

    function createMarkAllButton() {
        const controlDiv = document.createElement('div');
        controlDiv.id = 'control-buttons';
    
        const markButton = document.createElement('button');
        markButton.innerText = "Mark All";
        markButton.id = "mark-all";
        markButton.addEventListener('click', markAll);
    
        const clearButton = document.createElement('button');
        clearButton.innerText = "Clear All";
        clearButton.id = "clear-all";
        clearButton.addEventListener('click', clearAll);
    
        controlDiv.appendChild(markButton);
        controlDiv.appendChild(clearButton);
        document.body.insertBefore(controlDiv, buttonContainer);
    }
    

    // Initial load of all buttons and "Mark All" button
    generateButtons();
    createMarkAllButton();
});
