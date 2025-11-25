<!DOCTYPE html>
<html>
<head>
    <title>Stockvesion AI Register</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .container {
            width: 250px;
            padding: 20px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 10px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        label {
            display: block;
            margin-bottom: 10px;
        }

        input[type="text"], input[type="email"], input[type="password"] {
            width: 100%;
            height: 20px;
            margin-bottom: 20px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        button[type="submit"] {
            width: 100%;
            height: 40px;
            background-color: #4CAF50;
            color: #fff;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        button[type="submit"]:hover {
            background-color: #3e8e41;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 style="text-align: center;">Stockvesion AI Register</h1>
        <form id="register-form">
            <label for="username">Username:</label>
            <input type="text" id="username" required>
            <label for="email">Email:</label>
            <input type="email" id="email" required>
            <label for="password">Password:</label>
            <input type="password" id="password" required>
            <label for="confirm-password">Confirm Password:</label>
            <input type="password" id="confirm-password" required>
            <button type="submit">Register</button>
        </form>
    </div>

    <script>
        const form = document.getElementById('register-form');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            // Send data to server (e.g., using AJAX or fetch API)
            // For demonstration purposes, we'll just log the data
            console.log({
                username,
                email,
                password,
            });

            // Reset form
            form.reset();
        });
    </script>
</body>
</html>
