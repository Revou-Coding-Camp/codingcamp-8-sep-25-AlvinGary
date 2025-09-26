document.addEventListener("DOMContentLoaded", () => {
    // --- Greeting ---
    const welcomeName = prompt("Enter your name (optional):") || "Visitor";
    document.getElementById("welcomeName").textContent = welcomeName;

    // --- Live current time ---
    function updateTime() {
        const timeNow = new Date().toString();
        // Example: Fri Sep 26 2025 19:05:23 GMT+0700 (Western Indonesia Time)
        document.getElementById("currentTime").textContent = timeNow;
    }
    setInterval(updateTime, 1000);
    updateTime();

    // --- Validation functions ---
    function validateName(name) {
        return /^[A-Za-z\s]{3,}$/.test(name);
    }
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function validatePhone(phone) {
        return /^[0-9]{10,15}$/.test(phone);
    }
    function validateMessage(msg) {
        return msg.length >= 10;
    }
    function validateBirthDate(dateStr) {
        if (!dateStr) return false;

        // Case 1: from calendar picker (yyyy-mm-dd)
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const [year, month, day] = dateStr.split("-");
            return isValidDate(day, month, year);
        }

        // Case 2: manual typing (dd/mm/yyyy)
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
            const [day, month, year] = dateStr.split("/");
            return isValidDate(day, month, year);
        }

        return false;
    }

    function isValidDate(day, month, year) {
        const d = new Date(`${year}-${month}-${day}`);
        return (
            d &&
            d.getFullYear() == year &&
            d.getMonth() + 1 == parseInt(month) &&
            d.getDate() == parseInt(day)
        );
    }

    function validateGender() {
        return document.querySelector('input[name="gender"]:checked') !== null;
    }

    function formatToDDMMYYYY(dateStr) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const [year, month, day] = dateStr.split("-");
            return `${day}/${month}/${year}`;
        }
        return dateStr; // already dd/mm/yyyy
    }

    // --- Error handlers ---
    function setError(id, message) {
        document.getElementById(id + "Error").textContent = message;
    }
    function clearError(id) {
        document.getElementById(id + "Error").textContent = "";
    }

    // --- Auto-format birth date if typed manually ---
    const birthDateInput = document.getElementById("birthDate");

    birthDateInput.addEventListener("input", (e) => {
        if (birthDateInput.type === "date") {
            // Browser manages formatting automatically when using calendar
            return;
        }

        let value = e.target.value.replace(/\D/g, ""); // remove non-digits
        if (value.length > 8) value = value.slice(0, 8);

        let formatted = "";
        if (value.length > 0) {
            formatted = value.substring(0, 2);
        }
        if (value.length >= 3) {
            formatted += "/" + value.substring(2, 4);
        }
        if (value.length >= 5) {
            formatted += "/" + value.substring(4, 8);
        }

        e.target.value = formatted;
    });

    // --- Attach live validation ---
    function attachValidation(id, validator, message) {
        const input = document.getElementById(id);
        input.addEventListener("input", () => {
            const value = input.value.trim();
            if (!validator(value)) {
                setError(id, message);
            } else {
                clearError(id);
            }
        });
    }

    attachValidation(
        "name",
        validateName,
        "Name must be at least 3 letters (letters & spaces only)."
    );
    attachValidation("email", validateEmail, "Enter a valid email address.");
    attachValidation(
        "phone",
        validatePhone,
        "Phone must be 10–15 digits number."
    );
    attachValidation(
        "messageText",
        validateMessage,
        "Message must be at least 10 characters."
    );
    attachValidation(
        "birthDate",
        validateBirthDate,
        "Enter a valid date in dd/mm/yyyy format."
    );

    // --- Form submit ---
    const form = document.getElementById("messageForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const message = document.getElementById("messageText").value.trim();
        const birthDate = document.getElementById("birthDate").value.trim();
        const genderInput = document.querySelector(
            'input[name="gender"]:checked'
        );
        const gender = genderInput ? genderInput.value : "";

        let isValid = true;

        if (!validateName(name)) {
            setError(
                "name",
                "Name must be at least 3 letters (letters & spaces only)."
            );
            isValid = false;
        }
        if (!validateEmail(email)) {
            setError("email", "Enter a valid email address.");
            isValid = false;
        }
        if (!validatePhone(phone)) {
            setError("phone", "Phone must be 10–15 digits number.");
            isValid = false;
        }
        if (!validateBirthDate(birthDate)) {
            setError("birthDate", "Enter a valid date in dd/mm/yyyy format.");
            isValid = false;
        }
        if (!validateGender()) {
            document.getElementById("genderError").textContent =
                "Select your gender.";
            isValid = false;
        } else {
            document.getElementById("genderError").textContent = "";
        }
        if (!validateMessage(message)) {
            setError("messageText", "Message must be at least 10 characters.");
            isValid = false;
        }

        if (!isValid) return;

        // Output values
        document.getElementById("outName").textContent = name;
        document.getElementById("outEmail").textContent = email;
        document.getElementById("outPhone").textContent = phone;
        document.getElementById("outMessage").textContent = message;
        document.getElementById("outBirthDate").textContent =
            formatToDDMMYYYY(birthDate);
        document.getElementById("outGender").textContent = gender;

        form.reset();
    });

    // --- Portfolio Carousel ---
    const carousel = document.getElementById("portfolioCarousel");
    const slides = carousel.children;
    const totalSlides = slides.length;
    let index = 0;
    let autoSlide;

    function showSlide(i) {
        index = (i + totalSlides) % totalSlides;
        carousel.style.transform = `translateX(-${index * 100}%)`;
    }

    document.getElementById("prevBtn").addEventListener("click", () => {
        showSlide(index - 1);
        resetAutoSlide();
    });
    document.getElementById("nextBtn").addEventListener("click", () => {
        showSlide(index + 1);
        resetAutoSlide();
    });

    function startAutoSlide() {
        autoSlide = setInterval(() => {
            showSlide(index + 1);
        }, 4000); // every 4s
    }

    function resetAutoSlide() {
        clearInterval(autoSlide);
        startAutoSlide();
    }

    startAutoSlide();
});
