<?php
header('Content-Type: application/json');

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['first_name'] . ' ' . $_POST['last_name'];
    $visitor_email = $_POST['email'];
    $subject = $_POST['service'] ?: 'General Inquiry';
    $phone = $_POST['phone'];
    $message = $_POST['message'];

    // Validate required fields
    if (empty($name) || empty($visitor_email) || empty($message)) {
        echo json_encode([
            'success' => false,
            'message' => 'Please fill in all required fields.'
        ]);
        exit;
    }

    // Validate email
    if (!filter_var($visitor_email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'message' => 'Please enter a valid email address.'
        ]);
        exit;
    }

    $email_from = 'amaru7127@gmail.com';
    $email_subject = 'New Form Submission from ' . $name;

    $email_body = "User Name: $name.\n".
                    "User Email: $visitor_email.\n".
                    "User Phone: $phone.\n".
                    "Subject: $subject.\n".
                    "User Message: $message .\n";

    $to = 'pmkimaru95@gmail.com';
    $headers = "From: $email_from \r\n";
    $headers .= "Reply-To: $visitor_email \r\n";

    // Send email
    if (mail($to, $email_subject, $email_body, $headers)) {
        echo json_encode([
            'success' => true,
            'message' => 'Message sent successfully! We\'ll be in touch within 2 business hours.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Sorry, there was an error sending your message. Please try again or contact us directly.'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method.'
    ]);
}
?>
