<?php

require __DIR__ . '/db-connect.php';

$guess = $_POST['guess'];
$subject_ID = $_POST['subject_ID'];
$test_condition = $_POST['condition'];

if(isset($_POST['guess'])) {
    try {
        $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "INSERT INTO pilot_data_form (subject_ID, guess, test_condition) VALUES ('$subject_ID', '$guess', '$test_condition')";

        // use exec() because no results are returned
        $conn->exec($sql);
        echo "New record created successfully";
    } catch (PDOException $e) {
        echo $sql . "<br>" . $e->getMessage();
    }

}
