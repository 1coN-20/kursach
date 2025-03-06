document.getElementById("register-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const passwordInput = document.getElementById("password");
    const phone_number = document.getElementById("phone_number").value;
    const delivery_address = document.getElementById("delivery_address").value;
    const isAdmin = false; 

    function validatePassword(password) {
        let errorMessage = "";

        if (password.length < 8) {
            errorMessage += "Пароль должен содержать минимум 8 символов.\n";
        }
        if (!/[A-Z]/.test(password)) {
            errorMessage += "Пароль должен содержать хотя бы одну заглавную букву.\n";
        }
        if (!/\d/.test(password)) {
            errorMessage += "Пароль должен содержать хотя бы одну цифру.\n";
        }

        return errorMessage.trim();
    }

    function checkPassword() {
        const password = passwordInput.value;
        const errorMessage = validatePassword(password);

        if (errorMessage) {
            passwordInput.setCustomValidity(errorMessage);
        } else {
            passwordInput.setCustomValidity("");
        }
        passwordInput.reportValidity();
    }

    passwordInput.addEventListener("input", checkPassword);

    checkPassword();

    if (passwordInput.validationMessage) {
        return; 
    }


    try {
        const response = await fetch("http://localhost:3000/controllers/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name, password, isAdmin, phone_number, delivery_address }),
        });

        if (response.ok) {
            alert("Вы успешно зарегистрированы!");
            window.location.href = "/web/stc/pages/auth/auth.html"; 
        } else {
            alert("Ошибка: Не удалось зарегистрироваться");
        }
    } catch (error) {
        console.error("Ошибка при регистрации:", error);
        alert("Что-то пошло не так. Попробуйте позже.");
    }
});