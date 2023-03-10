const loginFormHandler = async (event) => {
	event.preventDefault();
	// Collect values from the login form
	const email = document.querySelector("#email-login").value.trim();
	const password = document.querySelector("#password-login").value.trim();

	if (email && password) {
		// Send a POST request to the API endpoint
		const response = await fetch("/api/user/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
			headers: { "Content-Type": "application/json" },
		});

		if (response.ok) {
			// If successful posting a valid user name and password, redirect to the following endpoint
			document.location.replace("/dash");
		} else {
			alert(response.statusText);
		}
	}
};

const signupFormHandler = async (event) => {
	event.preventDefault();

	const name = document.querySelector("#name-signup").value.trim();
	const email = document.querySelector("#email-signup").value.trim();
	const password = document.querySelector("#password-signup").value.trim();

	if (name && email && password) {
		const response = await fetch("/api/user", {
			//
			method: "POST",
			body: JSON.stringify({ name, email, password }),
			headers: { "Content-Type": "application/json" },
		});

		if (response.ok) {
			//if user signs up, redirects to the following place:
			document.location.replace("/dash"); //go to the dashboard
		} else {
			alert(response.statusText);
		}
	}
};

document
	.querySelector(".login-form")
	.addEventListener("submit", loginFormHandler);

document
	.querySelector(".signup-form")
	.addEventListener("submit", signupFormHandler);
