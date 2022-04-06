<?php

require __DIR__ . '/db-connect.php';


//Import values
$trial = $_POST['trial'];
$test_condition = $_POST['condition'];
$button_selected = $_POST['button_selected'];
$color_selected = $_POST['color_selected'];
$reward = $_POST['reward'];
$RT = $_POST['RT'];
$symbolLeft = $_POST['symbolLeft'];
$symbolRight = $_POST['symbolRight'];
$probLeft = $_POST['probLeft'];
$probRight = $_POST['probRight'];
$totalReward = $_POST['totalReward'];
$subject_ID = $_POST['filename'];

//Insert into table
if(isset($_POST['condition'])) {
    try {
        $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "INSERT INTO pilot_data (subject_ID, trial, test_condition, button_selected, color_selected, reward, RT, symbolLeft, symbolRight, probLeft, probRight, totalReward) VALUES ('$subject_ID', '$trial', '$test_condition', '$button_selected', '$color_selected', '$reward', '$RT', '$symbolLeft', '$symbolRight', '$probLeft', '$probRight', '$totalReward')";

        // use exec() because no results are returned
        $conn->exec($sql);
        echo "New record created successfully";
    } catch (PDOException $e) {
        echo $sql . "<br>" . $e->getMessage();
    }
}